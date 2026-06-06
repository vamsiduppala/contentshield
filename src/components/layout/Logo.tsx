import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 font-semibold tracking-tight text-white" aria-label="ContentShield AI home">
      <span className="grid h-10 w-10 place-items-center rounded-2xl border border-acid/40 bg-acid/10 text-acid shadow-[0_0_28px_rgba(124,255,155,.25)]">
        <ShieldCheck size={20} />
      </span>
      <span>ContentShield AI</span>
    </Link>
  );
}
