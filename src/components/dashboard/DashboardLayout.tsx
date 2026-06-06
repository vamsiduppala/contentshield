import type React from "react";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-void text-white lg:grid lg:grid-cols-[17rem_1fr]">
      <DashboardSidebar />
      <section className="relative overflow-hidden p-4 sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" />
        <div className="relative">{children}</div>
      </section>
    </main>
  );
}
