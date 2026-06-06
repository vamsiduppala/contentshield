import { defaultScanConfig } from "../features/scan/data/mockScans";
import type { Scan, ScanResult } from "../features/scan/types";
import { scoreVerdict } from "./riskUtils";
import { api } from "./api";

export async function getScanResults(scanId: string): Promise<ScanResult> {
  const data = await api.get(`/scans/${scanId}/results`);
  return {
    scanId,
    videoTitle: data.video?.originalFileName || "Untitled video",
    completedAt: data.scan?.completedAt || new Date().toISOString(),
    monetizationSafetyScore: data.safetyScore,
    verdict: scoreVerdict(data.safetyScore),
    summary: data.aiSummary,
    categories: (data.categories || []).map((category: any) => ({
      category: category.category,
      count: category.findingCount,
      severity: category.highestSeverity,
      confidence: category.confidenceAverage
    })),
    findings: (data.findings || []).map((finding: any) => ({
      id: finding.id,
      timestamp: `${Math.floor(finding.startTime / 60).toString().padStart(2, "0")}:${Math.floor(finding.startTime % 60).toString().padStart(2, "0")}`,
      phrase: finding.phrase,
      source: finding.source,
      category: finding.category,
      severity: finding.severity,
      suggestion: finding.suggestedReplacement,
      confidence: finding.confidence
    }))
  };
}

export async function getScanHistory(): Promise<Scan[]> {
  return api.get("/scans/history").then((data) => (data.items || []).map((item: any) => ({
    id: item.id,
    title: item.video?.originalFileName?.replace(/\.[^/.]+$/, "") || "Untitled video",
    fileName: item.video?.originalFileName || "video.mp4",
    fileSizeMb: Math.round(Number(item.video?.fileSizeBytes || 0) / 1024 / 1024),
    format: item.video?.mimeType || "video/mp4",
    duration: item.video?.durationSeconds ? `${Math.floor(item.video.durationSeconds / 60)}:${String(item.video.durationSeconds % 60).padStart(2, "0")}` : "--",
    status: item.status,
    score: item.result?.safetyScore || 0,
    riskCount: item.result?.totalFindings || 0,
    createdAt: item.createdAt,
    completedAt: item.completedAt,
    config: defaultScanConfig
  })));
}
