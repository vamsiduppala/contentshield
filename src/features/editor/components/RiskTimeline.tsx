import { motion } from "framer-motion";
import { severityClass } from "../../../lib/riskUtils";
import { heatZones, timelinePosition } from "../utils/timelineUtils";
import type { EditorFinding } from "../types";

export function RiskTimeline({ findings, activeId, onSelect }: { findings: EditorFinding[]; activeId: string; onSelect: (id: string) => void }) {
  return (
    <div className="relative rounded-3xl border border-line bg-black/24 p-4">
      <div className="mb-3 flex items-center justify-between text-xs text-white/42"><span>Risk timeline</span><span>08:42</span></div>
      <div className="relative h-12 rounded-full bg-white/10">
        {heatZones(findings).map((zone) => <span key={zone.id} className="absolute top-2 h-8 rounded-full bg-amber/10 blur-sm" style={{ left: `${zone.left}%`, width: `${zone.width}%` }} />)}
        {findings.map((finding) => {
          const active = finding.id === activeId;
          return (
            <motion.button
              key={finding.id}
              type="button"
              title={`${finding.timestampStart} · ${finding.phrase} · ${finding.severity}`}
              onClick={() => onSelect(finding.id)}
              whileHover={{ scale: 1.2 }}
              className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border ${severityClass(finding.severity)}`}
              style={{ left: `${timelinePosition(finding.timestampStart)}%` }}
            >
              {active && <motion.span className="absolute inset-[-8px] rounded-full border border-cyan" animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.25, 0.8] }} transition={{ repeat: Infinity, duration: 1.4 }} />}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/45">
        {["low", "medium", "high", "critical"].map((level) => <span key={level} className="capitalize">{level}</span>)}
      </div>
    </div>
  );
}
