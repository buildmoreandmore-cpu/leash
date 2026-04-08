"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-border-leash bg-surface px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center">
            <Logo size="sm" animated={false} />
          </Link>
          <p className="text-sm text-text-muted">
            &copy; 2026 Leash. Identity for the agent workforce.
          </p>
        </div>
      </div>
    </footer>
  );
}
