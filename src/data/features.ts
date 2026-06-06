import type { FeatureCard } from "../types";

export const features: FeatureCard[] = [
  { title: "Speech-to-text risk detection", description: "Catch risky spoken language before it becomes a revenue problem.", icon: "mic" },
  { title: "On-screen OCR scanning", description: "Review visible words, labels, overlays, and graphics for hidden risk.", icon: "scanText" },
  { title: "Caption analysis", description: "Scan subtitles and caption files with the same safety lens.", icon: "captions" },
  { title: "Severity scoring", description: "Prioritize moments that deserve attention first.", icon: "gauge" },
  { title: "Safer word suggestions", description: "Give editors precise replacement direction instead of vague warnings.", icon: "sparkles" },
  { title: "Exportable editor reports", description: "Package findings into a Safety Report your team can act on.", icon: "file" }
];
