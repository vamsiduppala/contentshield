import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CreateUploadUrlDto } from "./dto/create-upload-url.dto";
import { VideosService } from "./videos.service";

@ApiTags("Videos")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("videos")
export class VideosController {
  constructor(private readonly videos: VideosService) {}

  @Post("upload-url")
  async createUploadUrl(@Req() request: any, @Body() dto: CreateUploadUrlDto) {
    return ok(await this.videos.createUploadUrl(request.user, dto));
  }

  @Post(":videoId/confirm-upload")
  async confirmUpload(@Req() request: any, @Param("videoId") videoId: string) {
    return ok(await this.videos.confirmUpload(request.user, videoId));
  }

  @Get(":videoId")
  async getVideo(@Req() request: any, @Param("videoId") videoId: string) {
    return ok(await this.videos.getVideo(request.user, videoId));
  }
}
