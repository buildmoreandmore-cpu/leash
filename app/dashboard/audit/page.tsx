"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ScrollText, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { agents, auditLog } from "@/lib/fake-data";
import { AuditRow } from "@/components/dashboard/audit-row";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Filter options
// ---------------------------------------------------------------------------
const agentOptions = [
  { value: "all", label: "All agents" },
  ...agents.map((a) => ({ value: a.id, label: a.name })),
];

const actionOptions = [
  { value: "all", label: "All actions" },
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "run", label: "Run" },
  { value: "call", label: "Call" },
];

const statusOptions = [
  { value: "all", label: "All decisions" },
  { value: "allow", label: "Allow" },
  { value: "warn", label: "Warn" },
  { value: "deny", label: "Deny" },
  { value: "killed", label: "Killed" },
];

const timeOptions = [
  { value: "all", label: "All time" },
  { value: "1h", label: "Last hour" },
  { value: "24h", label: "Last 24h" },
  { value: "7d", label: "Last 7 days" },
];

const ITEMS_PER_PAGE = 20;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AuditLogPage() {
  const [agentFilter, setAgentFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let result = [...auditLog];

    if (agentFilter !== "all") {
      result = result.filter((e) => e.agentId === agentFilter);
    }
    if (actionFilter !== "all") {
      result = result.filter((e) => e.action === actionFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((e) => e.decision === statusFilter);
    }
    if (timeFilter !== "all") {
      const now = Date.now();
      const msMap: Record<string, number> = {
        "1h": 60 * 60 * 1000,
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
      };
      const cutoff = now - (msMap[timeFilter] ?? 0);
      result = result.filter((e) => e.timestamp.getTime() >= cutoff);
    }

    return result;
  }, [agentFilter, actionFilter, statusFilter, timeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  const handleFilterChange = (
    setter: (val: string) => void,
    val: string
  ) => {
    setter(val);
    setPage(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ScrollText className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-text-primary">Audit Log</h1>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {filtered.length} entries
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-xs text-text-muted">Live updates</span>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap items-center gap-3"
      >
        <Filter className="h-4 w-4 text-text-muted" />
        <select
          value={agentFilter}
          onChange={(e) => handleFilterChange(setAgentFilter, e.target.value)}
          className="h-8 rounded-lg border border-border-leash bg-surface px-2 text-xs text-text-secondary outline-none transition-colors focus:border-primary"
        >
          {agentOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={actionFilter}
          onChange={(e) => handleFilterChange(setActionFilter, e.target.value)}
          className="h-8 rounded-lg border border-border-leash bg-surface px-2 text-xs text-text-secondary outline-none transition-colors focus:border-primary"
        >
          {actionOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
          className="h-8 rounded-lg border border-border-leash bg-surface px-2 text-xs text-text-secondary outline-none transition-colors focus:border-primary"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={timeFilter}
          onChange={(e) => handleFilterChange(setTimeFilter, e.target.value)}
          className="h-8 rounded-lg border border-border-leash bg-surface px-2 text-xs text-text-secondary outline-none transition-colors focus:border-primary"
        >
          {timeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Table header */}
      <div className="rounded-xl border border-border-leash bg-surface">
        <div className="border-b border-border-leash bg-surface-hover px-4 py-2">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="w-16 shrink-0">Time</span>
            <span className="w-28 shrink-0">Agent</span>
            <span className="w-16 shrink-0 text-center">Action</span>
            <span className="min-w-0 flex-1">Target</span>
            <span className="hidden w-24 shrink-0 sm:block">Scope</span>
            <span className="w-16 shrink-0 text-center">Decision</span>
            <span className="w-10 shrink-0 text-right">Risk</span>
          </div>
        </div>
        <div className="space-y-1 p-3">
          {paginated.length > 0 ? (
            paginated.map((entry, i) => (
              <AuditRow
                key={entry.id}
                timestamp={entry.timestamp}
                agentName={entry.agentName}
                action={entry.action}
                target={entry.target}
                scope={entry.scope}
                decision={entry.decision}
                riskDelta={entry.riskDelta}
                animate
                index={i}
              />
            ))
          ) : (
            <p className="py-12 text-center text-xs text-text-muted">
              No entries match the current filters
            </p>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">
          Page {page + 1} of {totalPages} ({filtered.length} total entries)
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="gap-1"
          >
            <ChevronLeft className="h-3 w-3" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="gap-1"
          >
            Next <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
