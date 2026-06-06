import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { VideosModule } from "./modules/videos/videos.module";
import { ScansModule } from "./modules/scans/scans.module";
import { ScanProcessingModule } from "./modules/scan-processing/scan-processing.module";
import { TranscriptionModule } from "./modules/transcription/transcription.module";
import { OcrModule } from "./modules/ocr/ocr.module";
import { CaptionsModule } from "./modules/captions/captions.module";
import { RiskAnalysisModule } from "./modules/risk-analysis/risk-analysis.module";
import { ScoringModule } from "./modules/scoring/scoring.module";
import { ScanResultsModule } from "./modules/scan-results/scan-results.module";
import { StorageModule } from "./modules/storage/storage.module";
import { ExportsModule } from "./modules/exports/exports.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { AuditModule } from "./common/audit/audit.module";
import { HealthModule } from "./modules/health/health.module";
import { EditorModule } from "./modules/editor/editor.module";
import { EditorSessionsModule } from "./modules/editor-sessions/editor-sessions.module";
import { FindingActionsModule } from "./modules/finding-actions/finding-actions.module";
import { ReplacementsModule } from "./modules/replacements/replacements.module";
import { EditorNotesModule } from "./modules/editor-notes/editor-notes.module";
import { ReviewProgressModule } from "./modules/review-progress/review-progress.module";
import { CollaborationModule } from "./modules/collaboration/collaboration.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({ 
      connection: { 
        url: process.env.REDIS_URL,
        // Upstash often requires tls for rediss://
        tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined
      } 
    }),
    PrismaModule,
    AuditModule,
    AuthModule,
    VideosModule,
    ScansModule,
    ScanProcessingModule,
    TranscriptionModule,
    OcrModule,
    CaptionsModule,
    RiskAnalysisModule,
    ScoringModule,
    ScanResultsModule,
    StorageModule,
    ExportsModule,
    NotificationsModule,
    DashboardModule,
    HealthModule,
    EditorSessionsModule,
    ReviewProgressModule,
    EditorModule,
    FindingActionsModule,
    ReplacementsModule,
    EditorNotesModule,
    CollaborationModule
  ]
})
export class AppModule {}
