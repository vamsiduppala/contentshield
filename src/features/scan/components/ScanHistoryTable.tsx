import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { formatDate } from "../../../lib/formatters";
import { scoreClass, scoreVerdict } from "../../../lib/riskUtils";
import { useScanFilters } from "../hooks/useScanFilters";
import type { Scan } from "../types";

export function ScanHistoryTable({ scans }: { scans: Scan[] }) {
  const { query, setQuery, filter, setFilter, sort, setSort, filtered } = useScanFilters(scans);

  return (
    <div>
      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search scan history" aria-label="Search scan history" />
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="min-h-12 rounded-2xl border border-line bg-night px-4 text-white">
          {["All", "Safe", "Limited Risk", "High Risk", "Critical Risk"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-12 rounded-2xl border border-line bg-night px-4 text-white">
          {["Date", "Score", "Risk Count"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="overflow-hidden rounded-3xl border border-line bg-white/[0.04]">
        <table className="hidden w-full text-left text-sm lg:table">
          <thead className="bg-white/[0.04] text-white/45"><tr>{["Video title", "Date", "Duration", "Score", "Risk count", "Status", ""].map((head) => <th key={head} className="px-4 py-3 font-medium">{head}</th>)}</tr></thead>
          <tbody>
            {filtered.map((scan) => (
              <tr key={scan.id} className="border-t border-line">
                <td className="px-4 py-4 font-medium">{scan.title}</td>
                <td className="px-4 py-4 text-white/55">{formatDate(scan.createdAt)}</td>
                <td className="px-4 py-4 text-white/55">{scan.duration}</td>
                <td className={`px-4 py-4 font-semibold ${scoreClass(scan.score)}`}>{scan.score}</td>
                <td className="px-4 py-4">{scan.riskCount}</td>
                <td className="px-4 py-4 text-white/55">{scoreVerdict(scan.score)}</td>
                <td className="px-4 py-4 text-right"><Link to={`/scan/results/${scan.id}`}><Button variant="secondary">View Results</Button></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid gap-3 p-3 lg:hidden">
          {filtered.map((scan) => (
            <div key={scan.id} className="rounded-2xl border border-line bg-black/20 p-4">
              <h3 className="font-semibold">{scan.title}</h3>
              <p className="mt-2 text-sm text-white/50">{formatDate(scan.createdAt)} · {scan.duration} · {scan.riskCount} risks</p>
              <div className="mt-4 flex items-center justify-between"><strong className={scoreClass(scan.score)}>{scan.score}</strong><Link to={`/scan/results/${scan.id}`}><Button variant="secondary">View Results</Button></Link></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
