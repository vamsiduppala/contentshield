import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { VideosModule } from "../videos/videos.module";
import { ScansController } from "./scans.controller";
import { ScansService } from "./scans.service";

@Module({
  imports: [VideosModule, BullModule.registerQueue({ name: "scan" })],
  controllers: [ScansController],
  providers: [ScansService],
  exports: [ScansService]
})
export class ScansModule {}
