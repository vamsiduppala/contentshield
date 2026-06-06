import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { useReviewProgress } from "../hooks/useReviewProgress";
import type { EditorFinding } from "../types";

export function ReviewProgressBar({ scanId, findings, onFinish }: { scanId: string; findings: EditorFinding[]; onFinish?: () => void }) {
  const progress = useReviewProgress(findings);
  return (
    <Card className="sticky top-0 z-30 mb-5 rounded-3xl p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-4 text-sm text-white/58">
            <strong className="text-white">{progress.total} findings</strong>
            <span>{progress.fixed} fixed</span>
            <span>{progress.ignored} ignored</span>
            <span>{progress.pending} pending</span>
            <span>{progress.completion}% complete</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <span className="block h-2 rounded-full bg-acid transition-all" style={{ width: `${progress.completion}%` }} />
          </div>
        </div>
        <Link to={`/scan/editor/${scanId}/summary`} onClick={onFinish}>
          <Button disabled={!progress.canFinish}>Finish Review</Button>
        </Link>
      </div>
    </Card>
  );
}
