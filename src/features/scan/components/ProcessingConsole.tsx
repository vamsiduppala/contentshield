import { motion } from "framer-motion";

export function ProcessingConsole({ logs }: { logs: string[] }) {
  return (
    <div className="rounded-3xl border border-line bg-black/40 p-4 font-mono text-sm text-cyan/80">
      {logs.map((log) => <motion.p key={log} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="py-1">› {log}</motion.p>)}
    </div>
  );
}
