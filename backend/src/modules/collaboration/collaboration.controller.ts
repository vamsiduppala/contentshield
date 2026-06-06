import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CollaborationService } from "./collaboration.service";
import { UpdatePresenceDto } from "./dto/update-presence.dto";

@ApiTags("Editor Collaboration")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("editor/:scanId/presence")
export class CollaborationController {
  constructor(private readonly collaboration: CollaborationService) {}

  @Get()
  list(@Req() request: any, @Param("scanId") scanId: string) {
    return this.collaboration.list(request.user, scanId).then(ok);
  }

  @Post()
  update(@Req() request: any, @Param("scanId") scanId: string, @Body() dto: UpdatePresenceDto) {
    return this.collaboration.update(request.user, scanId, dto).then(ok);
  }
}
