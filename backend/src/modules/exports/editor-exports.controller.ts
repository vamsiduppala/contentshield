import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CreateEditorExportDto } from "./dto/create-editor-export.dto";
import { ExportsService } from "./exports.service";

@ApiTags("Editor Exports")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class EditorExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Post("editor/:scanId/exports")
  create(@Req() request: any, @Param("scanId") scanId: string, @Body() dto: CreateEditorExportDto) {
    return this.exportsService.createEditorExport(request.user, scanId, dto).then(ok);
  }

  @Get("editor/:scanId/exports")
  list(@Req() request: any, @Param("scanId") scanId: string) {
    return this.exportsService.listEditorExports(request.user, scanId).then(ok);
  }

  @Get("editor/exports/:exportJobId")
  get(@Req() request: any, @Param("exportJobId") exportJobId: string) {
    return this.exportsService.getEditorExport(request.user, exportJobId).then(ok);
  }
}
