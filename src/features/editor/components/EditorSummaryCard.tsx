import { CheckCircle2 } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import type { EditorSummary } from "../types";

export function EditorSummaryCard({ summary }: { summary: EditorSummary }) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-acid/30 bg-acid/10 text-acid"><CheckCircle2 /></span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-acid">Review Complete</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">Your video is safer for upload.</h1>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat label="Original score" value={String(summary.originalScore)} />
        <Stat label="Updated estimated score" value={String(summary.updatedScore)} />
        <Stat label="Remaining risk count" value={String(summary.remaining)} />
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-line bg-white/[0.04] p-4"><p className="text-sm text-white/45">{label}</p><strong className="mt-2 block text-4xl">{value}</strong></div>;
}
