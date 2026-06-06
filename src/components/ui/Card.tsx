import type React from "react";
import { cn } from "../../lib/cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-3xl border border-line bg-white/[0.06] shadow-premium backdrop-blur-2xl", className)} {...props} />;
}
