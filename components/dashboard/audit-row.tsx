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
  allow: { bg: "bg-success/10", text: "text-success" },
  warn: { bg: "bg-warning/10", text: "text-warning" },
  deny: { bg: "bg-danger/10", text: "text-danger" },
  killed: { bg: "bg-danger/20", text: "text-danger", pulse: true },
};

const actionBadgeStyles: Record<string, string> = {
  read: "bg-info/10 text-info",
  write: "bg-warning/10 text-warning",
  run: "bg-success/10 text-success",
  call: "bg-primary/10 text-primary",
  done: "bg-success/10 text-success",
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
  const actionStyle = actionBadgeStyles[action] ?? "bg-primary/10 text-primary";

  const content = (
    <div className="overflow-x-auto rounded-lg border border-border-leash bg-surface transition-colors hover:bg-surface-hover">
      <div className="flex min-w-[480px] items-center gap-2 px-3 py-2 text-sm sm:gap-3">
        {/* Timestamp */}
        <span className="w-14 shrink-0 text-xs text-text-muted tabular-nums sm:w-16">
          {relativeTime(timestamp)}
        </span>

        {/* Agent name */}
        <span className="w-24 shrink-0 truncate text-xs font-medium text-text-secondary sm:w-28">
          {agentName}
        </span>

        {/* Action badge */}
        <span
          className={`inline-flex w-14 shrink-0 items-center justify-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium sm:w-16 ${actionStyle}`}
        >
          {actionIcons[action]}
          {action}
        </span>

        {/* Target */}
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-text-primary">
          {target}
        </span>

        {/* Scope */}
        <div className="hidden shrink-0 md:block">
          <ScopeBadge scope={scope} />
        </div>

        {/* Decision */}
        <span
          className={`inline-flex w-14 shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium sm:w-16 ${ds.bg} ${ds.text} ${ds.pulse ? "animate-pulse" : ""}`}
        >
          {decision}
        </span>

        {/* Risk delta */}
        <span
          className={`w-8 shrink-0 text-right text-xs font-mono tabular-nums sm:w-10 ${
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
