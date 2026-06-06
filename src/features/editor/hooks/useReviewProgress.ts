import { useMemo } from "react";
import { getCompletion } from "../utils/editorUtils";
import type { EditorFinding } from "../types";

export function useReviewProgress(findings: EditorFinding[]) {
  return useMemo(() => {
    const pending = findings.filter((finding) => finding.status === "pending").length;
    const ignored = findings.filter((finding) => finding.status === "ignored").length;
    const fixed = findings.length - pending - ignored;
    const completion = getCompletion(findings);
    return { total: findings.length, pending, ignored, fixed, completion, canFinish: pending === 0 };
  }, [findings]);
}
