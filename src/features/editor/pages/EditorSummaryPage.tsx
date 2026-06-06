import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "../../../components/dashboard/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { EditorSummaryCard } from "../components/EditorSummaryCard";
import { ExportOptionsPanel } from "../components/ExportOptionsPanel";
import { loadEditorSummary } from "../../../lib/editorApi";
import type { EditorSummary } from "../types";

export function EditorSummaryPage() {
  const { scanId = "" } = useParams();
  const [summary, setSummary] = useState<EditorSummary | null>(null);

  useEffect(() => {
    if (scanId) void loadEditorSummary(scanId).then(setSummary);
  }, [scanId]);

  if (!summary) return <DashboardLayout><Card className="p-5">Loading review summary...</Card></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <EditorSummaryCard summary={summary} />
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_24rem]">
          <Card className="p-5">
            <h2 className="text-2xl font-semibold">Actions taken</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                ["Beeped", summary.beeped],
                ["Muted", summary.muted],
                ["Blurred", summary.blurred],
                ["Replaced", summary.replaced],
                ["Ignored", summary.ignored],
                ["Marked fixed", summary.fixed]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-line bg-white/[0.04] p-4">
                  <p className="text-sm text-white/45">{label}</p>
                  <strong className="mt-2 block text-3xl">{value}</strong>
                </div>
              ))}
            </div>
          </Card>
          <ExportOptionsPanel scanId={scanId} />
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
