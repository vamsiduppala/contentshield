import {
  PrismaClient,
  ScanDepth,
  PlatformPreset,
  ContentType,
  ScanLanguage,
  VideoStatus,
  ScanJobStatus,
  RiskSeverity,
  RiskSource,
  SubscriptionPlan,
  EditorSessionStatus,
  ScanVerdict,
  ProcessingStepStatus,
  FindingReviewStatus,
  EditorActionType,
  EditorExportFormat,
  EditorExportStatus
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { randomBytes, scryptSync } from "node:crypto";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const demoEmail = "maya@contentshield.ai";
const demoPassword = "MayaDemo@2026";
const orgSlug = "creator-shield-studios";

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

const processingSteps = [
  "prepare_video",
  "extract_audio",
  "transcribe_speech",
  "scan_ocr",
  "parse_captions",
  "detect_risk",
  "generate_score",
  "finalize_result"
];

const videos = [
  {
    title: "Border Conflict Explainer - Final Cut",
    file: "border-conflict-explainer-final-cut.mp4",
    score: 67,
    verdict: ScanVerdict.high_risk,
    contentType: ContentType.geopolitics,
    sizeMb: 684,
    duration: 742,
    findings: [
      {
        startTime: 73.4,
        endTime: 76.9,
        phrase: "war zone",
        source: RiskSource.speech,
        category: "violence_war",
        severity: RiskSeverity.high,
        contextSnippet: "The reporting team entered what officials described as a war zone.",
        suggestedReplacement: "active conflict area",
        suggestedReplacements: ["active conflict area", "restricted conflict area", "military-controlled zone"],
        reason: "Direct war-language can trigger limited ads on educational news content.",
        monetizationImpact: "Likely limited ads unless softened or strongly contextualized."
      },
      {
        startTime: 188.2,
        endTime: 191.1,
        phrase: "dead bodies",
        source: RiskSource.caption,
        category: "graphic_violence",
        severity: RiskSeverity.critical,
        contextSnippet: "Captions mention dead bodies near the checkpoint.",
        suggestedReplacement: "casualties",
        suggestedReplacements: ["casualties", "victims", "people killed in the incident"],
        reason: "Graphic death phrasing is a high demonetization signal.",
        monetizationImpact: "Very high chance of limited ads without replacement."
      }
    ]
  },
  {
    title: "Podcast Episode 41 - Creator Burnout",
    file: "podcast-41-creator-burnout.mp4",
    score: 91,
    verdict: ScanVerdict.safe,
    contentType: ContentType.podcast,
    sizeMb: 512,
    duration: 1984,
    findings: []
  },
  {
    title: "Gaming News Weekly",
    file: "gaming-news-weekly.mp4",
    score: 78,
    verdict: ScanVerdict.limited_risk,
    contentType: ContentType.gaming,
    sizeMb: 438,
    duration: 923,
    findings: [
      {
        startTime: 214.6,
        endTime: 217.4,
        phrase: "brutal execution animation",
        source: RiskSource.speech,
        category: "gaming_violence",
        severity: RiskSeverity.medium,
        contextSnippet: "The reviewer describes a brutal execution animation in the trailer.",
        suggestedReplacement: "intense takedown animation",
        suggestedReplacements: ["intense takedown animation", "finishing animation", "combat animation"],
        reason: "Gaming violence is contextual but explicit phrasing can reduce ad suitability.",
        monetizationImpact: "Moderate risk for limited ads."
      }
    ]
  },
  {
    title: "Documentary: The Silent Arctic",
    file: "documentary-the-silent-arctic.mp4",
    score: 95,
    verdict: ScanVerdict.safe,
    contentType: ContentType.documentary,
    sizeMb: 904,
    duration: 1512,
    findings: []
  },
  {
    title: "Street Interview - Election Reacts",
    file: "street-interview-election-reacts.mp4",
    score: 42,
    verdict: ScanVerdict.critical_risk,
    contentType: ContentType.news,
    sizeMb: 377,
    duration: 688,
    findings: [
      {
        startTime: 45.0,
        endTime: 48.0,
        phrase: "deadly attack",
        source: RiskSource.onscreen_text,
        category: "graphic_violence",
        severity: RiskSeverity.critical,
        contextSnippet: "Lower-third reads BREAKING: DEADLY ATTACK IN SUBURBS.",
        suggestedReplacement: "fatal incident",
        suggestedReplacements: ["fatal incident", "serious incident", "reported attack"],
        reason: "Critical violence wording appears as large on-screen text.",
        monetizationImpact: "High chance of limited ads and manual review."
      },
      {
        startTime: 302.5,
        endTime: 306.8,
        phrase: "rigged election",
        source: RiskSource.speech,
        category: "sensitive_politics",
        severity: RiskSeverity.high,
        contextSnippet: "A street interview guest says the election was rigged without evidence.",
        suggestedReplacement: "disputed election claims",
        suggestedReplacements: ["disputed election claims", "unverified election claim"],
        reason: "Unverified political claims can create advertiser suitability risk.",
        monetizationImpact: "Likely limited ads unless framed with verification context."
      },
      {
        startTime: 418.0,
        endTime: 421.1,
        phrase: "riot",
        source: RiskSource.caption,
        category: "civil_unrest",
        severity: RiskSeverity.medium,
        contextSnippet: "Captions describe the scene as a riot.",
        suggestedReplacement: "large protest",
        suggestedReplacements: ["large protest", "unrest", "crowd confrontation"],
        reason: "Civil unrest terms require contextual care.",
        monetizationImpact: "Moderate advertiser suitability risk."
      }
    ]
  },
  {
    title: "Daily Vlog #214",
    file: "daily-vlog-214.mp4",
    score: 88,
    verdict: ScanVerdict.safe,
    contentType: ContentType.other,
    sizeMb: 296,
    duration: 814,
    findings: []
  },
  {
    title: "Tech Review: New AI Chips",
    file: "tech-review-new-ai-chips.mp4",
    score: 82,
    verdict: ScanVerdict.limited_risk,
    contentType: ContentType.education,
    sizeMb: 621,
    duration: 1058,
    findings: [
      {
        startTime: 510.0,
        endTime: 514.2,
        phrase: "kill switch",
        source: RiskSource.onscreen_text,
        category: "sensitive_terms",
        severity: RiskSeverity.low,
        contextSnippet: "Slide title says emergency kill switch for model rollback.",
        suggestedReplacement: "emergency shutdown control",
        suggestedReplacements: ["emergency shutdown control", "rollback control", "failsafe"],
        reason: "Benign technical phrase, but keyword can be misread without context.",
        monetizationImpact: "Low risk with a clearer technical label."
      }
    ]
  },
  {
    title: "Cooking with Maya: Spicy Ramen",
    file: "cooking-with-maya-spicy-ramen.mp4",
    score: 98,
    verdict: ScanVerdict.safe,
    contentType: ContentType.other,
    sizeMb: 344,
    duration: 642,
    findings: []
  }
];

async function resetDemoWorkspace() {
  const existingOrg = await prisma.organization.findUnique({ where: { slug: orgSlug } });
  if (!existingOrg) return;

  const scanIds = (await prisma.scanJob.findMany({ where: { organizationId: existingOrg.id }, select: { id: true } })).map((item) => item.id);
  const sessionIds = (await prisma.editorSession.findMany({ where: { organizationId: existingOrg.id }, select: { id: true } })).map((item) => item.id);
  const findingIds = (await prisma.riskFinding.findMany({ where: { scanJobId: { in: scanIds } }, select: { id: true } })).map((item) => item.id);

  await prisma.collaborationPresence.deleteMany({ where: { editorSessionId: { in: sessionIds } } });
  await prisma.exportJob.deleteMany({ where: { organizationId: existingOrg.id } });
  await prisma.editorNote.deleteMany({ where: { editorSessionId: { in: sessionIds } } });
  await prisma.findingAction.deleteMany({ where: { editorSessionId: { in: sessionIds } } });
  await prisma.findingReviewState.deleteMany({ where: { editorSessionId: { in: sessionIds } } });
  await prisma.editorSession.deleteMany({ where: { organizationId: existingOrg.id } });
  await prisma.replacementSuggestion.deleteMany({ where: { riskFindingId: { in: findingIds } } });
  await prisma.processingLog.deleteMany({ where: { scanJobId: { in: scanIds } } });
  await prisma.scanResult.deleteMany({ where: { organizationId: existingOrg.id } });
  await prisma.riskCategorySummary.deleteMany({ where: { scanJobId: { in: scanIds } } });
  await prisma.riskFinding.deleteMany({ where: { scanJobId: { in: scanIds } } });
  await prisma.captionSegment.deleteMany({ where: { scanJobId: { in: scanIds } } });
  await prisma.ocrSegment.deleteMany({ where: { scanJobId: { in: scanIds } } });
  await prisma.transcriptSegment.deleteMany({ where: { scanJobId: { in: scanIds } } });
  await prisma.processingStep.deleteMany({ where: { scanJobId: { in: scanIds } } });
  await prisma.scanJob.deleteMany({ where: { organizationId: existingOrg.id } });
  await prisma.video.deleteMany({ where: { organizationId: existingOrg.id } });
  await prisma.user.deleteMany({ where: { organizationId: existingOrg.id } });
  await prisma.organization.delete({ where: { id: existingOrg.id } });
}

function findingCounts(findings: typeof videos[number]["findings"]) {
  return {
    lowCount: findings.filter((item) => item.severity === RiskSeverity.low).length,
    mediumCount: findings.filter((item) => item.severity === RiskSeverity.medium).length,
    highCount: findings.filter((item) => item.severity === RiskSeverity.high).length,
    criticalCount: findings.filter((item) => item.severity === RiskSeverity.critical).length
  };
}

async function main() {
  console.log("Resetting and seeding ContentShield AI demo workspace...");
  await resetDemoWorkspace();

  const org = await prisma.organization.create({
    data: {
      name: "Creator Shield Studios",
      slug: orgSlug,
      plan: SubscriptionPlan.creator_pro
    }
  });

  const { salt, hash } = hashPassword(demoPassword);
  const user = await prisma.user.create({
    data: {
      email: demoEmail,
      passwordHash: hash,
      salt,
      firstName: "Maya",
      lastName: "Srinivasan",
      role: "owner",
      organizationId: org.id
    }
  });

  for (const [index, data] of videos.entries()) {
    const createdAt = new Date(Date.now() - (videos.length - index) * 26 * 60 * 60 * 1000);
    const completedAt = new Date(createdAt.getTime() + 4 * 60 * 1000);
    const video = await prisma.video.create({
      data: {
        organizationId: org.id,
        uploadedByUserId: user.id,
        originalFileName: data.file,
        storageKey: `${org.id}/videos/${data.file}`,
        storageBucket: "contentshield-ai-staging",
        mimeType: "video/mp4",
        fileSizeBytes: BigInt(data.sizeMb * 1024 * 1024),
        durationSeconds: data.duration,
        width: 1920,
        height: 1080,
        status: VideoStatus.ready,
        createdAt
      }
    });

    const scanJob = await prisma.scanJob.create({
      data: {
        organizationId: org.id,
        videoId: video.id,
        createdByUserId: user.id,
        status: ScanJobStatus.completed,
        progressPercent: 100,
        currentStage: "completed",
        scanDepth: index % 3 === 0 ? ScanDepth.deep : ScanDepth.balanced,
        platformPreset: PlatformPreset.youtube,
        contentType: data.contentType,
        language: ScanLanguage.english,
        config: { speech: true, ocr: true, captions: true, context: true },
        startedAt: createdAt,
        completedAt,
        createdAt,
        steps: {
          create: processingSteps.map((name) => ({
            name,
            status: ProcessingStepStatus.completed,
            progressPercent: 100,
            startedAt: createdAt,
            completedAt,
            metadata: { provider: name.includes("ocr") ? "OCR.space" : name.includes("transcribe") ? "Groq Whisper" : "ContentShield AI" }
          }))
        },
        logs: {
          create: [
            { level: "info", message: "Scan Job created", metadata: { videoTitle: data.title }, createdAt },
            { level: "info", message: "Speech transcription completed", metadata: { provider: "Groq Whisper" }, createdAt },
            { level: "info", message: "OCR and caption analysis completed", metadata: { provider: "OCR.space" }, createdAt },
            { level: "info", message: `Safety Report generated with score ${data.score}`, metadata: { verdict: data.verdict }, createdAt: completedAt }
          ]
        }
      }
    });

    await prisma.transcriptSegment.createMany({
      data: [
        {
          scanJobId: scanJob.id,
          startTime: 0,
          endTime: 6.2,
          text: `Welcome back to Creator Shield Studios. Today we are reviewing ${data.title}.`,
          confidence: 0.98,
          speakerLabel: "Maya",
          source: RiskSource.speech
        },
        {
          scanJobId: scanJob.id,
          startTime: 68.5,
          endTime: 82.1,
          text: data.findings[0]?.contextSnippet || "The segment is advertiser friendly and remains educational in tone.",
          confidence: 0.94,
          speakerLabel: "Maya",
          source: RiskSource.speech
        },
        {
          scanJobId: scanJob.id,
          startTime: Math.max(120, data.duration - 95),
          endTime: Math.max(132, data.duration - 82),
          text: "The final review keeps the audience context clear and avoids sensational framing.",
          confidence: 0.96,
          speakerLabel: "Maya",
          source: RiskSource.speech
        }
      ]
    });

    await prisma.ocrSegment.createMany({
      data: [
        {
          scanJobId: scanJob.id,
          startTime: 2,
          endTime: 5,
          detectedText: data.title,
          confidence: 0.93,
          boundingBox: { top: 86, left: 140, width: 890, height: 96 },
          frameStorageKey: `${org.id}/frames/${scanJob.id}/title.jpg`,
          source: RiskSource.onscreen_text
        },
        {
          scanJobId: scanJob.id,
          startTime: data.findings.find((item) => item.source === RiskSource.onscreen_text)?.startTime || 222,
          endTime: data.findings.find((item) => item.source === RiskSource.onscreen_text)?.endTime || 225,
          detectedText: data.findings.find((item) => item.source === RiskSource.onscreen_text)?.contextSnippet || "SPONSOR SAFE SEGMENT",
          confidence: 0.9,
          boundingBox: { top: 720, left: 120, width: 760, height: 72 },
          frameStorageKey: `${org.id}/frames/${scanJob.id}/lower-third.jpg`,
          source: RiskSource.onscreen_text
        }
      ]
    });

    await prisma.captionSegment.createMany({
      data: [
        {
          scanJobId: scanJob.id,
          startTime: 0,
          endTime: 6.2,
          text: `Welcome back to Creator Shield Studios. Today we are reviewing ${data.title}.`,
          language: "en",
          source: RiskSource.caption
        },
        {
          scanJobId: scanJob.id,
          startTime: data.findings.find((item) => item.source === RiskSource.caption)?.startTime || 68.5,
          endTime: data.findings.find((item) => item.source === RiskSource.caption)?.endTime || 82.1,
          text: data.findings.find((item) => item.source === RiskSource.caption)?.contextSnippet || "This section remains clear, contextual, and suitable for most advertisers.",
          language: "en",
          source: RiskSource.caption
        }
      ]
    });

    const createdFindings = [];
    for (const finding of data.findings) {
      const created = await prisma.riskFinding.create({
        data: {
          scanJobId: scanJob.id,
          startTime: finding.startTime,
          endTime: finding.endTime,
          phrase: finding.phrase,
          normalizedPhrase: finding.phrase.toLowerCase(),
          source: finding.source,
          category: finding.category,
          severity: finding.severity,
          confidence: finding.severity === RiskSeverity.critical ? 0.98 : finding.severity === RiskSeverity.high ? 0.94 : 0.86,
          contextSnippet: finding.contextSnippet,
          suggestedReplacement: finding.suggestedReplacement,
          suggestedReplacements: finding.suggestedReplacements,
          reason: finding.reason,
          monetizationImpact: finding.monetizationImpact
        }
      });
      createdFindings.push(created);

      await prisma.replacementSuggestion.createMany({
        data: finding.suggestedReplacements.map((replacement, replacementIndex) => ({
          riskFindingId: created.id,
          phrase: finding.phrase,
          replacement,
          confidence: 0.9 - replacementIndex * 0.04,
          source: "ai"
        }))
      });
    }

    const categoryCounts = new Map<string, typeof createdFindings>();
    for (const finding of createdFindings) {
      categoryCounts.set(finding.category, [...(categoryCounts.get(finding.category) || []), finding]);
    }
    for (const [category, items] of categoryCounts.entries()) {
      const severityRank = { low: 1, medium: 2, high: 3, critical: 4 };
      const highest = items.sort((a, b) => severityRank[b.severity] - severityRank[a.severity])[0];
      await prisma.riskCategorySummary.create({
        data: {
          scanJobId: scanJob.id,
          category,
          findingCount: items.length,
          highestSeverity: highest.severity,
          confidenceAverage: Number((items.reduce((sum, item) => sum + item.confidence, 0) / items.length).toFixed(2)),
          scoreImpact: items.reduce((sum, item) => sum + (item.severity === "critical" ? 18 : item.severity === "high" ? 11 : item.severity === "medium" ? 6 : 2), 0)
        }
      });
    }

    const counts = findingCounts(data.findings);
    await prisma.scanResult.create({
      data: {
        scanJobId: scanJob.id,
        organizationId: org.id,
        safetyScore: data.score,
        verdict: data.verdict,
        totalFindings: data.findings.length,
        ...counts,
        aiSummary: data.findings.length
          ? `${data.title} has ${data.findings.length} Risk Finding${data.findings.length === 1 ? "" : "s"} affecting the Monetization Safety Score. Review suggested replacements before publishing.`
          : `${data.title} is advertiser friendly. ContentShield AI found no blocking monetization risks.`,
        modelVersion: "contentshield-real-demo-v1",
        generatedAt: completedAt,
        createdAt: completedAt
      }
    });

    if (index < 3) {
      const handledCount = index === 0 ? Math.max(0, createdFindings.length - 1) : createdFindings.length;
      const session = await prisma.editorSession.create({
        data: {
          organizationId: org.id,
          scanJobId: scanJob.id,
          videoId: video.id,
          createdByUserId: user.id,
          status: index === 0 ? EditorSessionStatus.in_progress : EditorSessionStatus.completed,
          totalFindings: createdFindings.length,
          pendingCount: Math.max(0, createdFindings.length - handledCount),
          fixedCount: handledCount,
          replacedCount: handledCount,
          completionPercentage: createdFindings.length ? Math.round((handledCount / createdFindings.length) * 100) : 100,
          startedAt: completedAt,
          completedAt: index === 0 ? null : new Date(completedAt.getTime() + 18 * 60 * 1000),
          lockedAt: index === 0 ? null : new Date(completedAt.getTime() + 18 * 60 * 1000)
        }
      });

      for (const [findingIndex, finding] of createdFindings.entries()) {
        const handled = findingIndex < handledCount;
        await prisma.findingReviewState.create({
          data: {
            editorSessionId: session.id,
            riskFindingId: finding.id,
            status: handled ? FindingReviewStatus.replaced : FindingReviewStatus.pending,
            selectedReplacement: handled ? finding.suggestedReplacement : null,
            editorNote: handled ? "Replacement approved for safer monetization framing." : "Needs final creator review.",
            reviewedByUserId: handled ? user.id : null,
            reviewedAt: handled ? new Date(completedAt.getTime() + (findingIndex + 1) * 5 * 60 * 1000) : null
          }
        });

        if (handled) {
          await prisma.findingAction.create({
            data: {
              editorSessionId: session.id,
              riskFindingId: finding.id,
              userId: user.id,
              actionType: EditorActionType.replace,
              startTime: finding.startTime,
              endTime: finding.endTime,
              originalPhrase: finding.phrase,
              replacementPhrase: finding.suggestedReplacement,
              reason: "Applied safer language while preserving editorial meaning.",
              metadata: { confidence: finding.confidence, source: "seeded demo review" },
              createdAt: new Date(completedAt.getTime() + (findingIndex + 1) * 5 * 60 * 1000)
            }
          });
        }
      }

      await prisma.editorNote.create({
        data: {
          editorSessionId: session.id,
          riskFindingId: createdFindings[0]?.id || null,
          userId: user.id,
          note: index === 0
            ? "Keep one unresolved item visible for the investor demo review flow."
            : "Review complete. Export package is ready for the editor handoff.",
          createdAt: new Date(completedAt.getTime() + 12 * 60 * 1000)
        }
      });

      await prisma.exportJob.create({
        data: {
          organizationId: org.id,
          editorSessionId: session.id,
          scanJobId: scanJob.id,
          requestedByUserId: user.id,
          format: index === 0 ? EditorExportFormat.pdf : EditorExportFormat.premiere_markers,
          status: index === 0 ? EditorExportStatus.queued : EditorExportStatus.completed,
          storageKey: `${org.id}/exports/${scanJob.id}/${index === 0 ? "safety-report.pdf" : "premiere-markers.csv"}`,
          downloadUrl: index === 0 ? null : `https://f005.backblazeb2.com/file/contentshield-ai-staging/${org.id}/exports/${scanJob.id}/premiere-markers.csv`,
          completedAt: index === 0 ? null : new Date(completedAt.getTime() + 22 * 60 * 1000)
        }
      });
    }
  }

  console.log("Seeded demo login:");
  console.log(`${demoEmail} / ${demoPassword}`);
  console.log("Organization: Creator Shield Studios, plan: Creator Pro, role: owner");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
