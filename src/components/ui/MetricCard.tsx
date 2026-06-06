import { Card } from "./Card";

export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card className="p-5 transition hover:-translate-y-1 hover:border-cyan/30">
      <p className="text-sm text-white/45">{label}</p>
      <strong className="mt-3 block text-4xl font-semibold">{value}</strong>
      <p className="mt-3 text-sm leading-6 text-white/48">{detail}</p>
    </Card>
  );
}
