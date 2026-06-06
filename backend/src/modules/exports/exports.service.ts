import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { RequestUser } from "../../common/request-context";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../common/audit/audit.service";
import { EditorSessionsService } from "../editor-sessions/editor-sessions.service";
import { CreateEditorExportDto } from "./dto/create-editor-export.dto";
import { AppError } from "../../common/app-error";
import { PdfExportProvider } from "./providers/pdf-export.provider";
import { CsvExportProvider } from "./providers/csv-export.provider";
import { PremiereMarkerProvider } from "./providers/premiere-marker.provider";
import { CapcutNotesProvider } from "./providers/capcut-notes.provider";
import { StorageService } from "../storage/storage.service";

@Injectable()
export class ExportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly sessions: EditorSessionsService,
    private readonly pdf: PdfExportProvider,
    private readonly csv: CsvExportProvider,
    private readonly premiere: PremiereMarkerProvider,
    private readonly capcut: CapcutNotesProvider,
    private readonly storage: StorageService,
    @InjectQueue("editor-export") private readonly exportQueue: Queue
  ) {}

  async createPlaceholder(user: RequestUser, scanId: string, format: "csv" | "pdf" | "editor-notes") {
    const scan = await this.prisma.scanJob.findFirstOrThrow({
      where: { id: scanId, organizationId: user.organizationId },
      include: { video: true, result: true, findings: true, categorySummary: true }
    });
    if (!scan.result) throw new AppError("SCAN_RESULT_NOT_READY", "Safety Report is not ready for export", 409);
    const extension = format === "editor-notes" ? "txt" : format;
    const mimeType = format === "csv" ? "text/csv" : format === "pdf" ? "application/pdf" : "text/plain";
    const content = format === "csv"
      ? [
          "startTime,endTime,phrase,source,category,severity,suggestion,confidence",
          ...scan.findings.map((finding) => `${finding.startTime},${finding.endTime},"${finding.phrase}",${finding.source},${finding.category},${finding.severity},"${finding.suggestedReplacement}",${finding.confidence}`)
        ].join("\n")
      : `ContentShield AI Safety Report\nVideo: ${scan.video.originalFileName}\nScore: ${scan.result.safetyScore}\nVerdict: ${scan.result.verdict}\n\n${scan.result.aiSummary}\n\nFindings:\n${scan.findings.map((finding) => `- ${finding.startTime}s ${finding.phrase} (${finding.severity}) -> ${finding.suggestedReplacement}`).join("\n")}`;
    const storageKey = `${user.organizationId}/exports/safety-reports/${scanId}.${extension}`;
    const downloadUrl = await this.storage.putObject({ storageKey, content, mimeType });
    await this.prisma.processingLog.create({ data: { scanJobId: scanId, level: "info", message: "export.created", metadata: { format } } });
    this.audit.log("export.created", { organizationId: user.organizationId, userId: user.id, scanId, metadata: { format } });
    return {
      exportJobId: `safety_${format}_${scanId}`,
      status: "completed",
      format,
      storageKey,
      downloadUrl
    };
  }

  async createEditorExport(user: RequestUser, scanId: string, dto: CreateEditorExportDto) {
    const session = await this.sessions.getSessionForScan(user, scanId);
    const job = await this.prisma.exportJob.create({
      data: {
        organizationId: user.organizationId,
        editorSessionId: session.id,
        scanJobId: scanId,
        requestedByUserId: user.id,
        format: dto.format
      }
    });
    await this.exportQueue.add("editor.export", { exportJobId: job.id });
    this.audit.log("editor.export_requested", { organizationId: user.organizationId, userId: user.id, scanId, metadata: { format: dto.format } });
    return job;
  }

  async listEditorExports(user: RequestUser, scanId: string) {
    const session = await this.sessions.getSessionForScan(user, scanId);
    return this.prisma.exportJob.findMany({ where: { editorSessionId: session.id, organizationId: user.organizationId }, orderBy: { createdAt: "desc" } });
  }

  async getEditorExport(user: RequestUser, exportJobId: string) {
    const job = await this.prisma.exportJob.findFirst({ where: { id: exportJobId, organizationId: user.organizationId } });
    if (!job) throw new AppError("EXPORT_NOT_FOUND", "Export job not found", 404);
    return job;
  }

  async processEditorExport(exportJobId: string) {
    const job = await this.prisma.exportJob.update({ where: { id: exportJobId }, data: { status: "processing" } });
    try {
      const payload = await this.buildExportPayload(job.editorSessionId);
      const provider = job.format === "pdf" ? this.pdf : job.format === "csv" ? this.csv : job.format === "premiere_markers" ? this.premiere : job.format === "capcut_notes" ? this.capcut : { generate: async () => ({ content: JSON.stringify(payload, null, 2), mimeType: "application/json", extension: "json" }) };
      const output = await provider.generate(payload);
      const storageKey = `${job.organizationId}/exports/editor/${job.id}.${output.extension}`;
      const downloadUrl = await this.storage.putObject({ storageKey, content: output.content, mimeType: output.mimeType });
      const completed = await this.prisma.exportJob.update({ where: { id: job.id }, data: { status: "completed", storageKey, downloadUrl, completedAt: new Date() } });
      this.audit.log("editor.export_completed", { organizationId: job.organizationId, userId: job.requestedByUserId, scanId: job.scanJobId, metadata: { format: job.format, mimeType: output.mimeType } });
      return completed;
    } catch (error) {
      const failed = await this.prisma.exportJob.update({ where: { id: job.id }, data: { status: "failed", errorMessage: (error as Error).message } });
      this.audit.log("editor.export_failed", { organizationId: job.organizationId, userId: job.requestedByUserId, scanId: job.scanJobId, metadata: { error: (error as Error).message } });
      return failed;
    }
  }

  private async buildExportPayload(editorSessionId: string) {
    const [session, actions, notes] = await Promise.all([
      this.prisma.editorSession.findUniqueOrThrow({ where: { id: editorSessionId } }),
      this.prisma.findingAction.findMany({ where: { editorSessionId }, orderBy: { createdAt: "asc" } }),
      this.prisma.editorNote.findMany({ where: { editorSessionId } })
    ]);
    return { session, actions, notes, summary: { totalFindings: session.totalFindings, completionPercentage: session.completionPercentage } };
  }
}
