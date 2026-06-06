import { motion } from "framer-motion";
import { CheckCircle2, ScanLine, AlertCircle } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../components/dashboard/DashboardLayout";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { ProcessingConsole } from "../components/ProcessingConsole";
import { ProcessingStepper } from "../components/ProcessingStepper";
import { ScanProgressRing } from "../components/ScanProgressRing";
import { WaveformVisualizer } from "../components/WaveformVisualizer";
import { api } from "../../../lib/api";

export function ProcessingPage() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!scanId) return;

    const poll = async () => {
      try {
        const data = await api.get(`/scans/${scanId}/status`);
        setStatus(data);
        if (data.status === "completed") {
          // Stay on page for a second to show 100%
        } else if (data.status === "failed") {
          setError(data.errorMessage || "Processing failed");
        }
      } catch (err: any) {
        console.error("Status poll failed", err);
      }
    };

    const interval = setInterval(poll, 3000);
    poll();
    return () => clearInterval(interval);
  }, [scanId]);

  const progress = status?.progressPercent || 0;
  const complete = status?.status === "completed";
  const logs = (status?.logs || []).map((l: any) => ({
    time: new Date(l.createdAt).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    message: l.message
  }));

  const activeIndex = Math.floor((progress / 100) * 5);

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <AlertCircle className="mb-6 h-16 w-16 text-rose-500" />
          <h1 className="text-3xl font-bold text-white">Scan Failed</h1>
          <p className="mt-4 max-w-md text-white/56">{error}</p>
          <Button className="mt-8" onClick={() => navigate("/scan/new")}>Try Another Video</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-acid">AI processing dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">ContentShield AI is scanning your draft.</h1>
          <p className="mt-4 max-w-2xl leading-8 text-white/56">Estimated completion: under 3 minutes. Real-time analysis powered by Gemini & Groq.</p>
        </header>
        <div className="grid gap-5 xl:grid-cols-[1fr_26rem]">
          <Card className="relative overflow-hidden p-6">
            <motion.div className="absolute inset-y-0 w-24 bg-cyan/10 blur-2xl" animate={{ x: ["-20%", "115%"] }} transition={{ duration: 2.2, repeat: Infinity }} />
            <div className="relative grid place-items-center gap-6">
              {complete ? <CheckCircle2 className="text-acid" size={46} /> : <ScanLine className="text-cyan" size={46} />}
              <ScanProgressRing progress={progress} />
              <WaveformVisualizer />
              <ProcessingConsole logs={logs} />
              {complete && <Link to={`/scan/results/${scanId}`}><Button>View Results</Button></Link>}
            </div>
          </Card>
          <ProcessingStepper activeIndex={activeIndex} />
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
