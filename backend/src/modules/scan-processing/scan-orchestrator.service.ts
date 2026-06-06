import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CaptionsService } from "../captions/captions.service";
import { NotificationsService } from "../notifications/notifications.service";
import { AuditService } from "../../common/audit/audit.service";
import { OcrService } from "../ocr/ocr.service";
import { RiskAnalysisService } from "../risk-analysis/risk-analysis.service";
import { ScoringService } from "../scoring/scoring.service";
import { TranscriptionService } from "../transcription/transcription.service";
import { ScanStatusService } from "./scan-status.service";

@Injectable()
export class ScanOrchestratorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly status: ScanStatusService,
    private readonly transcription: TranscriptionService,
    private readonly ocr: OcrService,
    private readonly captions: CaptionsService,
    private readonly risk: RiskAnalysisService,
    private readonly scoring: ScoringService,
    private readonly notifications: NotificationsService,
    private readonly audit: AuditService
  ) {}

  async process(scanId: string) {
    try {
      const scan = await this.prisma.scanJob.findUniqueOrThrow({ where: { id: scanId }, include: { video: true } });
      await this.prisma.scanJob.update({ where: { id: scanId }, data: { startedAt: new Date(), status: "processing" } });
      this.audit.log("scan.started", { organizationId: scan.organizationId, scanId });

      await this.status.startStep(scanId, "prepare_video", 5);
      await this.prisma.video.update({ where: { id: scan.videoId }, data: { durationSeconds: 522, width: 1920, height: 1080, status: "processing" } });
      await this.status.completeStep(scanId, "prepare_video", 12);

      await this.status.startStep(scanId, "extract_audio", 18);
      await this.status.completeStep(scanId, "extract_audio", 24);

      await this.status.startStep(scanId, "transcribe_speech", 32);
      const transcript = await this.transcription.transcribe(scanId);
      await this.prisma.transcriptSegment.createMany({ data: transcript.map((item) => ({ ...item, scanJobId: scanId, source: "speech" })) });
      await this.status.completeStep(scanId, "transcribe_speech", 42);

      await this.status.startStep(scanId, "scan_ocr", 50);
      const ocrSegments = await this.ocr.scanFrames(scanId, scan.scanDepth);
      await this.prisma.ocrSegment.createMany({ data: ocrSegments.map((item) => ({ ...item, scanJobId: scanId, source: "onscreen_text" })) });
      await this.status.completeStep(scanId, "scan_ocr", 58);

      await this.status.startStep(scanId, "parse_captions", 64);
      const captions = await this.captions.parseCaptions();
      await this.prisma.captionSegment.createMany({ data: captions.map((item) => ({ ...item, scanJobId: scanId, source: "caption" })) });
      await this.status.completeStep(scanId, "parse_captions", 70);

      await this.status.startStep(scanId, "detect_risk", 78);
      const riskInputs = [
        ...transcript.map((item) => ({ startTime: item.startTime, endTime: item.endTime, text: item.text, source: "speech" as const })),
        ...ocrSegments.map((item) => ({ startTime: item.startTime, endTime: item.endTime, text: item.detectedText, source: "onscreen_text" as const })),
        ...captions.map((item) => ({ startTime: item.startTime, endTime: item.endTime, text: item.text, source: "caption" as const }))
      ];
      const findings = await this.risk.detectRisks(riskInputs);
      await this.prisma.riskFinding.createMany({
        data: findings.map((finding) => ({
          ...finding,
          scanJobId: scanId,
          normalizedPhrase: finding.phrase.toLowerCase(),
          suggestedReplacements: finding.suggestedReplacements
        }))
      });
      await this.status.completeStep(scanId, "detect_risk", 84);

      await this.status.startStep(scanId, "generate_score", 90);
      const score = this.scoring.score(findings);
      await this.createCategorySummaries(scanId, findings);
      await this.status.completeStep(scanId, "generate_score", 94);

      await this.status.startStep(scanId, "finalize_result", 98);
      const counts = {
        lowCount: findings.filter((item) => item.severity === "low").length,
        mediumCount: findings.filter((item) => item.severity === "medium").length,
        highCount: findings.filter((item) => item.severity === "high").length,
        criticalCount: findings.filter((item) => item.severity === "critical").length
      };
      await this.prisma.scanResult.create({
        data: {
          scanJobId: scanId,
          organizationId: scan.organizationId,
          safetyScore: score.safetyScore,
          verdict: score.verdict as any,
          totalFindings: findings.length,
          ...counts,
          aiSummary: "This video contains advertiser-sensitive terms related to conflict, death, and political violence. Highest-risk moments appear between 01:10 and 03:40.",
          modelVersion: "mock-ai-2026-06",
          generatedAt: new Date()
        }
      });
      await this.prisma.scanJob.update({ where: { id: scanId }, data: { status: "completed", progressPercent: 100, currentStage: "completed", completedAt: new Date() } });
      await this.prisma.video.update({ where: { id: scan.videoId }, data: { status: "ready" } });
      await this.status.completeStep(scanId, "finalize_result", 100);
      this.audit.log("scan.completed", { organizationId: scan.organizationId, scanId, videoId: scan.videoId });
      await this.notifications.scanCompleted(scanId, scan.organizationId);
    } catch (error) {
      await this.status.fail(scanId, error as Error);
      throw error;
    }
  }

  private async createCategorySummaries(scanId: string, findings: Array<{ category: string; severity: "low" | "medium" | "high" | "critical"; confidence: number }>) {
    const categories = Array.from(new Set(findings.map((item) => item.category)));
    await this.prisma.riskCategorySummary.createMany({
      data: categories.map((category) => {
        const group = findings.filter((item) => item.category === category);
        return {
          scanJobId: scanId,
          category,
          findingCount: group.length,
          highestSeverity: group.some((item) => item.severity === "critical") ? "critical" : group.some((item) => item.severity === "high") ? "high" : group.some((item) => item.severity === "medium") ? "medium" : "low",
          confidenceAverage: group.reduce((sum, item) => sum + item.confidence, 0) / group.length,
          scoreImpact: group.length * 4
        };
      })
    });
  }
}
