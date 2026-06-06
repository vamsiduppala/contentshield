import { Injectable } from "@nestjs/common";
import { RequestUser } from "../../common/request-context";
import { PrismaService } from "../../prisma/prisma.service";
import { EditorSessionsService } from "../editor-sessions/editor-sessions.service";
import { UpdatePresenceDto } from "./dto/update-presence.dto";

@Injectable()
export class CollaborationService {
  constructor(private readonly prisma: PrismaService, private readonly sessions: EditorSessionsService) {}

  async list(user: RequestUser, scanId: string) {
    const session = await this.sessions.getSessionForScan(user, scanId);
    return this.prisma.collaborationPresence.findMany({ where: { editorSessionId: session.id }, orderBy: { lastSeenAt: "desc" } });
  }

  async update(user: RequestUser, scanId: string, dto: UpdatePresenceDto) {
    const session = await this.sessions.getSessionForScan(user, scanId);
    return this.prisma.collaborationPresence.upsert({
      where: { editorSessionId_userId: { editorSessionId: session.id, userId: user.id } },
      create: { editorSessionId: session.id, userId: user.id, activeFindingId: dto.activeFindingId, cursorMetadata: (dto.cursorMetadata || {}) as any, lastSeenAt: new Date() },
      update: { activeFindingId: dto.activeFindingId, cursorMetadata: (dto.cursorMetadata || {}) as any, lastSeenAt: new Date() }
    });
  }
}
