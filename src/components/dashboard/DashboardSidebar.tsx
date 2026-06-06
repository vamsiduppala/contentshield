import { BarChart3, CreditCard, FileText, LayoutDashboard, ShieldCheck, Upload, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../layout/Logo";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Start New Scan", icon: Upload, href: "/scan/new" },
  { label: "Scan History", icon: ShieldCheck, href: "/scan/history" },
  { label: "Editor Review", icon: BarChart3, href: "/scan/editor/scan_1027" },
  { label: "Safety Reports", icon: FileText, href: "/scan/results/scan_1027" },
  { label: "Team", icon: Users, href: "/dashboard" },
  { label: "Plan", icon: CreditCard, href: "/dashboard" }
];

export function DashboardSidebar() {
  const location = useLocation();
  return (
    <aside className="border-r border-line bg-white/[0.04] p-4 backdrop-blur-2xl lg:min-h-screen">
      <Logo />
      <nav className="mt-8 grid gap-2" aria-label="Dashboard">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.href || (item.href.includes("/scan/results") && location.pathname.includes("/scan/results")) || (item.href.includes("/scan/editor") && location.pathname.includes("/scan/editor"));
          return (
            <Link key={item.label} to={item.href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? "bg-acid/12 text-acid" : "text-white/48 hover:bg-white/[0.06] hover:text-white"}`}>
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
