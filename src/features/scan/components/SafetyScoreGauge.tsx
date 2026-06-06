import { scoreClass } from "../../../lib/riskUtils";

export function SafetyScoreGauge({ score }: { score: number }) {
  return (
    <div className="grid place-items-center rounded-[2rem] border border-line bg-black/24 p-7">
      <div className="grid aspect-square w-48 place-items-center rounded-full border-[16px] border-cyan/20 bg-white/[0.04]" style={{ boxShadow: `inset 0 0 0 10px rgba(124,255,155,${score / 250})` }}>
        <div className="text-center"><strong className={`block text-6xl ${scoreClass(score)}`}>{score}</strong><span className="text-sm text-white/45">Monetization Safety Score</span></div>
      </div>
    </div>
  );
}
