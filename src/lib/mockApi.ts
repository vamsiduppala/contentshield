import { defaultScanConfig, mockScans, processingSteps } from "../features/scan/data/mockScans";
import { mockFindings, mockResults } from "../features/scan/data/mockResults";
import type { MockUploadFile, Scan, ScanConfig, ScanResult } from "../features/scan/types";
import { scoreVerdict } from "./riskUtils";
import { api } from "./api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

const scans = new Map<string, Scan>(mockScans.map((scan) => [scan.id, scan]));
const results = new Map<string, ScanResult>(Object.entries(mockResults));

export async function createScan(file: MockUploadFile, config: ScanConfig): Promise<Scan> {
  if (!USE_MOCK) {
    return api.post("/scans", { fileName: file.name, fileSize: file.size, config });
  }
  
  const extension = file.name.split(".").pop()?.toUpperCase() || "MP4";
  const id = `scan_${Date.now()}`;
  const scan: Scan = {
    id,
    title: file.name.replace(/\.[^/.]+$/, ""),
    fileName: file.name,
    fileSizeMb: Math.round((file.size / 1024 / 1024) * 10) / 10,
    format: extension,
    duration: "08:24",
    status: "processing",
    score: 67,
    riskCount: 14,
    createdAt: new Date().toISOString(),
    config
  };

  scans.set(id, scan);
  results.set(id, {
    scanId: id,
    videoTitle: scan.title,
    completedAt: new Date(Date.now() + 1000 * 60 * 3).toISOString(),
    monetizationSafetyScore: 67,
    verdict: scoreVerdict(67),
    summary:
      "This video contains several advertiser-sensitive terms related to conflict, death, and political violence. The highest-risk moments appear between 01:10 and 03:40.",
    categories: mockResults.scan_1027.categories,
    findings: mockFindings
  });

  return scan;
}

export async function getScan(scanId: string): Promise<Scan> {
  if (!USE_MOCK) return api.get(`/scans/${scanId}`);
  return scans.get(scanId) || { ...mockScans[0], id: scanId, config: defaultScanConfig };
}

export async function getScanResults(scanId: string): Promise<ScanResult> {
  if (!USE_MOCK) return api.get(`/scans/${scanId}/results`);
  return results.get(scanId) || { ...mockResults.scan_1027, scanId };
}

export async function getScanHistory(): Promise<Scan[]> {
  if (!USE_MOCK) return api.get("/scans/history").then(data => data.items || []);
  return Array.from(scans.values()).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function simulateScanProgress(progress: number) {
  const clamped = Math.min(100, Math.max(0, progress));
  const stepIndex = Math.min(processingSteps.length - 1, Math.floor((clamped / 100) * processingSteps.length));
  return { progress: clamped, currentStep: processingSteps[stepIndex], stepIndex };
}
