import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CreateScanDto } from "./dto/create-scan.dto";
import { ScanHistoryQueryDto } from "./dto/scan-history-query.dto";
import { ScansService } from "./scans.service";

@ApiTags("Scans")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("scans")
export class ScansController {
  constructor(private readonly scans: ScansService) {}

  @Post()
  async create(@Req() request: any, @Body() dto: CreateScanDto) {
    return ok(await this.scans.createScan(request.user, dto));
  }

  @Get("history")
  async history(@Req() request: any, @Query() query: ScanHistoryQueryDto) {
    return ok(await this.scans.getHistory(request.user, query));
  }

  @Get(":scanId/status")
  async status(@Req() request: any, @Param("scanId") scanId: string) {
    return ok(await this.scans.getStatus(request.user, scanId));
  }
}
