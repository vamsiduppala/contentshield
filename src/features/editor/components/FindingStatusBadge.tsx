import { Badge } from "../../../components/ui/Badge";
import { cn } from "../../../lib/cn";
import type { FindingStatus } from "../types";

export function FindingStatusBadge({ status }: { status: FindingStatus }) {
  return (
    <Badge className={cn(
      status === "pending" && "border-white/15 bg-white/[0.05] text-white/55",
      status === "ignored" && "border-violet/25 bg-violet/10 text-violet",
      status !== "pending" && status !== "ignored" && "border-acid/25 bg-acid/10 text-acid"
    )}>
      {status}
    </Badge>
  );
}
