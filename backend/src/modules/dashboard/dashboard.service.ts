import { Injectable } from "@nestjs/common";
import { RequestUser } from "../../common/request-context";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(user: RequestUser) {
    const [totalScans, completed, recentScans, categories] = await Promise.all([
      this.prisma.scanJob.count({ where: { organizationId: user.organizationId } }),
      this.prisma.scanResult.findMany({ where: { organizationId: user.organizationId } }),
      this.prisma.scanJob.findMany({ where: { organizationId: user.organizationId }, include: { video: true, result: true }, take: 5, orderBy: { createdAt: "desc" } }),
      this.prisma.riskCategorySummary.groupBy({ by: ["category"], where: { scanJob: { organizationId: user.organizationId } }, _sum: { findingCount: true }, orderBy: { _sum: { findingCount: "desc" } }, take: 5 })
    ]);
    const averageSafetyScore = completed.length ? Math.round(completed.reduce((sum, item) => sum + item.safetyScore, 0) / completed.length) : 0;
    return {
      totalScans,
      averageSafetyScore,
      highRiskVideos: completed.filter((item) => item.verdict === "high_risk" || item.verdict === "critical_risk").length,
      recentScans,
      monthlyScanUsage: { used: totalScans, limit: 150 },
      riskTrend: completed.slice(-7).map((item) => ({ date: item.createdAt, score: item.safetyScore })),
      mostCommonRiskCategories: categories
    };
  }
}
