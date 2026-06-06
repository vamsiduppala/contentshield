import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AppError } from "../../common/app-error";
import { RequestUser } from "../../common/request-context";
import { AuditService } from "../../common/audit/audit.service";
import { StorageService } from "../storage/storage.service";
import { CreateUploadUrlDto } from "./dto/create-upload-url.dto";

const supportedMimeTypes = new Set(["video/mp4", "video/quicktime", "video/x-matroska", "video/webm"]);

@Injectable()
export class VideosService {
  constructor(private readonly prisma: PrismaService, private readonly storage: StorageService, private readonly audit: AuditService) {}

  async createUploadUrl(user: RequestUser, dto: CreateUploadUrlDto) {
    if (!supportedMimeTypes.has(dto.mimeType)) throw new AppError("UNSUPPORTED_FILE_TYPE", "Unsupported video file type");
    const upload = await this.storage.createPresignedUploadUrl({ organizationId: user.organizationId, fileName: dto.fileName, mimeType: dto.mimeType });
    const video = await this.prisma.video.create({
      data: {
        organizationId: user.organizationId,
        uploadedByUserId: user.id,
        originalFileName: dto.fileName.replace(/[^a-zA-Z0-9._ -]/g, "_"),
        storageKey: upload.storageKey,
        storageBucket: upload.storageBucket,
        mimeType: dto.mimeType,
        fileSizeBytes: BigInt(dto.fileSizeBytes),
        status: "uploaded"
      }
    });
    this.audit.log("video.upload_url_created", { organizationId: user.organizationId, userId: user.id, videoId: video.id });
    return { videoId: video.id, uploadUrl: upload.uploadUrl, storageKey: upload.storageKey, expiresIn: upload.expiresIn };
  }

  async confirmUpload(user: RequestUser, videoId: string) {
    const video = await this.getOwnedVideo(user, videoId);
    const confirmed = await this.prisma.video.update({ where: { id: video.id }, data: { status: "ready" } });
    this.audit.log("video.upload_confirmed", { organizationId: user.organizationId, userId: user.id, videoId });
    return confirmed;
  }

  async getVideo(user: RequestUser, videoId: string) {
    return this.getOwnedVideo(user, videoId);
  }

  async getOwnedVideo(user: RequestUser, videoId: string) {
    const video = await this.prisma.video.findFirst({ where: { id: videoId, organizationId: user.organizationId } });
    if (!video) throw new AppError("VIDEO_NOT_FOUND", "Video not found", 404);
    return video;
  }
}
