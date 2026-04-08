"use client";

import { cn } from "@/lib/utils";

const prefixColors: Record<string, string> = {
  read: "bg-cyan-50 text-cyan-700",
  write: "bg-amber-50 text-amber-700",
  run: "bg-emerald-50 text-emerald-700",
  call: "bg-blue-50 text-blue-700",
};

function getPrefix(scope: string): string {
  const idx = scope.indexOf(":");
  return idx !== -1 ? scope.slice(0, idx) : "";
}

export function ScopeBadge({ scope }: { scope: string }) {
  const prefix = getPrefix(scope);
  const colors = prefixColors[prefix] ?? "bg-blue-50 text-blue-700";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-mono",
        colors
      )}
    >
      {scope}
    </span>
  );
}
