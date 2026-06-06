import { Badge } from "../../../components/ui/Badge";
import { formatCategory } from "../../../lib/formatters";
import { severityClass } from "../../../lib/riskUtils";
import type { RiskFinding } from "../types";

export function RiskFindingsTable({ findings }: { findings: RiskFinding[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white/[0.04]">
      <table className="hidden w-full text-left text-sm lg:table">
        <thead className="bg-white/[0.04] text-white/45">
          <tr>{["Timestamp", "Detected phrase", "Source", "Category", "Severity", "Suggested safer alternative", "Confidence"].map((head) => <th key={head} className="px-4 py-3 font-medium">{head}</th>)}</tr>
        </thead>
        <tbody>
          {findings.map((finding) => (
            <tr key={finding.id} className="border-t border-line">
              <td className="px-4 py-4 text-cyan">{finding.timestamp}</td>
              <td className="px-4 py-4">{finding.phrase}</td>
              <td className="px-4 py-4 text-white/55">{finding.source.replace("_", " ")}</td>
              <td className="px-4 py-4 text-white/55">{formatCategory(finding.category)}</td>
              <td className="px-4 py-4"><Badge className={severityClass(finding.severity)}>{finding.severity}</Badge></td>
              <td className="px-4 py-4 text-acid">{finding.suggestion}</td>
              <td className="px-4 py-4">{finding.confidence}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid gap-3 p-3 lg:hidden">
        {findings.map((finding) => (
          <div key={finding.id} className="rounded-2xl border border-line bg-black/20 p-4">
            <div className="flex justify-between gap-3"><strong>{finding.phrase}</strong><Badge className={severityClass(finding.severity)}>{finding.severity}</Badge></div>
            <p className="mt-2 text-sm text-white/50">{finding.timestamp} · {formatCategory(finding.category)} · {finding.confidence}%</p>
            <p className="mt-2 text-sm text-acid">Suggestion: {finding.suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
