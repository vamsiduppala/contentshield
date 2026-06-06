import { useEffect, useMemo, useState } from "react";
import { processingSteps } from "../data/mockScans";

export function useMockScanProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(100, value + 4));
    }, 420);
    return () => window.clearInterval(timer);
  }, []);

  const activeIndex = useMemo(() => Math.min(processingSteps.length - 1, Math.floor((progress / 100) * processingSteps.length)), [progress]);
  const logs = useMemo(() => processingSteps.slice(0, activeIndex + 1).map((step) => `${step.label.toLowerCase()}... ${activeIndex === processingSteps.indexOf(step) ? "running" : "complete"}`), [activeIndex]);

  return { progress, activeIndex, complete: progress >= 100, logs };
}
