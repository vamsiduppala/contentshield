import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CreateReplacementDto } from "./dto/create-replacement.dto";
import { ReplacementsService } from "./replacements.service";

@ApiTags("Replacements")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("editor/:scanId/findings/:findingId/replacements")
export class ReplacementsController {
  constructor(private readonly replacements: ReplacementsService) {}

  @Get()
  list(@Req() request: any, @Param("scanId") scanId: string, @Param("findingId") findingId: string) {
    return this.replacements.list(request.user, scanId, findingId).then(ok);
  }

  @Post()
  create(@Req() request: any, @Param("scanId") scanId: string, @Param("findingId") findingId: string, @Body() dto: CreateReplacementDto) {
    return this.replacements.create(request.user, scanId, findingId, dto).then(ok);
  }
}
