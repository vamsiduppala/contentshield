import { forwardRef } from "react";
import type React from "react";
import { cn } from "../../lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "primary", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan",
      variant === "primary" && "bg-acid text-void shadow-[0_0_36px_rgba(124,255,155,.28)] hover:-translate-y-0.5 hover:bg-white",
      variant === "secondary" && "border border-line bg-white/8 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:border-cyan/50",
      variant === "ghost" && "text-white/72 hover:text-white",
      className
    )}
    {...props}
  />
));

Button.displayName = "Button";
