import { Module } from "@nestjs/common";
import { EditorSessionsModule } from "../editor-sessions/editor-sessions.module";
import { CollaborationController } from "./collaboration.controller";
import { CollaborationService } from "./collaboration.service";

@Module({
  imports: [EditorSessionsModule],
  controllers: [CollaborationController],
  providers: [CollaborationService]
})
export class CollaborationModule {}
