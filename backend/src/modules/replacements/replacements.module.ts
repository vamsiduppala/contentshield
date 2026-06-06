import { Module } from "@nestjs/common";
import { EditorSessionsModule } from "../editor-sessions/editor-sessions.module";
import { ReplacementsController } from "./replacements.controller";
import { ReplacementsService } from "./replacements.service";

@Module({
  imports: [EditorSessionsModule],
  controllers: [ReplacementsController],
  providers: [ReplacementsService]
})
export class ReplacementsModule {}
