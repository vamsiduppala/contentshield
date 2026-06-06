import { useMemo } from "react";
import type { EditorFinding } from "../types";

export function useFindingSelection(findings: EditorFinding[], activeFindingId: string) {
  return useMemo(() => {
    const active = findings.find((finding) => finding.id === activeFindingId) || findings[0];
    const index = Math.max(0, findings.findIndex((finding) => finding.id === active?.id));
    const previous = findings[Math.max(0, index - 1)];
    const next = findings[Math.min(findings.length - 1, index + 1)];
    return { active, index, previous, next };
  }, [activeFindingId, findings]);
}
