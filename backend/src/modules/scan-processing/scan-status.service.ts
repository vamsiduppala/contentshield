import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ScanStatusService {
  constructor(private readonly prisma: PrismaService) {}

  async startStep(scanId: string, name: string, progressPercent: number) {
    await this.prisma.processingStep.updateMany({ where: { scanJobId: scanId, name }, data: { status: "running", startedAt: new Date(), progressPercent: 10 } });
    await this.prisma.scanJob.update({ where: { id: scanId }, data: { status: "processing", currentStage: name, progressPercent } });
    await this.log(scanId, "info", `Started ${name}`);
  }

  async completeStep(scanId: string, name: string, progressPercent: number) {
    await this.prisma.processingStep.updateMany({ where: { scanJobId: scanId, name }, data: { status: "completed", completedAt: new Date(), progressPercent: 100 } });
    await this.prisma.scanJob.update({ where: { id: scanId }, data: { currentStage: name, progressPercent } });
    await this.log(scanId, "info", `Completed ${name}`);
  }

  async fail(scanId: string, error: Error) {
    await this.prisma.scanJob.update({ where: { id: scanId }, data: { status: "failed", errorMessage: error.message, currentStage: "failed" } });
    await this.log(scanId, "error", error.message);
  }

  async log(scanId: string, level: "info" | "warn" | "error", message: string, metadata?: Record<string, unknown>) {
    await this.prisma.processingLog.create({ data: { scanJobId: scanId, level, message, metadata: metadata as any } });
  }
}
