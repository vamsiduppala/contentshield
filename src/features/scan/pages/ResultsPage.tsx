import { Download, FileText, Lock, PenTool } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../components/dashboard/DashboardLayout";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { formatDate } from "../../../lib/formatters";
import { getScanResults } from "../../../lib/scanApi";
import { scoreClass } from "../../../lib/riskUtils";
import { RiskCategoryGrid } from "../components/RiskCategoryGrid";
import { RiskFindingsTable } from "../components/RiskFindingsTable";
import { SafetyScoreGauge } from "../components/SafetyScoreGauge";
import type { ScanResult } from "../types";

export function ResultsPage() {
  const { scanId = "scan_1027" } = useParams();
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => { getScanResults(scanId).then(setResult); }, [scanId]);

  if (!result) {
    return <DashboardLayout><Card className="p-6">Loading scan results...</Card></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <header>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan">Results summary</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">{result.videoTitle}</h1>
            <p className="mt-4 text-white/54">Scan completed {formatDate(result.completedAt)}</p>
          </header>
          <Card className="p-6">
            <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
              <SafetyScoreGauge score={result.monetizationSafetyScore} />
              <div>
                <Badge className="border-cyan/25 bg-cyan/10 text-cyan">{result.verdict}</Badge>
                <h2 className={`mt-5 text-5xl font-semibold ${scoreClass(result.monetizationSafetyScore)}`}>{result.monetizationSafetyScore}/100</h2>
                <p className="mt-4 max-w-2xl leading-8 text-white/60">This Monetization Safety Score estimates advertiser-sensitive risk before upload. Review high and critical moments before publishing.</p>
              </div>
            </div>
          </Card>
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Risk category analysis</h2>
            <RiskCategoryGrid categories={result.categories} />
          </section>
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Timestamped Risk Findings</h2>
            <RiskFindingsTable findings={result.findings} />
          </section>
        </div>
        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <Card className="p-5">
            <h2 className="text-xl font-semibold">AI Summary</h2>
            <p className="mt-3 leading-7 text-white/58">{result.summary}</p>
          </Card>
          <Card className="p-5">
            <h2 className="text-xl font-semibold">Exports</h2>
            <div className="mt-4 grid gap-3">
              <Button variant="secondary"><Download size={17} /> Export CSV</Button>
              <Button variant="secondary"><FileText size={17} /> Export PDF</Button>
              <Button variant="secondary"><PenTool size={17} /> Export Editor Notes</Button>
              <Link to={`/scan/editor/${scanId}`}><Button variant="secondary"><Lock size={17} /> Continue to Editor Review</Button></Link>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/42">Continue opens the saved Editor Session for this Safety Report.</p>
          </Card>
          <Link to="/scan/history"><Button className="w-full">Open Scan History</Button></Link>
        </aside>
      </div>
    </DashboardLayout>
  );
}
