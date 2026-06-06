import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { AuthGuard } from "../../common/guards/auth.guard";
import { EditorSessionsService } from "../editor-sessions/editor-sessions.service";
import { ReviewProgressService } from "../review-progress/review-progress.service";

@ApiTags("Editor")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("editor/:scanId")
export class EditorController {
  constructor(private readonly sessions: EditorSessionsService, private readonly progress: ReviewProgressService) {}

  @Get("session")
  session(@Req() request: any, @Param("scanId") scanId: string) {
    return this.sessions.getOrCreate(request.user, scanId).then(ok);
  }

  @Post("session/start")
  start(@Req() request: any, @Param("scanId") scanId: string) {
    return this.sessions.start(request.user, scanId).then(ok);
  }

  @Post("session/complete")
  complete(@Req() request: any, @Param("scanId") scanId: string) {
    return this.sessions.complete(request.user, scanId).then(ok);
  }

  @Get("summary")
  summary(@Req() request: any, @Param("scanId") scanId: string) {
    return this.sessions.summary(request.user, scanId).then(ok);
  }

  @Get("progress")
  async progressSummary(@Req() request: any, @Param("scanId") scanId: string) {
    const session = await this.sessions.getSessionForScan(request.user, scanId);
    return ok(await this.progress.recalculate(session.id));
  }
}
