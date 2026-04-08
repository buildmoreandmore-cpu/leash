"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Pencil,
  Play,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { ScopeBadge } from "./scope-badge";
import { relativeTime } from "@/lib/utils";
import type { ActionDecision } from "@/lib/fake-data";

interface AuditRowProps {
  timestamp: Date;
  agentName: string;
  action: string;
  target: string;
  scope: string;
  decision: ActionDecision;
  riskDelta: number;
  animate?: boolean;
  index?: number;
}

const actionIcons: Record<string, React.ReactNode> = {
  read: <Eye className="h-3.5 w-3.5" />,
  write: <Pencil className="h-3.5 w-3.5" />,
  run: <Play className="h-3.5 w-3.5" />,
  call: <Phone className="h-3.5 w-3.5" />,
  done: <CheckCircle2 className="h-3.5 w-3.5" />,
};

const decisionStyles: Record<
  ActionDecision,
  { bg: string; text: string; pulse?: boolean }
> = {
  allow: { bg: "bg-emerald-50", text: "text-emerald-700" },
  warn: { bg: "bg-amber-50", text: "text-amber-700" },
  deny: { bg: "bg-red-50", text: "text-red-700" },
  killed: { bg: "bg-red-100", text: "text-red-700", pulse: true },
};

const actionBadgeStyles: Record<string, string> = {
  read: "bg-cyan-50 text-cyan-700",
  write: "bg-amber-50 text-amber-700",
  run: "bg-emerald-50 text-emerald-700",
  call: "bg-blue-50 text-blue-700",
  done: "bg-emerald-50 text-emerald-700",
};

export function AuditRow({
  timestamp,
  agentName,
  action,
  target,
  scope,
  decision,
  riskDelta,
  animate = false,
  index = 0,
}: AuditRowProps) {
  const ds = decisionStyles[decision];
  const actionStyle = actionBadgeStyles[action] ?? "bg-blue-50 text-blue-700";

  const content = (
    <div className="flex items-center gap-3 rounded-lg border border-border-leash bg-white px-3 py-2 text-sm transition-colors hover:bg-slate-50">
      {/* Timestamp */}
      <span className="w-16 shrink-0 text-xs text-text-muted tabular-nums">
        {relativeTime(timestamp)}
      </span>

      {/* Agent name */}
      <span className="w-28 shrink-0 truncate text-xs font-medium text-text-secondary">
        {agentName}
      </span>

      {/* Action badge */}
      <span
        className={`inline-flex w-16 shrink-0 items-center justify-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${actionStyle}`}
      >
        {actionIcons[action]}
        {action}
      </span>

      {/* Target */}
      <span className="min-w-0 flex-1 truncate font-mono text-xs text-text-primary">
        {target}
      </span>

      {/* Scope */}
      <div className="hidden shrink-0 sm:block">
        <ScopeBadge scope={scope} />
      </div>

      {/* Decision */}
      <span
        className={`inline-flex w-16 shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${ds.bg} ${ds.text} ${ds.pulse ? "animate-pulse" : ""}`}
      >
        {decision}
      </span>

      {/* Risk delta */}
      <span
        className={`w-10 shrink-0 text-right text-xs font-mono tabular-nums ${
          riskDelta > 0
            ? "text-danger"
            : riskDelta < 0
              ? "text-success"
              : "text-text-muted"
        }`}
      >
        {riskDelta > 0 ? `+${riskDelta}` : riskDelta === 0 ? "0" : riskDelta}
      </span>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
          delay: index * 0.04,
        }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
