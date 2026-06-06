import { TranscriptBlock } from "./TranscriptBlock";
import type { EditorFinding } from "../types";

export function TranscriptPanel({ findings, activeId, onSelect }: { findings: EditorFinding[]; activeId: string; onSelect: (id: string) => void }) {
  if (!findings.length) return <div className="rounded-3xl border border-line p-6 text-white/55">No Risk Findings found in this scan.</div>;
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Transcript review</h2><span className="text-sm text-white/42">Speaker A</span></div>
      {findings.map((finding) => <TranscriptBlock key={finding.id} finding={finding} active={finding.id === activeId} onSelect={() => onSelect(finding.id)} />)}
    </section>
  );
}
