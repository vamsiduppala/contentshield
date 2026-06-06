import { motion } from "framer-motion";

type ProcessingLog = string | { time?: string; message?: string };

function formatLog(log: ProcessingLog) {
  if (typeof log === "string") return log;
  return [log.time, log.message].filter(Boolean).join(" - ");
}

export function ProcessingConsole({ logs }: { logs: ProcessingLog[] }) {
  return (
    <div className="rounded-3xl border border-line bg-black/40 p-4 font-mono text-sm text-cyan/80">
      {logs.map((log, index) => {
        const label = formatLog(log);
        return <motion.p key={`${label}-${index}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="py-1">&gt; {label}</motion.p>;
      })}
    </div>
  );
}
