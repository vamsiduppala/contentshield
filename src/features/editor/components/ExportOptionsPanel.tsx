import { Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

export function ExportOptionsPanel() {
  return (
    <Card className="p-5">
      <h2 className="text-xl font-semibold">Export-ready editor report</h2>
      <div className="mt-5 grid gap-3">
        {["Download Editor Report PDF", "Export CSV", "Export Premiere Pro Markers", "Export CapCut Notes"].map((label) => <Button key={label} variant="secondary"><Download size={17} /> {label}</Button>)}
        <Link to="/dashboard"><Button className="w-full">Back to Dashboard</Button></Link>
      </div>
    </Card>
  );
}
