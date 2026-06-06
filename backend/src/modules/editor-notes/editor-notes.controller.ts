import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { AuthGuard } from "../../common/guards/auth.guard";
import { EditorNoteDto } from "./dto/editor-note.dto";
import { EditorNotesService } from "./editor-notes.service";

@ApiTags("Editor Notes")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("editor/:scanId")
export class EditorNotesController {
  constructor(private readonly notes: EditorNotesService) {}

  @Post("findings/:findingId/notes")
  createFindingNote(@Req() request: any, @Param("scanId") scanId: string, @Param("findingId") findingId: string, @Body() dto: EditorNoteDto) {
    return this.notes.create(request.user, scanId, findingId, dto).then(ok);
  }

  @Get("notes")
  list(@Req() request: any, @Param("scanId") scanId: string) {
    return this.notes.list(request.user, scanId).then(ok);
  }

  @Patch("notes/:noteId")
  update(@Req() request: any, @Param("scanId") scanId: string, @Param("noteId") noteId: string, @Body() dto: EditorNoteDto) {
    return this.notes.update(request.user, scanId, noteId, dto).then(ok);
  }

  @Delete("notes/:noteId")
  delete(@Req() request: any, @Param("scanId") scanId: string, @Param("noteId") noteId: string) {
    return this.notes.delete(request.user, scanId, noteId).then(ok);
  }
}
