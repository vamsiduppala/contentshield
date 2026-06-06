import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { formatCategory } from "../../../lib/formatters";
import { FindingStatusBadge } from "./FindingStatusBadge";
import type { EditorFinding } from "../types";

export function FindingsDrawer({ findings, onSelect }: { findings: EditorFinding[]; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="mt-5 rounded-3xl border border-line bg-white/[0.04]">
      <div className="flex items-center justify-between p-4"><h2 className="text-xl font-semibold">All findings</h2><Button variant="secondary" onClick={() => setOpen((value) => !value)}>{open ? "Collapse" : "Expand"}</Button></div>
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-white/42"><tr>{["Timestamp", "Phrase", "Category", "Severity", "Source", "Status", "Action"].map((head) => <th key={head} className="px-4 py-3 font-medium">{head}</th>)}</tr></thead>
            <tbody>
              {findings.map((finding) => (
                <tr key={finding.id} className="border-t border-line">
                  <td className="px-4 py-3 font-mono text-cyan">{finding.timestampStart}</td>
                  <td className="px-4 py-3">{finding.phrase}</td>
                  <td className="px-4 py-3 text-white/55">{formatCategory(finding.category)}</td>
                  <td className="px-4 py-3">{finding.severity}</td>
                  <td className="px-4 py-3 text-white/55">{finding.source.replace("_", " ")}</td>
                  <td className="px-4 py-3"><FindingStatusBadge status={finding.status} /></td>
                  <td className="px-4 py-3"><button className="font-semibold text-cyan" onClick={() => onSelect(finding.id)}>Select</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
