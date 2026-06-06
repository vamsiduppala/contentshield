import { Module } from "@nestjs/common";
import { EditorSessionsModule } from "../editor-sessions/editor-sessions.module";
import { ReviewProgressModule } from "../review-progress/review-progress.module";
import { EditorController } from "./editor.controller";

@Module({
  imports: [EditorSessionsModule, ReviewProgressModule],
  controllers: [EditorController]
})
export class EditorModule {}
