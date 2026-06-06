import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Logo } from "./Logo";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { cn } from "../../lib/cn";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const progress = useScrollProgress();

  return (
    <header className={cn("fixed inset-x-0 top-0 z-40 transition", progress > 0.02 && "border-b border-line bg-void/72 backdrop-blur-2xl")}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-white/62 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Start Free Scan</Button>
          </Link>
        </div>
        <button className="grid h-11 w-11 place-items-center rounded-full border border-line md:hidden" aria-label="Open menu" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="mx-4 mb-4 rounded-3xl border border-line bg-night/95 p-4 shadow-premium backdrop-blur-2xl md:hidden">
          <nav className="grid gap-2" aria-label="Mobile primary">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="rounded-2xl px-4 py-3 text-white/72 hover:bg-white/8 hover:text-white" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <Link className="rounded-2xl px-4 py-3 text-white/72 hover:bg-white/8 hover:text-white" to="/login">Login</Link>
            <Link to="/signup"><Button className="w-full">Start Free Scan</Button></Link>
          </nav>
        </div>
      )}
    </header>
  );
}
