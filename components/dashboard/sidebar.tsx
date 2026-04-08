"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Bot,
  ScrollText,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Agents", href: "/dashboard/agents", icon: Bot },
  { label: "Audit log", href: "/dashboard/audit", icon: ScrollText },
  { label: "Approvals", href: "/dashboard/approvals", icon: ShieldCheck },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border-leash bg-surface">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-5">
        <Shield className="h-5 w-5 text-primary" />
        <span className="text-lg font-bold tracking-tight text-text-primary">
          Leash
        </span>
      </div>

      {/* Nav items */}
      <nav className="mt-2 flex flex-1 flex-col gap-0.5 px-3">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200",
                active
                  ? "border-l-2 border-primary bg-primary/10 text-primary"
                  : "border-l-2 border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: plan card */}
      <div className="m-3 rounded-lg border border-border-leash bg-background/50 p-3">
        <p className="text-xs font-medium text-text-primary">Hobby Plan</p>
        <p className="mt-0.5 text-xs text-text-muted">1 of 1 agents used</p>
        <Link
          href="/dashboard/settings"
          className="mt-2 inline-block text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          Upgrade
        </Link>
      </div>
    </aside>
  );
}
