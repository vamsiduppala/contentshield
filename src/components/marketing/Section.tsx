import { motion } from "framer-motion";
import type React from "react";
import { fadeUp } from "../../lib/motion";
import { cn } from "../../lib/cn";

export function Section({ id, eyebrow, title, children, className }: { id?: string; eyebrow?: string; title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28", className)}>
      {(eyebrow || title) && (
        <motion.div className="mb-10 max-w-3xl" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-acid">{eyebrow}</p>}
          {title && <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">{title}</h2>}
        </motion.div>
      )}
      {children}
    </section>
  );
}
