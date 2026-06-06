import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { Card } from "../ui/Card";

export function ProductMockup() {
  const stats = [
    ["Monetization Safety Score", "87/100"],
    ["Risk Words Detected", "14"],
    ["High-Risk Moments", "3"],
    ["Suggested Fixes", "11"]
  ];

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/12 via-transparent to-violet/18" />
      <div className="relative flex items-center justify-between border-b border-line pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/40">Scan preview</p>
          <h3 className="mt-1 text-xl font-semibold">Creator draft review</h3>
        </div>
        <span className="rounded-full border border-acid/40 bg-acid/10 px-3 py-1 text-xs font-semibold text-acid">Mock state</span>
      </div>
      <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
        {stats.map(([label, value], index) => (
          <motion.div key={label} className="rounded-2xl border border-line bg-black/20 p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + index * 0.08 }}>
            <p className="text-sm text-white/48">{label}</p>
            <strong className="mt-2 block text-2xl text-white">{value}</strong>
          </motion.div>
        ))}
      </div>
      <div className="relative mt-5 rounded-2xl border border-line bg-black/20 p-4">
        <div className="mb-4 flex items-center justify-between text-sm text-white/54">
          <span>Timeline risk map</span>
          <Sparkles size={16} className="text-cyan" />
        </div>
        <div className="relative h-3 rounded-full bg-white/10">
          {[18, 43, 71].map((left) => (
            <span key={left} className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-void bg-amber shadow-[0_0_22px_rgba(255,211,138,.45)]" style={{ left: `${left}%` }} />
          ))}
        </div>
      </div>
      <div className="relative mt-5 grid gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-amber/20 bg-amber/10 p-3 text-sm"><AlertTriangle size={17} className="text-amber" /> High-risk phrase at 02:14</div>
        <div className="flex items-center gap-3 rounded-2xl border border-acid/20 bg-acid/10 p-3 text-sm"><CheckCircle2 size={17} className="text-acid" /> 11 safer fixes available</div>
      </div>
    </Card>
  );
}
