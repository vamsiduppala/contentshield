import { Download } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { createEditorExport } from "../../../lib/editorApi";

const options = [
  { label: "Download Editor Report PDF", format: "pdf" },
  { label: "Export CSV", format: "csv" },
  { label: "Export Premiere Pro Markers", format: "premiere_markers" },
  { label: "Export CapCut Notes", format: "capcut_notes" }
];

export function ExportOptionsPanel({ scanId }: { scanId: string }) {
  const [message, setMessage] = useState("");

  async function exportFormat(format: string) {
    setMessage("Creating export...");
    try {
      const job = await createEditorExport(scanId, format);
      setMessage(`Export ${job.status}. Refresh in a moment for completed download metadata.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Export failed.");
    }
  }

  return (
    <Card className="p-5">
      <h2 className="text-xl font-semibold">Export-ready editor report</h2>
      <div className="mt-5 grid gap-3">
        {options.map((option) => <Button key={option.format} variant="secondary" onClick={() => exportFormat(option.format)}><Download size={17} /> {option.label}</Button>)}
        <Link to="/dashboard"><Button className="w-full">Back to Dashboard</Button></Link>
      </div>
      {message && <p className="mt-4 text-sm leading-6 text-white/50">{message}</p>}
    </Card>
  );
}
