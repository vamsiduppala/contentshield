import { Captions, FileText, Gauge, Mic, ScanText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { features } from "../../data/features";
import { fadeUp, stagger } from "../../lib/motion";
import { Card } from "../ui/Card";

const icons = { mic: Mic, scanText: ScanText, captions: Captions, gauge: Gauge, sparkles: Sparkles, file: FileText };

export function FeatureGrid() {
  return (
    <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
      {features.map((feature) => {
        const Icon = icons[feature.icon];
        return (
          <motion.div key={feature.title} variants={fadeUp}>
            <Card className="group h-full overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan/40">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/80 to-transparent opacity-0 transition group-hover:opacity-100" />
              <span className="mb-7 grid h-12 w-12 place-items-center rounded-2xl border border-line bg-white/8 text-cyan">
                <Icon size={22} />
              </span>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-white/56">{feature.description}</p>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
