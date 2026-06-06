import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import type { EditorFinding } from "../types";

export function ReplacementModal({ finding, open, onClose, onApply }: { finding: EditorFinding; open: boolean; onClose: () => void; onApply: (replacement: string) => void }) {
  const [custom, setCustom] = useState("");
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="w-full max-w-lg rounded-[2rem] border border-line bg-night p-6 shadow-premium" initial={{ y: 24, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: 0.96 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-acid">Replace Word</p>
            <h2 className="mt-2 text-3xl font-semibold">{finding.phrase}</h2>
            <div className="mt-5 grid gap-2">
              {finding.suggestedReplacements.map((item) => (
                <button key={item} className="rounded-2xl border border-line bg-white/[0.04] px-4 py-3 text-left hover:border-acid/40" onClick={() => onApply(item)}>
                  {item}
                </button>
              ))}
            </div>
            <label className="mt-5 grid gap-2 text-sm text-white/62">Custom replacement<Input value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="Enter safer wording" /></label>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button onClick={() => custom.trim() && onApply(custom.trim())}>Apply replacement</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
