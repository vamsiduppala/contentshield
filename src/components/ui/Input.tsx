import { forwardRef } from "react";
import type React from "react";
import { cn } from "../../lib/cn";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn("min-h-12 rounded-2xl border border-line bg-white/[0.06] px-4 text-white outline-none transition placeholder:text-white/36 focus:border-cyan/70 focus:ring-4 focus:ring-cyan/10", className)}
    {...props}
  />
));

Input.displayName = "Input";
