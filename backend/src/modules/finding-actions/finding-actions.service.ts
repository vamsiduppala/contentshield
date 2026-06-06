import { Injectable } from "@nestjs/common";
import { AppError } from "../../common/app-error";
import { AuditService } from "../../common/audit/audit.service";
import { RequestUser } from "../../common/request-context";
import { PrismaService } from "../../prisma/prisma.service";
import { EditorSessionsService } from "../editor-sessions/editor-sessions.service";
import { ReviewProgressService } from "../review-progress/review-progress.service";
import { CreateFindingActionDto } from "./dto/create-finding-action.dto";

const actionToStatus = {
  beep: "beeped",
  mute: "muted",
  blur: "blurred",
  replace: "replaced",
  fix: "fixed",
  ignore: "ignored"
} as const;

const actionAuditEvent = {
  beep: "editor.action_beeped",
  mute: "editor.action_muted",
  blur: "editor.action_blurred",
  replace: "editor.action_replaced",
  fix: "editor.action_fixed",
  ignore: "editor.action_ignored"
} as const;

@Injectable()
export class FindingActionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessions: EditorSessionsService,
    private readonly progress: ReviewProgressService,
    private readonly audit: AuditService
  ) {}

  async apply(user: RequestUser, scanId: string, findingId: string, dto: CreateFindingActionDto) {
    this.ensureEditorRole(user);
    const session = await this.sessions.getSessionForScan(user, scanId);
    if (session.status === "locked" || session.status === "completed") throw new AppError("SESSION_LOCKED", "Editor Session is locked", 423);
    const finding = await this.getFinding(scanId, findingId);
    if (dto.actionType === "replace" && !dto.replacementPhrase) throw new AppError("INVALID_EDITOR_ACTION", "Replacement phrase is required");
    if (dto.actionType === "ignore" && (finding.severity === "high" || finding.severity === "critical") && !dto.reason) {
      throw new AppError("CRITICAL_IGNORE_REASON_REQUIRED", "Ignoring high or critical findings requires a reason");
    }
    if (dto.actionType === "note") throw new AppError("INVALID_EDITOR_ACTION", "Use notes endpoint for editor notes");

    const action = await this.prisma.$transaction(async (tx) => {
      const created = await tx.findingAction.create({
        data: {
          editorSessionId: session.id,
          riskFindingId: finding.id,
          userId: user.id,
          actionType: dto.actionType,
          startTime: dto.startTime,
          endTime: dto.endTime,
          originalPhrase: finding.phrase,
          replacementPhrase: dto.replacementPhrase,
          reason: dto.reason,
          metadata: (dto.metadata || {}) as any
        }
      });
      await tx.findingReviewState.update({
        where: { editorSessionId_riskFindingId: { editorSessionId: session.id, riskFindingId: finding.id } },
        data: {
          status: actionToStatus[dto.actionType as keyof typeof actionToStatus],
          selectedReplacement: dto.replacementPhrase,
          reviewedByUserId: user.id,
          reviewedAt: new Date()
        }
      });
      return created;
    });
    await this.progress.recalculate(session.id);
    this.audit.log(actionAuditEvent[dto.actionType as keyof typeof actionAuditEvent], { organizationId: user.organizationId, userId: user.id, scanId, metadata: { findingId } });
    return action;
  }

  async history(user: RequestUser, scanId: string, findingId: string) {
    const session = await this.sessions.getSessionForScan(user, scanId);
    return this.prisma.findingAction.findMany({ where: { editorSessionId: session.id, riskFindingId: findingId }, orderBy: { createdAt: "desc" } });
  }

  async undo(user: RequestUser, scanId: string, findingId: string) {
    this.ensureEditorRole(user);
    const session = await this.sessions.getSessionForScan(user, scanId);
    const latest = await this.prisma.findingAction.findFirst({ where: { editorSessionId: session.id, riskFindingId: findingId }, orderBy: { createdAt: "desc" } });
    if (!latest) throw new AppError("INVALID_EDITOR_ACTION", "No action to undo");
    await this.prisma.$transaction([
      this.prisma.findingAction.create({
        data: { editorSessionId: session.id, riskFindingId: findingId, userId: user.id, actionType: "undo", startTime: latest.startTime, endTime: latest.endTime, originalPhrase: latest.originalPhrase, metadata: { undoneActionId: latest.id } }
      }),
      this.prisma.findingReviewState.update({ where: { editorSessionId_riskFindingId: { editorSessionId: session.id, riskFindingId: findingId } }, data: { status: "pending", selectedReplacement: null, reviewedByUserId: null, reviewedAt: null } })
    ]);
    await this.progress.recalculate(session.id);
    return { status: "pending" };
  }

  private async getFinding(scanId: string, findingId: string) {
    const finding = await this.prisma.riskFinding.findFirst({ where: { id: findingId, scanJobId: scanId } });
    if (!finding) throw new AppError("FINDING_NOT_FOUND", "Risk Finding not found", 404);
    return finding;
  }

  private ensureEditorRole(user: RequestUser) {
    if (user.role === "viewer") throw new AppError("ROLE_NOT_ALLOWED", "Viewer role cannot apply Finding Actions", 403);
  }
}
