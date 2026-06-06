import { motion } from "framer-motion";

export function WaveformVisualizer() {
  return (
    <div className="flex h-20 items-center gap-1 rounded-3xl border border-line bg-white/[0.04] px-4">
      {Array.from({ length: 42 }).map((_, index) => (
        <motion.span key={index} className="w-1 rounded-full bg-cyan" animate={{ height: [10, 18 + ((index * 7) % 44), 10] }} transition={{ duration: 1.1, repeat: Infinity, delay: index * 0.025 }} />
      ))}
    </div>
  );
}
