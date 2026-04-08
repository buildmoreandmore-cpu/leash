"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { relativeTime } from "@/lib/utils";
import type { AgentStatus } from "@/lib/fake-data";

interface AgentCardProps {
  id: string;
  name: string;
  status: AgentStatus;
  lastActive: Date;
  riskScore: number;
}

const statusConfig: Record<
  AgentStatus,
  { color: string; bg: string; pulse: boolean }
> = {
  active: { color: "bg-success", bg: "bg-success/20", pulse: true },
  paused: { color: "bg-warning", bg: "bg-warning/20", pulse: false },
  revoked: { color: "bg-danger", bg: "bg-danger/20", pulse: false },
};

export function AgentCard({
  id,
  name,
  status,
  lastActive,
  riskScore,
}: AgentCardProps) {
  const sc = statusConfig[status];
  const clampedScore = Math.max(0, Math.min(100, riskScore));

  const fillColor =
    clampedScore <= 30
      ? "bg-success"
      : clampedScore <= 60
        ? "bg-warning"
        : "bg-danger";

  return (
    <Link href={`/dashboard/agents/${id}`}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="group rounded-lg border border-border-leash bg-surface p-3 transition-all hover:bg-surface-hover"
      >
        {/* Top row: name + status dot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {sc.pulse && (
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full ${sc.bg} opacity-75`}
                  style={{ animationDuration: "1.5s" }}
                />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${sc.color}`}
              />
            </span>
            <span className="text-sm font-medium text-text-primary">
              {name}
            </span>
          </div>
          <span className="text-xs capitalize text-text-muted">{status}</span>
        </div>

        {/* Last active */}
        <p className="mt-1 text-xs text-text-muted">
          Last active {relativeTime(lastActive)}
        </p>

        {/* Mini risk meter */}
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-text-muted">
              Risk
            </span>
            <span className="text-[10px] font-medium tabular-nums text-text-secondary">
              {clampedScore}
            </span>
          </div>
          <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-surface-hover">
            <div className="flex h-full">
              <div className="h-full w-[30%] bg-success/20" />
              <div className="h-full w-[30%] bg-warning/20" />
              <div className="h-full w-[40%] bg-danger/20" />
            </div>
          </div>
          <div
            className={`-mt-1 h-1 rounded-full ${fillColor}`}
            style={{ width: `${clampedScore}%` }}
          />
        </div>
      </motion.div>
    </Link>
  );
}
