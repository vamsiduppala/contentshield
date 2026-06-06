import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CreateFindingActionDto } from "./dto/create-finding-action.dto";
import { FindingActionsService } from "./finding-actions.service";

@ApiTags("Finding Actions")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("editor/:scanId/findings/:findingId")
export class FindingActionsController {
  constructor(private readonly actions: FindingActionsService) {}

  @Post("actions")
  apply(@Req() request: any, @Param("scanId") scanId: string, @Param("findingId") findingId: string, @Body() dto: CreateFindingActionDto) {
    return this.actions.apply(request.user, scanId, findingId, dto).then(ok);
  }

  @Get("actions")
  history(@Req() request: any, @Param("scanId") scanId: string, @Param("findingId") findingId: string) {
    return this.actions.history(request.user, scanId, findingId).then(ok);
  }

  @Post("undo")
  undo(@Req() request: any, @Param("scanId") scanId: string, @Param("findingId") findingId: string) {
    return this.actions.undo(request.user, scanId, findingId).then(ok);
  }
}
