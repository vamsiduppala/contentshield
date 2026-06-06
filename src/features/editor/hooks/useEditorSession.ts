import { useEffect, useReducer, useState } from "react";
import { buildEditorFindings, getCompletion } from "../utils/editorUtils";
import type { EditorFinding, EditorSession } from "../types";

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
  | { type: "COMPLETE_REVIEW" };

function updateActive(session: EditorSession, update: (finding: EditorFinding) => EditorFinding): EditorSession {
  const findings = session.findings.map((finding) => (finding.id === session.activeFindingId ? update(finding) : finding));
  return { ...session, findings, completionPercentage: getCompletion(findings) };
}

function reducer(session: EditorSession, action: Action): EditorSession {
  switch (action.type) {
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
    if (message) setToast(message);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return { session, dispatch, toast };
}
