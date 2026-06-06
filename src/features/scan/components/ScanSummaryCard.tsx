import { Link } from "react-router-dom";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { formatDate } from "../../../lib/formatters";
import { scoreClass, scoreVerdict } from "../../../lib/riskUtils";
import type { Scan } from "../types";

export function ScanSummaryCard({ scan }: { scan: Scan }) {
  const verdict = scoreVerdict(scan.score);
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-white/42">{formatDate(scan.createdAt)} · {scan.duration}</p>
          <h3 className="mt-2 text-xl font-semibold">{scan.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className="border-line bg-white/[0.04] text-white/58">{scan.status}</Badge>
            <Badge className="border-cyan/25 bg-cyan/10 text-cyan">{verdict}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right"><strong className={`block text-4xl ${scoreClass(scan.score)}`}>{scan.score}</strong><span className="text-sm text-white/42">{scan.riskCount} risks</span></div>
          <Link to={`/scan/results/${scan.id}`}><Button variant="secondary">View Results</Button></Link>
        </div>
      </div>
    </Card>
  );
}
