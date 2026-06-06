import { motion } from "framer-motion";
import { ArrowUpRight, Bell, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { MetricCard } from "../../components/ui/MetricCard";
import { getCreatorContent, type CreatorContent, type LocalUser } from "../../lib/localAuth";
import { getScanHistory } from "../../lib/mockApi";
import { ScanSummaryCard } from "../scan/components/ScanSummaryCard";
import type { Scan } from "../scan/types";

const trendData = [
  { day: "Mon", score: 72 },
  { day: "Tue", score: 78 },
  { day: "Wed", score: 74 },
  { day: "Thu", score: 86 },
  { day: "Fri", score: 81 },
  { day: "Sat", score: 88 }
];

export function DashboardPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [content, setContent] = useState<CreatorContent[]>([]);

  useEffect(() => { getScanHistory().then(setScans); }, []);
  useEffect(() => {
    getCreatorContent().then((payload) => {
      if (!payload) return;
      setLocalUser(payload.user);
      setContent(payload.items);
    });
  }, []);

  const metrics = useMemo(() => {
    const total = scans.length;
    const average = total ? Math.round(scans.reduce((sum, scan) => sum + scan.score, 0) / total) : 0;
    const highRisk = scans.filter((scan) => scan.score < 70).length;
    const suggestions = scans.reduce((sum, scan) => sum + scan.riskCount, 0);
    return [
      { label: "Total Scans", value: String(total), detail: "Mock Scan Jobs reviewed" },
      { label: "Average Safety Score", value: String(average), detail: "Across recent videos" },
      { label: "High-Risk Videos", value: String(highRisk), detail: "Need review before upload" },
      { label: "Fix Suggestions Generated", value: String(suggestions), detail: "Safer alternatives surfaced" }
    ];
  }, [scans]);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <header className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan">AI command center</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">Welcome{localUser ? `, ${localUser.firstName}` : ""}.</h1>
            <p className="mt-3 max-w-2xl text-white/54">{localUser ? `Logged in as ${localUser.email}. Your local creator content is loaded from SQLite.` : "Log in to load your local creator workspace."}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white/[0.05]" aria-label="Notifications"><Bell size={18} /></button>
            <Link to="/scan/new"><Button><Upload size={17} /> Start New Scan</Button></Link>
          </div>
        </header>

        <Card className="mt-6 overflow-hidden p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-acid">Next best action</p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Upload your next draft before YouTube reviews it.</h2>
              <p className="mt-4 max-w-2xl leading-8 text-white/56">The core Module 2 flow is ready: upload mock file, watch AI processing, and open the results summary.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/scan/new"><Button>Start New Scan <ArrowUpRight size={17} /></Button></Link>
                <Link to="/scan/history"><Button variant="secondary">View Scan History</Button></Link>
              </div>
            </div>
            <Card className="p-5">
              <p className="text-sm text-white/44">Monthly scan usage</p>
              <strong className="mt-4 block text-5xl">92<span className="text-lg text-white/40">/150</span></strong>
              <div className="mt-5 h-2 rounded-full bg-white/10"><span className="block h-2 w-[61%] rounded-full bg-acid" /></div>
              <p className="mt-4 text-sm text-white/45">Studio plan active</p>
            </Card>
          </div>
        </Card>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
        </div>

        {content.length > 0 && (
          <section className="mt-6 space-y-4">
            <h2 className="text-2xl font-semibold">Your linked creator content</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {content.map((item) => (
                <Card key={item.id} className="p-5">
                  <p className="text-sm text-white/42">{item.platform} · {item.status}</p>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <div className="mt-4 flex items-end justify-between">
                    <strong className="text-4xl text-acid">{item.safety_score || "--"}</strong>
                    <span className="text-sm text-white/45">{item.risk_count} risks</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/52">{item.notes}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_22rem]">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Recent scans</h2>
              <Link to="/scan/history" className="text-sm font-semibold text-cyan">Open history</Link>
            </div>
            {scans.length ? scans.slice(0, 3).map((scan) => <ScanSummaryCard key={scan.id} scan={scan} />) : <Card className="p-6">Upload your first video to generate a monetization safety report.</Card>}
          </section>

          <aside className="space-y-5">
            <Card className="p-5">
              <h2 className="text-xl font-semibold">Risk trend</h2>
              <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs><linearGradient id="scoreFill" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#55D6FF" stopOpacity={0.35} /><stop offset="95%" stopColor="#55D6FF" stopOpacity={0} /></linearGradient></defs>
                    <Tooltip contentStyle={{ background: "#090D1F", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16 }} />
                    <Area type="monotone" dataKey="score" stroke="#55D6FF" fill="url(#scoreFill)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-5">
              <h2 className="text-xl font-semibold">Plan status</h2>
              <p className="mt-3 leading-7 text-white/52">Creator Pro mock plan. Upgrade prompts are visual only until backend billing exists.</p>
              <Button className="mt-5 w-full" variant="secondary">Upgrade Plan</Button>
            </Card>
          </aside>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
