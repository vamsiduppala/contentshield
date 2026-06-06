import { Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { AuthGuard } from "../../common/guards/auth.guard";
import { ExportsService } from "./exports.service";

@ApiTags("Exports")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("exports")
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Post(":scanId/csv")
  csv(@Req() request: any, @Param("scanId") scanId: string) {
    return this.export(request, scanId, "csv");
  }

  @Post(":scanId/pdf")
  pdf(@Req() request: any, @Param("scanId") scanId: string) {
    return this.export(request, scanId, "pdf");
  }

  @Post(":scanId/editor-notes")
  editorNotes(@Req() request: any, @Param("scanId") scanId: string) {
    return this.export(request, scanId, "editor-notes");
  }

  private async export(request: any, scanId: string, format: "csv" | "pdf" | "editor-notes") {
    return ok(await this.exportsService.createPlaceholder(request.user, scanId, format));
  }
}
