import type { EditorFinding } from "../types";

export function timestampToSeconds(timestamp: string) {
  const [hours, minutes, seconds] = timestamp.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export function timelinePosition(timestamp: string, durationSeconds = 522) {
  return Math.min(98, Math.max(2, (timestampToSeconds(timestamp) / durationSeconds) * 100));
}

export function heatZones(findings: EditorFinding[]) {
  return findings.map((finding) => ({
    id: finding.id,
    left: Math.max(0, timelinePosition(finding.timestampStart) - 3),
    width: finding.severity === "critical" ? 12 : finding.severity === "high" ? 9 : 6
  }));
}
