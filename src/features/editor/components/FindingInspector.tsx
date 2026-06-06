import { useState } from "react";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { formatCategory } from "../../../lib/formatters";
import { severityClass } from "../../../lib/riskUtils";
import { FindingStatusBadge } from "./FindingStatusBadge";
import { FixActionButtons } from "./FixActionButtons";
import { ReplacementModal } from "./ReplacementModal";
import type { EditorFinding } from "../types";

export function FindingInspector({ finding, onBeep, onMute, onBlur, onReplace, onFixed, onIgnore, onNote }: { finding: EditorFinding; onBeep: () => void; onMute: () => void; onBlur: () => void; onReplace: (replacement: string) => void; onFixed: () => void; onIgnore: () => void; onNote: (note: string) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div><p className="font-mono text-sm text-cyan">{finding.timestampStart}–{finding.timestampEnd}</p><h2 className="mt-2 text-3xl font-semibold">{finding.phrase}</h2></div>
        <FindingStatusBadge status={finding.status} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Badge className={severityClass(finding.severity)}>{finding.severity}</Badge>
        <Badge className="border-line bg-white/[0.04] text-white/58">{finding.source.replace("_", " ")}</Badge>
        <Badge className="border-cyan/25 bg-cyan/10 text-cyan">{finding.confidence}% confidence</Badge>
      </div>
      <div className="mt-5 space-y-4 text-sm leading-6 text-white/58">
        <p><strong className="text-white">Category:</strong> {formatCategory(finding.category)}</p>
        <p><strong className="text-white">Context:</strong> {finding.transcriptSnippet}</p>
        <p><strong className="text-white">Why it matters:</strong> {finding.reason}</p>
        <p><strong className="text-white">Monetization impact:</strong> {finding.monetizationImpact}</p>
        {finding.selectedReplacement && <p className="text-acid"><strong>Replacement:</strong> {finding.selectedReplacement}</p>}
      </div>
      <div className="mt-5"><FixActionButtons onBeep={onBeep} onMute={onMute} onBlur={onBlur} onReplace={() => setModalOpen(true)} onFixed={onFixed} onIgnore={onIgnore} /></div>
      <label className="mt-5 grid gap-2 text-sm text-white/62">Editor note<Input defaultValue={finding.editorNote} placeholder="Add note for export report" onBlur={(event) => onNote(event.target.value)} /></label>
      <ReplacementModal finding={finding} open={modalOpen} onClose={() => setModalOpen(false)} onApply={(replacement) => { onReplace(replacement); setModalOpen(false); }} />
    </Card>
  );
}
