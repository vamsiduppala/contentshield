import { Injectable } from "@nestjs/common";
import { AppError } from "../../common/app-error";
import { RequestUser } from "../../common/request-context";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ScanResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async getResults(user: RequestUser, scanId: string) {
    const scan = await this.prisma.scanJob.findFirst({
      where: { id: scanId, organizationId: user.organizationId },
      include: {
        video: true,
        result: true,
        categorySummary: true,
        findings: { orderBy: { startTime: "asc" } }
      }
    });
    if (!scan) throw new AppError("SCAN_NOT_FOUND", "Scan not found", 404);
    if (!scan.result) throw new AppError("SCAN_FAILED", "Scan result is not available", 409);
    await this.prisma.processingLog.create({ data: { scanJobId: scanId, level: "info", message: "scan.results_viewed" } });
    return {
      scan: { id: scan.id, status: scan.status, createdAt: scan.createdAt, completedAt: scan.completedAt },
      video: scan.video,
      safetyScore: scan.result.safetyScore,
      verdict: scan.result.verdict,
      categories: scan.categorySummary,
      findings: scan.findings,
      aiSummary: scan.result.aiSummary,
      exportOptions: ["csv", "pdf", "editor-notes"]
    };
  }
}
