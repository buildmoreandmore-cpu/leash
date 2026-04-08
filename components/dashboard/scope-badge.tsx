"use client";

import { cn } from "@/lib/utils";

const prefixColors: Record<string, string> = {
  read: "bg-info/10 text-info",
  write: "bg-warning/10 text-warning",
  run: "bg-success/10 text-success",
  call: "bg-primary/10 text-primary",
};

function getPrefix(scope: string): string {
  const idx = scope.indexOf(":");
  return idx !== -1 ? scope.slice(0, idx) : "";
}

export function ScopeBadge({ scope }: { scope: string }) {
  const prefix = getPrefix(scope);
  const colors = prefixColors[prefix] ?? "bg-primary/10 text-primary";

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
