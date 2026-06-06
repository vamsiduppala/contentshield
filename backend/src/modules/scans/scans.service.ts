import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { AppError } from "../../common/app-error";
import { RequestUser } from "../../common/request-context";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../common/audit/audit.service";
import { VideosService } from "../videos/videos.service";
import { CreateScanDto } from "./dto/create-scan.dto";
import { ScanHistoryQueryDto } from "./dto/scan-history-query.dto";

const stepNames = [
  "prepare_video",
  "extract_audio",
  "transcribe_speech",
  "scan_ocr",
  "parse_captions",
  "detect_risk",
  "generate_score",
  "finalize_result"
];

@Injectable()
export class ScansService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly videos: VideosService,
    @InjectQueue("scan") private readonly scanQueue: Queue,
    private readonly audit: AuditService
  ) {}

  async createScan(user: RequestUser, dto: CreateScanDto) {
    if (user.role === "viewer") throw new AppError("TENANT_ACCESS_DENIED", "Viewers cannot create scans", 403);
    const video = await this.videos.getOwnedVideo(user, dto.videoId);
    if (video.status !== "ready") throw new AppError("VIDEO_UPLOAD_NOT_CONFIRMED", "Video upload is not confirmed");
    await this.enforceUsageLimit(user.organizationId);

    const scan = await this.prisma.scanJob.create({
      data: {
        organizationId: user.organizationId,
        videoId: video.id,
        createdByUserId: user.id,
        scanDepth: dto.scanDepth,
        platformPreset: dto.platformPreset,
        contentType: dto.contentType,
        language: dto.language,
        config: { ...dto.enabledChecks },
        steps: { create: stepNames.map((name) => ({ name })) },
        logs: { create: { level: "info", message: "Scan Job created", metadata: { videoId: video.id } } }
      }
    });

    await this.scanQueue.add("scan.process", { scanId: scan.id, organizationId: user.organizationId });
    this.audit.log("scan.created", { organizationId: user.organizationId, userId: user.id, scanId: scan.id, videoId: video.id });
    return { scanId: scan.id, status: scan.status };
  }

  async getStatus(user: RequestUser, scanId: string) {
    const scan = await this.getOwnedScan(user, scanId);
    const [processingSteps, logs] = await Promise.all([
      this.prisma.processingStep.findMany({ where: { scanJobId: scan.id }, orderBy: { id: "asc" } }),
      this.prisma.processingLog.findMany({ where: { scanJobId: scan.id }, orderBy: { createdAt: "desc" }, take: 20 })
    ]);
    return { status: scan.status, progressPercent: scan.progressPercent, currentStage: scan.currentStage, processingSteps, logs, estimatedCompletionSeconds: 120 };
  }

  async getHistory(user: RequestUser, query: ScanHistoryQueryDto) {
    const skip = (query.page - 1) * query.limit;
    const where: any = { organizationId: user.organizationId };
    if (query.status) where.status = query.status;
    const [items, total] = await Promise.all([
      this.prisma.scanJob.findMany({ where, skip, take: query.limit, include: { video: true, result: true }, orderBy: { createdAt: query.sort === "date_asc" ? "asc" : "desc" } }),
      this.prisma.scanJob.count({ where })
    ]);
    const filtered = query.verdict ? items.filter((item) => item.result?.verdict === query.verdict) : items;
    return { items: filtered, page: query.page, limit: query.limit, total };
  }

  async getOwnedScan(user: RequestUser, scanId: string) {
    const scan = await this.prisma.scanJob.findFirst({ where: { id: scanId, organizationId: user.organizationId } });
    if (!scan) throw new AppError("SCAN_NOT_FOUND", "Scan not found", 404);
    return scan;
  }

  private async enforceUsageLimit(organizationId: string) {
    const used = await this.prisma.scanJob.count({ where: { organizationId, createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } });
    const limit = 150;
    if (used >= limit) throw new AppError("USAGE_LIMIT_EXCEEDED", "Monthly scan usage limit reached", 402);
  }
}
