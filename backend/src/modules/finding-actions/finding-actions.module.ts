import { Module } from "@nestjs/common";
import { EditorSessionsModule } from "../editor-sessions/editor-sessions.module";
import { ReviewProgressModule } from "../review-progress/review-progress.module";
import { FindingActionsController } from "./finding-actions.controller";
import { FindingActionsService } from "./finding-actions.service";

@Module({
  imports: [EditorSessionsModule, ReviewProgressModule],
  controllers: [FindingActionsController],
  providers: [FindingActionsService],
  exports: [FindingActionsService]
})
export class FindingActionsModule {}
