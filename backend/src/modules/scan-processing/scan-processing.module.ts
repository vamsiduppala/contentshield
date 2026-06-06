import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { CaptionsModule } from "../captions/captions.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { OcrModule } from "../ocr/ocr.module";
import { RiskAnalysisModule } from "../risk-analysis/risk-analysis.module";
import { ScoringModule } from "../scoring/scoring.module";
import { StorageModule } from "../storage/storage.module";
import { TranscriptionModule } from "../transcription/transcription.module";
import { ScanOrchestratorService } from "./scan-orchestrator.service";
import { ScanQueueProcessor } from "./scan-queue.processor";
import { ScanStatusService } from "./scan-status.service";

@Module({
  imports: [BullModule.registerQueue({ name: "scan" }), TranscriptionModule, OcrModule, CaptionsModule, RiskAnalysisModule, ScoringModule, StorageModule, NotificationsModule],
  providers: [ScanOrchestratorService, ScanQueueProcessor, ScanStatusService],
  exports: [ScanOrchestratorService, ScanStatusService]
})
export class ScanProcessingModule {}
