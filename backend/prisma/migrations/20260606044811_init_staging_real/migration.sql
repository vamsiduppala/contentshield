-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('uploaded', 'processing', 'ready', 'failed', 'deleted');

-- CreateEnum
CREATE TYPE "ScanJobStatus" AS ENUM ('queued', 'processing', 'completed', 'failed', 'canceled');

-- CreateEnum
CREATE TYPE "ProcessingStepStatus" AS ENUM ('pending', 'running', 'completed', 'failed', 'skipped');

-- CreateEnum
CREATE TYPE "ScanDepth" AS ENUM ('fast', 'balanced', 'deep');

-- CreateEnum
CREATE TYPE "PlatformPreset" AS ENUM ('youtube', 'tiktok', 'instagram');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('geopolitics', 'podcast', 'documentary', 'gaming', 'news', 'education', 'other');

-- CreateEnum
CREATE TYPE "ScanLanguage" AS ENUM ('english', 'telugu', 'hindi', 'spanish', 'auto');

-- CreateEnum
CREATE TYPE "RiskSource" AS ENUM ('speech', 'onscreen_text', 'caption');

-- CreateEnum
CREATE TYPE "RiskSeverity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "ScanVerdict" AS ENUM ('safe', 'limited_risk', 'high_risk', 'critical_risk');

-- CreateEnum
CREATE TYPE "ProcessingLogLevel" AS ENUM ('info', 'warn', 'error');

-- CreateEnum
CREATE TYPE "EditorSessionStatus" AS ENUM ('not_started', 'in_progress', 'completed', 'locked');

-- CreateEnum
CREATE TYPE "FindingReviewStatus" AS ENUM ('pending', 'beeped', 'muted', 'blurred', 'replaced', 'fixed', 'ignored');

-- CreateEnum
CREATE TYPE "EditorActionType" AS ENUM ('beep', 'mute', 'blur', 'replace', 'fix', 'ignore', 'note', 'undo');

-- CreateEnum
CREATE TYPE "ReplacementSource" AS ENUM ('ai', 'user', 'system');

-- CreateEnum
CREATE TYPE "EditorExportFormat" AS ENUM ('pdf', 'csv', 'premiere_markers', 'capcut_notes', 'json');

-- CreateEnum
CREATE TYPE "EditorExportStatus" AS ENUM ('queued', 'processing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('free', 'creator_pro', 'enterprise');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'free',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "uploadedByUserId" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "storageBucket" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSizeBytes" BIGINT NOT NULL,
    "durationSeconds" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "status" "VideoStatus" NOT NULL DEFAULT 'uploaded',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanJob" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "status" "ScanJobStatus" NOT NULL DEFAULT 'queued',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "currentStage" TEXT NOT NULL DEFAULT 'queued',
    "scanDepth" "ScanDepth" NOT NULL,
    "platformPreset" "PlatformPreset" NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "language" "ScanLanguage" NOT NULL,
    "config" JSONB NOT NULL,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScanJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessingStep" (
    "id" TEXT NOT NULL,
    "scanJobId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ProcessingStepStatus" NOT NULL DEFAULT 'pending',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "ProcessingStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptSegment" (
    "id" TEXT NOT NULL,
    "scanJobId" TEXT NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "speakerLabel" TEXT,
    "source" "RiskSource" NOT NULL DEFAULT 'speech',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranscriptSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OcrSegment" (
    "id" TEXT NOT NULL,
    "scanJobId" TEXT NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,
    "detectedText" TEXT NOT NULL,
    "boundingBox" JSONB,
    "confidence" DOUBLE PRECISION NOT NULL,
    "frameStorageKey" TEXT,
    "source" "RiskSource" NOT NULL DEFAULT 'onscreen_text',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OcrSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaptionSegment" (
    "id" TEXT NOT NULL,
    "scanJobId" TEXT NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "source" "RiskSource" NOT NULL DEFAULT 'caption',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaptionSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskFinding" (
    "id" TEXT NOT NULL,
    "scanJobId" TEXT NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,
    "phrase" TEXT NOT NULL,
    "normalizedPhrase" TEXT NOT NULL,
    "source" "RiskSource" NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "RiskSeverity" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "contextSnippet" TEXT NOT NULL,
    "suggestedReplacement" TEXT NOT NULL,
    "suggestedReplacements" JSONB NOT NULL,
    "reason" TEXT NOT NULL,
    "monetizationImpact" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskCategorySummary" (
    "id" TEXT NOT NULL,
    "scanJobId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "findingCount" INTEGER NOT NULL,
    "highestSeverity" "RiskSeverity" NOT NULL,
    "confidenceAverage" DOUBLE PRECISION NOT NULL,
    "scoreImpact" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskCategorySummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanResult" (
    "id" TEXT NOT NULL,
    "scanJobId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "safetyScore" INTEGER NOT NULL,
    "verdict" "ScanVerdict" NOT NULL,
    "totalFindings" INTEGER NOT NULL,
    "lowCount" INTEGER NOT NULL,
    "mediumCount" INTEGER NOT NULL,
    "highCount" INTEGER NOT NULL,
    "criticalCount" INTEGER NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessingLog" (
    "id" TEXT NOT NULL,
    "scanJobId" TEXT NOT NULL,
    "level" "ProcessingLogLevel" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditorSession" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "scanJobId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "status" "EditorSessionStatus" NOT NULL DEFAULT 'not_started',
    "totalFindings" INTEGER NOT NULL DEFAULT 0,
    "pendingCount" INTEGER NOT NULL DEFAULT 0,
    "fixedCount" INTEGER NOT NULL DEFAULT 0,
    "ignoredCount" INTEGER NOT NULL DEFAULT 0,
    "beepedCount" INTEGER NOT NULL DEFAULT 0,
    "mutedCount" INTEGER NOT NULL DEFAULT 0,
    "blurredCount" INTEGER NOT NULL DEFAULT 0,
    "replacedCount" INTEGER NOT NULL DEFAULT 0,
    "completionPercentage" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditorSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FindingReviewState" (
    "id" TEXT NOT NULL,
    "editorSessionId" TEXT NOT NULL,
    "riskFindingId" TEXT NOT NULL,
    "status" "FindingReviewStatus" NOT NULL DEFAULT 'pending',
    "selectedReplacement" TEXT,
    "editorNote" TEXT,
    "reviewedByUserId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FindingReviewState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FindingAction" (
    "id" TEXT NOT NULL,
    "editorSessionId" TEXT NOT NULL,
    "riskFindingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionType" "EditorActionType" NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,
    "originalPhrase" TEXT NOT NULL,
    "replacementPhrase" TEXT,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FindingAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplacementSuggestion" (
    "id" TEXT NOT NULL,
    "riskFindingId" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "replacement" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "source" "ReplacementSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReplacementSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditorNote" (
    "id" TEXT NOT NULL,
    "editorSessionId" TEXT NOT NULL,
    "riskFindingId" TEXT,
    "userId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditorNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExportJob" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "editorSessionId" TEXT NOT NULL,
    "scanJobId" TEXT NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "format" "EditorExportFormat" NOT NULL,
    "status" "EditorExportStatus" NOT NULL DEFAULT 'queued',
    "storageKey" TEXT,
    "downloadUrl" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ExportJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollaborationPresence" (
    "id" TEXT NOT NULL,
    "editorSessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activeFindingId" TEXT,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cursorMetadata" JSONB,

    CONSTRAINT "CollaborationPresence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- CreateIndex
CREATE INDEX "Video_organizationId_idx" ON "Video"("organizationId");

-- CreateIndex
CREATE INDEX "ScanJob_organizationId_status_idx" ON "ScanJob"("organizationId", "status");

-- CreateIndex
CREATE INDEX "ScanJob_videoId_idx" ON "ScanJob"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "ScanResult_scanJobId_key" ON "ScanResult"("scanJobId");

-- CreateIndex
CREATE INDEX "EditorSession_organizationId_idx" ON "EditorSession"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "EditorSession_scanJobId_key" ON "EditorSession"("scanJobId");

-- CreateIndex
CREATE UNIQUE INDEX "FindingReviewState_editorSessionId_riskFindingId_key" ON "FindingReviewState"("editorSessionId", "riskFindingId");

-- CreateIndex
CREATE INDEX "FindingAction_editorSessionId_riskFindingId_idx" ON "FindingAction"("editorSessionId", "riskFindingId");

-- CreateIndex
CREATE INDEX "ReplacementSuggestion_riskFindingId_idx" ON "ReplacementSuggestion"("riskFindingId");

-- CreateIndex
CREATE INDEX "EditorNote_editorSessionId_idx" ON "EditorNote"("editorSessionId");

-- CreateIndex
CREATE INDEX "ExportJob_organizationId_status_idx" ON "ExportJob"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CollaborationPresence_editorSessionId_userId_key" ON "CollaborationPresence"("editorSessionId", "userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanJob" ADD CONSTRAINT "ScanJob_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanJob" ADD CONSTRAINT "ScanJob_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanJob" ADD CONSTRAINT "ScanJob_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessingStep" ADD CONSTRAINT "ProcessingStep_scanJobId_fkey" FOREIGN KEY ("scanJobId") REFERENCES "ScanJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptSegment" ADD CONSTRAINT "TranscriptSegment_scanJobId_fkey" FOREIGN KEY ("scanJobId") REFERENCES "ScanJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OcrSegment" ADD CONSTRAINT "OcrSegment_scanJobId_fkey" FOREIGN KEY ("scanJobId") REFERENCES "ScanJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptionSegment" ADD CONSTRAINT "CaptionSegment_scanJobId_fkey" FOREIGN KEY ("scanJobId") REFERENCES "ScanJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFinding" ADD CONSTRAINT "RiskFinding_scanJobId_fkey" FOREIGN KEY ("scanJobId") REFERENCES "ScanJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskCategorySummary" ADD CONSTRAINT "RiskCategorySummary_scanJobId_fkey" FOREIGN KEY ("scanJobId") REFERENCES "ScanJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanResult" ADD CONSTRAINT "ScanResult_scanJobId_fkey" FOREIGN KEY ("scanJobId") REFERENCES "ScanJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessingLog" ADD CONSTRAINT "ProcessingLog_scanJobId_fkey" FOREIGN KEY ("scanJobId") REFERENCES "ScanJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorSession" ADD CONSTRAINT "EditorSession_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorSession" ADD CONSTRAINT "EditorSession_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingReviewState" ADD CONSTRAINT "FindingReviewState_editorSessionId_fkey" FOREIGN KEY ("editorSessionId") REFERENCES "EditorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingReviewState" ADD CONSTRAINT "FindingReviewState_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingAction" ADD CONSTRAINT "FindingAction_editorSessionId_fkey" FOREIGN KEY ("editorSessionId") REFERENCES "EditorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingAction" ADD CONSTRAINT "FindingAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorNote" ADD CONSTRAINT "EditorNote_editorSessionId_fkey" FOREIGN KEY ("editorSessionId") REFERENCES "EditorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorNote" ADD CONSTRAINT "EditorNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportJob" ADD CONSTRAINT "ExportJob_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportJob" ADD CONSTRAINT "ExportJob_editorSessionId_fkey" FOREIGN KEY ("editorSessionId") REFERENCES "EditorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportJob" ADD CONSTRAINT "ExportJob_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaborationPresence" ADD CONSTRAINT "CollaborationPresence_editorSessionId_fkey" FOREIGN KEY ("editorSessionId") REFERENCES "EditorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaborationPresence" ADD CONSTRAINT "CollaborationPresence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
