import { Injectable } from "@nestjs/common";
import { RequestUser } from "../../common/request-context";
import { PrismaService } from "../../prisma/prisma.service";
import { EditorSessionsService } from "../editor-sessions/editor-sessions.service";
import { CreateReplacementDto } from "./dto/create-replacement.dto";

@Injectable()
export class ReplacementsService {
  constructor(private readonly prisma: PrismaService, private readonly sessions: EditorSessionsService) {}

  async list(user: RequestUser, scanId: string, findingId: string) {
    await this.sessions.getSessionForScan(user, scanId);
    return this.prisma.replacementSuggestion.findMany({ where: { riskFindingId: findingId }, orderBy: { confidence: "desc" } });
  }

  async create(user: RequestUser, scanId: string, findingId: string, dto: CreateReplacementDto) {
    await this.sessions.getSessionForScan(user, scanId);
    const finding = await this.prisma.riskFinding.findFirstOrThrow({ where: { id: findingId, scanJobId: scanId } });
    return this.prisma.replacementSuggestion.create({ data: { riskFindingId: findingId, phrase: finding.phrase, replacement: dto.replacement, confidence: 1, source: "user" } });
  }
}
