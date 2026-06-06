import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { EditorSessionsModule } from "../editor-sessions/editor-sessions.module";
import { StorageModule } from "../storage/storage.module";
import { EditorExportsController } from "./editor-exports.controller";
import { ExportQueueProcessor } from "./export-queue.processor";
import { ExportsController } from "./exports.controller";
import { ExportsService } from "./exports.service";
import { CapcutNotesProvider } from "./providers/capcut-notes.provider";
import { CsvExportProvider } from "./providers/csv-export.provider";
import { PdfExportProvider } from "./providers/pdf-export.provider";
import { PremiereMarkerProvider } from "./providers/premiere-marker.provider";

@Module({
  imports: [BullModule.registerQueue({ name: "editor-export" }), EditorSessionsModule, StorageModule],
  controllers: [ExportsController, EditorExportsController],
  providers: [ExportsService, ExportQueueProcessor, PdfExportProvider, CsvExportProvider, PremiereMarkerProvider, CapcutNotesProvider],
  exports: [ExportsService]
})
export class ExportsModule {}
