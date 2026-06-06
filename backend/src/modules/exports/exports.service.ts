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
    @InjectQueue("editor-export") private readonly exportQueue: Queue
  ) {}

  async createPlaceholder(user: RequestUser, scanId: string, format: "csv" | "pdf" | "editor-notes") {
    await this.prisma.scanJob.findFirstOrThrow({ where: { id: scanId, organizationId: user.organizationId } });
    await this.prisma.processingLog.create({ data: { scanJobId: scanId, level: "info", message: "export.created", metadata: { format } } });
    this.audit.log("export.created", { organizationId: user.organizationId, userId: user.id, scanId, metadata: { format } });
    return {
      exportJobId: `export_${format}_${scanId}`,
      status: "ready",
      format,
      downloadUrl: `https://mock-s3.local/exports/${scanId}.${format === "editor-notes" ? "txt" : format}`
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
      const storageKey = `exports/editor/${job.id}.${output.extension}`;
      const completed = await this.prisma.exportJob.update({ where: { id: job.id }, data: { status: "completed", storageKey, downloadUrl: `https://mock-s3.local/${storageKey}`, completedAt: new Date() } });
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
