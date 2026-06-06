import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { AuthGuard } from "../../common/guards/auth.guard";
import { ScanResultsService } from "./scan-results.service";

@ApiTags("Scan Results")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("scans")
export class ScanResultsController {
  constructor(private readonly results: ScanResultsService) {}

  @Get(":scanId/results")
  async getResults(@Req() request: any, @Param("scanId") scanId: string) {
    return ok(await this.results.getResults(request.user, scanId));
  }
}
