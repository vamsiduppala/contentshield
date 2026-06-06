import { Injectable } from "@nestjs/common";
import { AuditService } from "../../common/audit/audit.service";
import { RequestUser } from "../../common/request-context";
import { PrismaService } from "../../prisma/prisma.service";
import { EditorSessionsService } from "../editor-sessions/editor-sessions.service";
import { EditorNoteDto } from "./dto/editor-note.dto";

@Injectable()
export class EditorNotesService {
  constructor(private readonly prisma: PrismaService, private readonly sessions: EditorSessionsService, private readonly audit: AuditService) {}

  async create(user: RequestUser, scanId: string, findingId: string | null, dto: EditorNoteDto) {
    const session = await this.sessions.getSessionForScan(user, scanId);
    const note = await this.prisma.editorNote.create({ data: { editorSessionId: session.id, riskFindingId: findingId, userId: user.id, note: dto.note } });
    this.audit.log("editor.note_added", { organizationId: user.organizationId, userId: user.id, scanId, metadata: { findingId } });
    return note;
  }

  async list(user: RequestUser, scanId: string) {
    const session = await this.sessions.getSessionForScan(user, scanId);
    return this.prisma.editorNote.findMany({ where: { editorSessionId: session.id }, orderBy: { createdAt: "desc" } });
  }

  async update(user: RequestUser, scanId: string, noteId: string, dto: EditorNoteDto) {
    const session = await this.sessions.getSessionForScan(user, scanId);
    await this.prisma.editorNote.updateMany({ where: { id: noteId, editorSessionId: session.id }, data: { note: dto.note } });
    return this.prisma.editorNote.findFirst({ where: { id: noteId, editorSessionId: session.id } });
  }

  async delete(user: RequestUser, scanId: string, noteId: string) {
    const session = await this.sessions.getSessionForScan(user, scanId);
    await this.prisma.editorNote.deleteMany({ where: { id: noteId, editorSessionId: session.id } });
    return { deleted: true };
  }
}
