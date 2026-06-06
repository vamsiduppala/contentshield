import type { ScanConfig } from "../types";
import { Card } from "../../../components/ui/Card";

const options = {
  platform: ["YouTube", "TikTok", "Instagram"],
  contentType: ["Geopolitics", "Podcast", "Documentary", "Gaming", "News", "Education"],
  scanDepth: ["Fast", "Balanced", "Deep"],
  language: ["English", "Telugu", "Hindi", "Spanish"]
} as const;

export function ScanConfigPanel({ config, onChange }: { config: ScanConfig; onChange: (config: ScanConfig) => void }) {
  const update = <K extends keyof ScanConfig>(key: K, value: ScanConfig[K]) => onChange({ ...config, [key]: value });

  return (
    <Card className="p-5">
      <h3 className="text-xl font-semibold">Scan configuration</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {Object.entries(options).map(([key, values]) => (
          <label key={key} className="grid gap-2 text-sm font-medium text-white/65">
            {key.replace(/([A-Z])/g, " $1")}
            <select className="min-h-12 rounded-2xl border border-line bg-night px-4 text-white outline-none focus:border-cyan" value={String(config[key as keyof typeof options])} onChange={(event) => update(key as keyof ScanConfig, event.target.value as never)}>
              {values.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
        ))}
      </div>
      <div className="mt-5 grid gap-3">
        {[
          ["includeSpeech", "Speech transcript scan"],
          ["includeOcr", "On-screen text OCR scan"],
          ["includeCaptions", "Captions/subtitles scan"],
          ["includeSensitiveContext", "Sensitive topic context scan"]
        ].map(([key, label]) => (
          <label key={key} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white/[0.04] px-4 py-3 text-sm text-white/70">
            {label}
            <input type="checkbox" checked={Boolean(config[key as keyof ScanConfig])} onChange={(event) => update(key as keyof ScanConfig, event.target.checked as never)} />
          </label>
        ))}
      </div>
    </Card>
  );
}
