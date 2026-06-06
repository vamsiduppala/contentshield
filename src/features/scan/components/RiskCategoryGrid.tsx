import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { formatCategory } from "../../../lib/formatters";
import { severityClass } from "../../../lib/riskUtils";
import type { RiskCategorySummary } from "../types";

export function RiskCategoryGrid({ categories }: { categories: RiskCategorySummary[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((item) => (
        <Card key={item.category} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div><h3 className="font-semibold">{formatCategory(item.category)}</h3><p className="mt-1 text-sm text-white/45">{item.count} risks · {item.confidence}% confidence</p></div>
            <Badge className={severityClass(item.severity)}>{item.severity}</Badge>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/10"><span className="block h-2 rounded-full bg-cyan" style={{ width: `${item.confidence}%` }} /></div>
        </Card>
      ))}
    </div>
  );
}
