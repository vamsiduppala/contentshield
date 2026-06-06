import { Module } from "@nestjs/common";
import { EditorSessionsModule } from "../editor-sessions/editor-sessions.module";
import { EditorNotesController } from "./editor-notes.controller";
import { EditorNotesService } from "./editor-notes.service";

@Module({
  imports: [EditorSessionsModule],
  controllers: [EditorNotesController],
  providers: [EditorNotesService]
})
export class EditorNotesModule {}
