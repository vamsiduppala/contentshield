import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../components/dashboard/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { getScanHistory } from "../../../lib/scanApi";
import { ScanHistoryTable } from "../components/ScanHistoryTable";
import type { Scan } from "../types";

export function ScanHistoryPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  useEffect(() => { getScanHistory().then(setScans); }, []);

  return (
    <DashboardLayout>
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan">Scan history</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">Every monetization scan in one place.</h1>
        <p className="mt-4 max-w-2xl leading-8 text-white/56">Search, filter, sort, and reopen Safety Reports from your workspace.</p>
      </header>
      {scans.length ? <ScanHistoryTable scans={scans} /> : <Card className="p-6">Upload your first video to generate a monetization safety report.</Card>}
    </DashboardLayout>
  );
}
