import { Module } from "@nestjs/common";
import { ReviewProgressModule } from "../review-progress/review-progress.module";
import { EditorSessionsService } from "./editor-sessions.service";

@Module({
  imports: [ReviewProgressModule],
  providers: [EditorSessionsService],
  exports: [EditorSessionsService]
})
export class EditorSessionsModule {}
