import { useEffect, useReducer, useState } from "react";
import { buildEditorFindings, getCompletion } from "../utils/editorUtils";
import type { EditorFinding, EditorSession } from "../types";
import { applyFindingAction, completeEditorReview, loadEditorSession, saveFindingNote } from "../../../lib/editorApi";

type Action =
  | { type: "SELECT_FINDING"; id: string }
  | { type: "SET_CURRENT_TIME"; time: string }
  | { type: "APPLY_BEEP" }
  | { type: "APPLY_MUTE" }
  | { type: "APPLY_BLUR" }
  | { type: "APPLY_REPLACEMENT"; replacement: string }
  | { type: "MARK_FIXED" }
  | { type: "IGNORE_FINDING" }
  | { type: "ADD_EDITOR_NOTE"; note: string }
  | { type: "COMPLETE_REVIEW" }
  | { type: "LOAD_SESSION"; session: EditorSession };

function updateActive(session: EditorSession, update: (finding: EditorFinding) => EditorFinding): EditorSession {
  const findings = session.findings.map((finding) => (finding.id === session.activeFindingId ? update(finding) : finding));
  return { ...session, findings, completionPercentage: getCompletion(findings) };
}

function reducer(session: EditorSession, action: Action): EditorSession {
  switch (action.type) {
    case "LOAD_SESSION":
      return action.session;
    case "SELECT_FINDING":
      return { ...session, activeFindingId: action.id, currentTime: session.findings.find((finding) => finding.id === action.id)?.timestampStart || session.currentTime };
    case "SET_CURRENT_TIME":
      return { ...session, currentTime: action.time };
    case "APPLY_BEEP":
      return updateActive(session, (finding) => ({ ...finding, status: "beeped" }));
    case "APPLY_MUTE":
      return updateActive(session, (finding) => ({ ...finding, status: "muted" }));
    case "APPLY_BLUR":
      return updateActive(session, (finding) => ({ ...finding, status: "blurred" }));
    case "APPLY_REPLACEMENT":
      return updateActive(session, (finding) => ({ ...finding, status: "replaced", selectedReplacement: action.replacement }));
    case "MARK_FIXED":
      return updateActive(session, (finding) => ({ ...finding, status: "fixed" }));
    case "IGNORE_FINDING":
      return updateActive(session, (finding) => ({ ...finding, status: "ignored" }));
    case "ADD_EDITOR_NOTE":
      return updateActive(session, (finding) => ({ ...finding, editorNote: action.note }));
    case "COMPLETE_REVIEW":
      return { ...session, reviewCompletedAt: new Date().toISOString() };
    default:
      return session;
  }
}

export function useEditorSession(scanId: string) {
  const initialFindings = buildEditorFindings();
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [session, dispatchBase] = useReducer(reducer, {
    scanId,
    findings: initialFindings,
    activeFindingId: initialFindings[0]?.id || "",
    currentTime: initialFindings[0]?.timestampStart || "00:00:00",
    reviewStartedAt: new Date().toISOString(),
    completionPercentage: 0
  });

  const dispatch = (action: Action, message?: string) => {
    dispatchBase(action);
    const active = session.findings.find((finding) => finding.id === session.activeFindingId);
    if (active) {
      if (action.type === "APPLY_BEEP") void applyFindingAction(scanId, active, "beep");
      if (action.type === "APPLY_MUTE") void applyFindingAction(scanId, active, "mute");
      if (action.type === "APPLY_BLUR") void applyFindingAction(scanId, active, "blur");
      if (action.type === "APPLY_REPLACEMENT") void applyFindingAction(scanId, active, "replace", action.replacement);
      if (action.type === "MARK_FIXED") void applyFindingAction(scanId, active, "fix");
      if (action.type === "IGNORE_FINDING") void applyFindingAction(scanId, active, "ignore", undefined, "Reviewed and accepted for editorial context.");
      if (action.type === "ADD_EDITOR_NOTE") void saveFindingNote(scanId, active.id, action.note);
    }
    if (action.type === "COMPLETE_REVIEW") void completeEditorReview(scanId);
    if (message) setToast(message);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    loadEditorSession(scanId)
      .then((loaded) => {
        if (!cancelled) dispatchBase({ type: "LOAD_SESSION", session: loaded } as Action);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Editor Session could not be loaded.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [scanId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return { session, dispatch, toast, loading, error };
}
