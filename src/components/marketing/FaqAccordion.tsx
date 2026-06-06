import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqs } from "../../data/faqs";
import { cn } from "../../lib/cn";

export function FaqAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="grid gap-3">
      {faqs.map((faq, index) => (
        <div key={faq.question} className="rounded-3xl border border-line bg-white/[0.05]">
          <button className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
            {faq.question}
            <ChevronDown className={cn("shrink-0 transition", open === index && "rotate-180")} size={18} />
          </button>
          <AnimatePresence initial={false}>
            {open === index && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                <p className="px-5 pb-5 leading-7 text-white/58">{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
