import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { formatCategory } from "../../../lib/formatters";
import { severityClass } from "../../../lib/riskUtils";
import { FindingStatusBadge } from "./FindingStatusBadge";
import type { EditorFinding } from "../types";

export function TranscriptBlock({ finding, active, onSelect }: { finding: EditorFinding; active: boolean; onSelect: () => void }) {
  const [before, after] = finding.transcriptSnippet.split(finding.phrase);
  return (
    <Card className={`p-4 transition ${active ? "border-cyan/60 shadow-[0_0_50px_rgba(85,214,255,.12)]" : finding.status === "ignored" ? "opacity-55" : ""}`}>
      <button className="w-full text-left" onClick={onSelect}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-cyan">{finding.timestampStart}</span>
          <Badge className={severityClass(finding.severity)}>{finding.severity}</Badge>
          <Badge className="border-line bg-white/[0.04] text-white/52">{finding.source.replace("_", " ")}</Badge>
          <FindingStatusBadge status={finding.status} />
        </div>
        <p className="leading-8 text-white/72">
          {before}
          <span className="rounded-lg border border-amber/30 bg-amber/15 px-1.5 py-0.5 text-amber">{finding.phrase}</span>
          {after}
          {finding.selectedReplacement && <span className="ml-2 rounded-full bg-acid/12 px-2 py-1 text-xs text-acid">→ {finding.selectedReplacement}</span>}
        </p>
        <p className="mt-3 text-sm text-white/40">{formatCategory(finding.category)}</p>
      </button>
    </Card>
  );
}
