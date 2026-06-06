import { motion } from "framer-motion";

export function ScanProgressRing({ progress }: { progress: number }) {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative grid place-items-center">
      <svg className="h-56 w-56 -rotate-90" viewBox="0 0 220 220" aria-label={`Scan progress ${Math.round(progress)} percent`}>
        <circle cx="110" cy="110" r={radius} stroke="rgba(255,255,255,.1)" strokeWidth="14" fill="none" />
        <motion.circle cx="110" cy="110" r={radius} stroke="url(#scanGradient)" strokeWidth="14" fill="none" strokeLinecap="round" strokeDasharray={circumference} animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }} transition={{ duration: 0.5 }} />
        <defs><linearGradient id="scanGradient"><stop stopColor="#7CFF9B" /><stop offset="1" stopColor="#55D6FF" /></linearGradient></defs>
      </svg>
      <div className="absolute text-center"><strong className="block text-5xl">{Math.round(progress)}%</strong><span className="text-sm text-white/45">AI scan</span></div>
    </div>
  );
}
