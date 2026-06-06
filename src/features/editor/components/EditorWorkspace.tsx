import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FindingInspector } from "./FindingInspector";
import { FindingsDrawer } from "./FindingsDrawer";
import { ReviewProgressBar } from "./ReviewProgressBar";
import { TranscriptPanel } from "./TranscriptPanel";
import { VideoReviewPlayer } from "./VideoReviewPlayer";
import { useEditorSession } from "../hooks/useEditorSession";
import { useFindingSelection } from "../hooks/useFindingSelection";
import { useReviewProgress } from "../hooks/useReviewProgress";

export function EditorWorkspace({ scanId }: { scanId: string }) {
  const navigate = useNavigate();
  const { session, dispatch, toast } = useEditorSession(scanId);
  const { active, next, previous } = useFindingSelection(session.findings, session.activeFindingId);
  const progress = useReviewProgress(session.findings);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.code === "ArrowRight") dispatch({ type: "SELECT_FINDING", id: next.id });
      if (event.code === "ArrowLeft") dispatch({ type: "SELECT_FINDING", id: previous.id });
      if (event.key.toLowerCase() === "f") dispatch({ type: "MARK_FIXED" }, "Marked fixed");
      if (event.key.toLowerCase() === "i") {
        if (active.severity !== "critical" || window.confirm("Ignore this critical finding?")) dispatch({ type: "IGNORE_FINDING" }, "Finding ignored");
      }
      if (event.key.toLowerCase() === "b") dispatch({ type: "APPLY_BEEP" }, "Beep action applied");
      if (event.key.toLowerCase() === "m") dispatch({ type: "APPLY_MUTE" }, "Mute action applied");
      if (event.code === "Space") event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active.severity, dispatch, next.id, previous.id]);

  useEffect(() => {
    if (progress.canFinish && session.reviewCompletedAt) navigate(`/scan/editor/${scanId}/summary`);
  }, [navigate, progress.canFinish, scanId, session.reviewCompletedAt]);

  return (
    <>
      <ReviewProgressBar scanId={scanId} findings={session.findings} onFinish={() => dispatch({ type: "COMPLETE_REVIEW" }, "Review completed")} />
      {toast && <div className="fixed right-5 top-5 z-50 rounded-2xl border border-acid/30 bg-acid/10 px-4 py-3 text-sm text-acid shadow-premium">{toast}</div>}
      <div className="grid gap-5 xl:grid-cols-[40%_35%_25%]">
        <VideoReviewPlayer currentTime={session.currentTime} findings={session.findings} activeId={session.activeFindingId} onSelect={(id) => dispatch({ type: "SELECT_FINDING", id })} />
        <TranscriptPanel findings={session.findings} activeId={session.activeFindingId} onSelect={(id) => dispatch({ type: "SELECT_FINDING", id })} />
        <FindingInspector
          finding={active}
          onBeep={() => dispatch({ type: "APPLY_BEEP" }, "Beep action applied")}
          onMute={() => dispatch({ type: "APPLY_MUTE" }, "Mute action applied")}
          onBlur={() => dispatch({ type: "APPLY_BLUR" }, "Blur action applied")}
          onReplace={(replacement) => dispatch({ type: "APPLY_REPLACEMENT", replacement }, "Replacement applied")}
          onFixed={() => dispatch({ type: "MARK_FIXED" }, "Marked fixed")}
          onIgnore={() => {
            if (active.severity !== "critical" || window.confirm("Ignore this critical finding?")) dispatch({ type: "IGNORE_FINDING" }, "Finding ignored");
          }}
          onNote={(note) => dispatch({ type: "ADD_EDITOR_NOTE", note }, "Note saved")}
        />
      </div>
      <FindingsDrawer findings={session.findings} onSelect={(id) => dispatch({ type: "SELECT_FINDING", id })} />
      <div className="fixed inset-x-3 bottom-3 z-40 rounded-3xl border border-line bg-night/95 p-3 shadow-premium backdrop-blur-xl xl:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-sm">{active.phrase} · {active.status}</span>
          <button className="rounded-full bg-acid px-4 py-2 text-sm font-semibold text-void" onClick={() => dispatch({ type: "MARK_FIXED" }, "Marked fixed")}>Fix</button>
        </div>
      </div>
    </>
  );
}
