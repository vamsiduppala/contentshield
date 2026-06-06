import { Injectable } from "@nestjs/common";
import { AppError } from "../../common/app-error";
import { AuditService } from "../../common/audit/audit.service";
import { RequestUser } from "../../common/request-context";
import { PrismaService } from "../../prisma/prisma.service";
import { ReviewProgressService } from "../review-progress/review-progress.service";

@Injectable()
export class EditorSessionsService {
  constructor(private readonly prisma: PrismaService, private readonly progress: ReviewProgressService, private readonly audit: AuditService) {}

  async getOrCreate(user: RequestUser, scanId: string) {
    const scan = await this.loadCompletedScan(user, scanId);
    const existing = await this.prisma.editorSession.findUnique({ where: { scanJobId: scan.id } });
    if (existing) return this.hydrate(existing.id);

    const findings = await this.prisma.riskFinding.findMany({ where: { scanJobId: scan.id } });
    const session = await this.prisma.editorSession.create({
      data: {
        organizationId: user.organizationId,
        scanJobId: scan.id,
        videoId: scan.videoId,
        createdByUserId: user.id,
        totalFindings: findings.length,
        pendingCount: findings.length,
        reviewStates: { create: findings.map((finding) => ({ riskFindingId: finding.id })) }
      }
    });
    await this.seedReplacementSuggestions(findings);
    await this.progress.recalculate(session.id);
    this.audit.log("editor.session_created", { organizationId: user.organizationId, userId: user.id, scanId });
    return this.hydrate(session.id);
  }

  async start(user: RequestUser, scanId: string) {
    this.ensureEditorRole(user);
    const session = await this.getSessionForScan(user, scanId);
    if (session.status === "locked" || session.status === "completed") throw new AppError("SESSION_LOCKED", "Editor Session is locked", 423);
    const updated = await this.prisma.editorSession.update({ where: { id: session.id }, data: { status: "in_progress", startedAt: new Date() } });
    this.audit.log("editor.session_started", { organizationId: user.organizationId, userId: user.id, scanId });
    return updated;
  }

  async complete(user: RequestUser, scanId: string) {
    this.ensureEditorRole(user);
    const session = await this.getSessionForScan(user, scanId);
    const progress = await this.progress.recalculate(session.id);
    if (!progress.canCompleteReview) throw new AppError("REVIEW_INCOMPLETE", "All findings must be handled before completing review.");
    const completed = await this.prisma.editorSession.update({ where: { id: session.id }, data: { status: "completed", completedAt: new Date(), lockedAt: new Date() } });
    this.audit.log("editor.review_completed", { organizationId: user.organizationId, userId: user.id, scanId });
    return completed;
  }

  async summary(user: RequestUser, scanId: string) {
    const session = await this.getSessionForScan(user, scanId);
    const [result, states, actions, notes] = await Promise.all([
      this.prisma.scanResult.findUnique({ where: { scanJobId: scanId } }),
      this.prisma.findingReviewState.findMany({ where: { editorSessionId: session.id }, include: {} }),
      this.prisma.findingAction.findMany({ where: { editorSessionId: session.id }, orderBy: { createdAt: "asc" } }),
      this.prisma.editorNote.findMany({ where: { editorSessionId: session.id } })
    ]);
    const findings = await this.prisma.riskFinding.findMany({ where: { scanJobId: scanId } });
    const handled = states.filter((state) => state.status !== "ignored" && state.status !== "pending");
    const updatedEstimatedSafetyScore = Math.min(100, (result?.safetyScore || 0) + handled.reduce((sum, state) => {
      const finding = findings.find((item) => item.id === state.riskFindingId);
      return sum + (finding?.severity === "critical" ? 10 : finding?.severity === "high" ? 6 : finding?.severity === "medium" ? 3 : 1);
    }, 0));
    return {
      session,
      originalSafetyScore: result?.safetyScore || 0,
      updatedEstimatedSafetyScore,
      unresolvedRiskCount: states.filter((state) => state.status === "pending").length,
      remainingCriticalCount: findings.filter((finding) => finding.severity === "critical" && states.find((state) => state.riskFindingId === finding.id)?.status === "pending").length,
      remainingHighCount: findings.filter((finding) => finding.severity === "high" && states.find((state) => state.riskFindingId === finding.id)?.status === "pending").length,
      actions,
      notes
    };
  }

  async getSessionForScan(user: RequestUser, scanId: string) {
    const session = await this.prisma.editorSession.findFirst({ where: { scanJobId: scanId, organizationId: user.organizationId } });
    if (!session) throw new AppError("EDITOR_SESSION_NOT_FOUND", "Editor Session not found", 404);
    return session;
  }

  private async hydrate(editorSessionId: string) {
    const session = await this.prisma.editorSession.findUniqueOrThrow({ where: { id: editorSessionId } });
    const [scan, video, scanResult, findings, reviewStates, transcriptSegments, ocrSegments, captionSegments, progress] = await Promise.all([
      this.prisma.scanJob.findUniqueOrThrow({ where: { id: session.scanJobId } }),
      this.prisma.video.findUniqueOrThrow({ where: { id: session.videoId } }),
      this.prisma.scanResult.findUnique({ where: { scanJobId: session.scanJobId } }),
      this.prisma.riskFinding.findMany({ where: { scanJobId: session.scanJobId }, orderBy: { startTime: "asc" } }),
      this.prisma.findingReviewState.findMany({ where: { editorSessionId } }),
      this.prisma.transcriptSegment.findMany({ where: { scanJobId: session.scanJobId } }),
      this.prisma.ocrSegment.findMany({ where: { scanJobId: session.scanJobId } }),
      this.prisma.captionSegment.findMany({ where: { scanJobId: session.scanJobId } }),
      this.progress.recalculate(editorSessionId)
    ]);
    return { session, scan, video, scanResult, findings, reviewStates, transcriptSegments, ocrSegments, captionSegments, progress };
  }

  private async loadCompletedScan(user: RequestUser, scanId: string) {
    const scan = await this.prisma.scanJob.findFirst({ where: { id: scanId, organizationId: user.organizationId } });
    if (!scan) throw new AppError("SCAN_NOT_FOUND", "Scan not found", 404);
    if (scan.status !== "completed") throw new AppError("SCAN_NOT_COMPLETED", "Editor Session can only be created for completed scans", 409);
    return scan;
  }

  private ensureEditorRole(user: RequestUser) {
    if (user.role === "viewer") throw new AppError("ROLE_NOT_ALLOWED", "Viewer role cannot modify editor sessions", 403);
  }

  private async seedReplacementSuggestions(findings: Array<{ id: string; phrase: string; suggestedReplacement: string; suggestedReplacements: any }>) {
    await Promise.all(findings.map(async (finding) => {
      const replacements = Array.isArray(finding.suggestedReplacements) ? finding.suggestedReplacements : [finding.suggestedReplacement];
      await this.prisma.replacementSuggestion.createMany({
        data: replacements.map((replacement: string) => ({ riskFindingId: finding.id, phrase: finding.phrase, replacement, confidence: 0.86, source: "ai" })),
        skipDuplicates: true
      });
    }));
  }
}
