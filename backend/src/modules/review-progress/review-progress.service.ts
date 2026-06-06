import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ReviewProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async recalculate(editorSessionId: string) {
    const states = await this.prisma.findingReviewState.findMany({ where: { editorSessionId } });
    const count = (status: string) => states.filter((state) => state.status === status).length;
    const totalFindings = states.length;
    const pendingCount = count("pending");
    const data = {
      totalFindings,
      pendingCount,
      fixedCount: count("fixed"),
      ignoredCount: count("ignored"),
      beepedCount: count("beeped"),
      mutedCount: count("muted"),
      blurredCount: count("blurred"),
      replacedCount: count("replaced"),
      completionPercentage: totalFindings ? Math.round(((totalFindings - pendingCount) / totalFindings) * 100) : 100
    };
    await this.prisma.editorSession.update({ where: { id: editorSessionId }, data });
    return { ...data, canCompleteReview: pendingCount === 0 };
  }
}
