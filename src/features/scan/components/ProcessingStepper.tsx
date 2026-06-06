import { CheckCircle2, CircleDashed } from "lucide-react";
import { processingSteps } from "../data/mockScans";

export function ProcessingStepper({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="grid gap-3">
      {processingSteps.map((step, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <div key={step.id} className={`rounded-2xl border p-4 ${active ? "border-cyan/40 bg-cyan/10" : done ? "border-acid/30 bg-acid/10" : "border-line bg-white/[0.03]"}`}>
            <div className="flex gap-3">
              {done ? <CheckCircle2 className="text-acid" size={19} /> : <CircleDashed className={active ? "text-cyan" : "text-white/30"} size={19} />}
              <div><p className="font-semibold">{step.label}</p><p className="mt-1 text-sm text-white/45">{step.detail}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
