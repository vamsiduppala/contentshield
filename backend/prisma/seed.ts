import { PrismaClient, ScanDepth, PlatformPreset, ContentType, ScanLanguage, VideoStatus, ScanJobStatus, RiskSeverity, RiskSource, SubscriptionPlan, EditorSessionStatus, ScanVerdict, ProcessingStepStatus } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

async function main() {
  console.log("Seeding real demo data...");

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { slug: "creator-shield-studios" },
    update: {},
    create: {
      name: "Creator Shield Studios",
      slug: "creator-shield-studios",
      plan: SubscriptionPlan.creator_pro,
    },
  });

  // 2. Create User
  const { salt, hash } = hashPassword("MayaDemo@2026");
  const user = await prisma.user.upsert({
    where: { email: "maya@contentshield.ai" },
    update: {},
    create: {
      email: "maya@contentshield.ai",
      passwordHash: hash,
      salt: salt,
      firstName: "Maya",
      lastName: "Srinivasan",
      role: "owner",
      organizationId: org.id,
    },
  });

  // 3. Seed 8 Videos & Scans
  const videoData = [
    { title: "Border Conflict Explainer - Final Cut", file: "border-conflict.mp4", score: 67, verdict: ScanVerdict.high_risk },
    { title: "Podcast Episode 41 - Creator Burnout", file: "podcast-41.mp4", score: 91, verdict: ScanVerdict.safe },
    { title: "Gaming News Weekly", file: "gaming-news.mp4", score: 78, verdict: ScanVerdict.limited_risk },
    { title: "Documentary: The Silent Arctic", file: "arctic.mp4", score: 95, verdict: ScanVerdict.safe },
    { title: "Street Interview - Election Reacts", file: "street-interview.mp4", score: 42, verdict: ScanVerdict.critical_risk },
    { title: "Daily Vlog #214", file: "vlog-214.mp4", score: 88, verdict: ScanVerdict.safe },
    { title: "Tech Review: New AI Chips", file: "tech-review.mp4", score: 82, verdict: ScanVerdict.limited_risk },
    { title: "Cooking with Maya: Spicy Ramen", file: "cooking.mp4", score: 98, verdict: ScanVerdict.safe },
  ];

  for (const [index, data] of videoData.entries()) {
    const video = await prisma.video.create({
      data: {
        organizationId: org.id,
        uploadedByUserId: user.id,
        originalFileName: data.file,
        storageKey: `${org.id}/videos/${data.file}`,
        storageBucket: "contentshield-ai-staging",
        mimeType: "video/mp4",
        fileSizeBytes: BigInt(50 * 1024 * 1024),
        status: VideoStatus.ready,
      },
    });

    const scanJob = await prisma.scanJob.create({
      data: {
        organizationId: org.id,
        videoId: video.id,
        createdByUserId: user.id,
        status: ScanJobStatus.completed,
        progressPercent: 100,
        currentStage: "completed",
        scanDepth: ScanDepth.balanced,
        platformPreset: PlatformPreset.youtube,
        contentType: ContentType.news,
        language: ScanLanguage.english,
        config: {},
        completedAt: new Date(),
      },
    });

    // Add findings for some videos
    if (data.verdict !== ScanVerdict.safe) {
      await prisma.riskFinding.create({
        data: {
          scanJobId: scanJob.id,
          startTime: 10.5,
          endTime: 15.2,
          phrase: "war zone",
          normalizedPhrase: "war zone",
          source: RiskSource.speech,
          category: "violence_war",
          severity: RiskSeverity.high,
          confidence: 0.95,
          contextSnippet: "The reporters were entering a heavy war zone.",
          suggestedReplacement: "conflict area",
          suggestedReplacements: ["conflict area", "active site"],
          reason: "Direct mention of war-related terms.",
          monetizationImpact: "High risk of demonetization.",
        },
      });

      if (data.verdict === ScanVerdict.critical_risk) {
        await prisma.riskFinding.create({
          data: {
            scanJobId: scanJob.id,
            startTime: 45.0,
            endTime: 48.0,
            phrase: "deadly attack",
            normalizedPhrase: "deadly attack",
            source: RiskSource.onscreen_text,
            category: "violence_war",
            severity: RiskSeverity.critical,
            confidence: 0.98,
            contextSnippet: "BREAKING: DEADLY ATTACK IN SUBURBS",
            suggestedReplacement: "fatal incident",
            suggestedReplacements: ["fatal incident"],
            reason: "On-screen text contains critical violence terms.",
            monetizationImpact: "High chance of limited ads.",
          },
        });
      }
    }

    await prisma.scanResult.create({
      data: {
        scanJobId: scanJob.id,
        organizationId: org.id,
        safetyScore: data.score,
        verdict: data.verdict,
        totalFindings: data.verdict === ScanVerdict.safe ? 0 : data.verdict === ScanVerdict.critical_risk ? 2 : 1,
        lowCount: 0,
        mediumCount: 0,
        highCount: data.verdict === ScanVerdict.high_risk ? 1 : 0,
        criticalCount: data.verdict === ScanVerdict.critical_risk ? 1 : 0,
        aiSummary: `This video was analyzed and given a ${data.verdict} verdict.`,
        modelVersion: "staging-real-v1",
        generatedAt: new Date(),
      },
    });

    // Create 3 editor sessions for the first 3 videos
    if (index < 3) {
      await prisma.editorSession.create({
        data: {
          organizationId: org.id,
          scanJobId: scanJob.id,
          videoId: video.id,
          createdByUserId: user.id,
          status: index === 0 ? EditorSessionStatus.in_progress : EditorSessionStatus.completed,
          totalFindings: 1,
          pendingCount: index === 0 ? 1 : 0,
          fixedCount: index === 0 ? 0 : 1,
        },
      });
    }

    // Add some transcripts and OCR for realism
    await prisma.transcriptSegment.create({
      data: {
        scanJobId: scanJob.id,
        startTime: 0.0,
        endTime: 5.0,
        text: "Hello and welcome back to our channel.",
        confidence: 0.99,
        source: RiskSource.speech,
      },
    });

    await prisma.ocrSegment.create({
      data: {
        scanJobId: scanJob.id,
        startTime: 2.0,
        endTime: 4.0,
        detectedText: data.title,
        confidence: 0.92,
        source: RiskSource.onscreen_text,
      },
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
