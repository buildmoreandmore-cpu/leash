"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const sectionNames: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/agents": "Agents",
  "/dashboard/audit": "Audit Log",
  "/dashboard/approvals": "Approvals",
  "/dashboard/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();

  // Build breadcrumb: always start with "Dashboard", then add the section
  const section = sectionNames[pathname] ?? sectionNames[
    Object.keys(sectionNames).find((key) => pathname.startsWith(key) && key !== "/dashboard") ?? "/dashboard"
  ] ?? "Overview";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-leash bg-surface px-6">
      {/* Left: Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="text-text-muted">Dashboard</span>
        {section !== "Overview" && (
          <>
            <span className="text-text-muted">/</span>
            <span className="font-medium text-text-primary">{section}</span>
          </>
        )}
        {section === "Overview" && (
          <span className="font-medium text-text-primary">/ Overview</span>
        )}
      </nav>

      {/* Right: Search, bell, avatar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search... ⌘K"
            className="h-8 w-56 pl-8 text-xs"
            readOnly
          />
        </div>

        {/* Notification bell */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-surface-hover">
          <Bell className="h-4 w-4 text-text-secondary" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>

        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
          FM
        </div>
      </div>
    </header>
  );
}
