import { api } from "./api";
import type { EditorFinding, EditorSummary, FindingStatus } from "../features/editor/types";

function formatTime(seconds = 0) {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600).toString().padStart(2, "0");
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(total % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function secondsFromTime(timestamp: string) {
  const [h = 0, m = 0, s = 0] = timestamp.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

function fallbackTranscript(finding: any, transcripts: any[]) {
  const segment = transcripts.find((item) => item.startTime <= finding.startTime && item.endTime >= finding.startTime) || transcripts[0];
  return segment?.text || finding.contextSnippet || "";
}

export function adaptEditorSession(payload: any) {
  const states = new Map((payload.reviewStates || []).map((state: any) => [state.riskFindingId, state]));
  const findings: EditorFinding[] = (payload.findings || []).map((finding: any) => {
    const state: any = states.get(finding.id) || {};
    return {
      id: finding.id,
      timestampStart: formatTime(finding.startTime),
      timestampEnd: formatTime(finding.endTime),
      phrase: finding.phrase,
      source: finding.source,
      category: finding.category,
      severity: finding.severity,
      confidence: Math.round(Number(finding.confidence || 0) * 100),
      transcriptSnippet: fallbackTranscript(finding, payload.transcriptSegments || []),
      screenTextSnippet: finding.source === "onscreen_text" ? finding.contextSnippet : undefined,
      suggestedReplacements: Array.isArray(finding.suggestedReplacements) ? finding.suggestedReplacements : [finding.suggestedReplacement],
      status: (state.status || "pending") as FindingStatus,
      selectedReplacement: state.selectedReplacement || undefined,
      editorNote: state.editorNote || undefined,
      reason: finding.reason,
      monetizationImpact: finding.monetizationImpact
    };
  });
  return {
    scanId: payload.scan?.id || payload.session?.scanJobId,
    findings,
    activeFindingId: findings[0]?.id || "",
    currentTime: findings[0]?.timestampStart || "00:00:00",
    reviewStartedAt: payload.session?.startedAt || payload.session?.createdAt || new Date().toISOString(),
    reviewCompletedAt: payload.session?.completedAt || undefined,
    completionPercentage: payload.progress?.completionPercentage || payload.session?.completionPercentage || 0
  };
}

export async function loadEditorSession(scanId: string) {
  return adaptEditorSession(await api.get(`/editor/${scanId}/session`));
}

export async function applyFindingAction(scanId: string, finding: EditorFinding, actionType: "beep" | "mute" | "blur" | "replace" | "fix" | "ignore", replacementPhrase?: string, reason?: string) {
  return api.post(`/editor/${scanId}/findings/${finding.id}/actions`, {
    actionType,
    startTime: secondsFromTime(finding.timestampStart),
    endTime: secondsFromTime(finding.timestampEnd),
    replacementPhrase,
    reason: reason || (actionType === "ignore" ? "Reviewed and accepted for editorial context." : undefined),
    metadata: { source: "ContentShield AI frontend" }
  });
}

export async function saveFindingNote(scanId: string, findingId: string, note: string) {
  return api.post(`/editor/${scanId}/findings/${findingId}/notes`, { note });
}

export async function completeEditorReview(scanId: string) {
  return api.post(`/editor/${scanId}/session/complete`, {});
}

export async function loadEditorSummary(scanId: string): Promise<EditorSummary> {
  const data = await api.get(`/editor/${scanId}/summary`);
  const session = data.session || {};
  return {
    originalScore: data.originalSafetyScore || 0,
    updatedScore: data.updatedEstimatedSafetyScore || 0,
    resolved: (session.totalFindings || 0) - (data.unresolvedRiskCount || 0),
    remaining: data.unresolvedRiskCount || 0,
    beeped: session.beepedCount || 0,
    muted: session.mutedCount || 0,
    blurred: session.blurredCount || 0,
    replaced: session.replacedCount || 0,
    fixed: session.fixedCount || 0,
    ignored: session.ignoredCount || 0
  };
}

export async function createEditorExport(scanId: string, format: string) {
  const job = await api.post(`/editor/${scanId}/exports`, { format });
  return job;
}
