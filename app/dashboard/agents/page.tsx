"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bot,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pause,
  ShieldOff,
} from "lucide-react";
import { agents, type Agent } from "@/lib/fake-data";
import { relativeTime, formatNumber } from "@/lib/utils";
import { ScopeBadge } from "@/components/dashboard/scope-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ---------------------------------------------------------------------------
// Status pill styles
// ---------------------------------------------------------------------------
const statusStyles: Record<
  Agent["status"],
  { dot: string; pill: string; label: string }
> = {
  active: {
    dot: "bg-success",
    pill: "bg-success/10 text-success",
    label: "Active",
  },
  paused: {
    dot: "bg-warning",
    pill: "bg-warning/10 text-warning",
    label: "Paused",
  },
  revoked: {
    dot: "bg-danger",
    pill: "bg-danger/10 text-danger",
    label: "Revoked",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AgentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = agents.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Bot className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-text-primary">Agents</h1>
        </div>

        <Dialog>
          <DialogTrigger
            render={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Register agent
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register new agent</DialogTitle>
              <DialogDescription>
                Fill in the details below to register a new AI agent.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">
                  Agent name
                </label>
                <Input placeholder="e.g. deploy-bot" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">
                  Owner email
                </label>
                <Input placeholder="owner@example.com" type="email" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">
                  Description
                </label>
                <Input placeholder="What this agent does" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">
                  Initial scopes
                </label>
                <Input placeholder="read:src, write:src" />
              </div>
            </div>
            <DialogFooter showCloseButton>
              <Button>Register</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
        <Input
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border-leash bg-surface">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-border-leash bg-surface-hover text-left text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Scopes</th>
              <th className="px-4 py-3 font-medium">Last active</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Actions (24h)</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((agent, i) => {
              const ss = statusStyles[agent.status];
              const riskPct = Math.min(100, agent.riskScore);
              const riskColor =
                riskPct <= 30
                  ? "bg-success"
                  : riskPct <= 60
                    ? "bg-warning"
                    : "bg-danger";

              return (
                <motion.tr
                  key={agent.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                    delay: i * 0.04,
                  }}
                  onClick={() => router.push(`/dashboard/agents/${agent.id}`)}
                  className="cursor-pointer border-b border-border-leash/30 transition-colors hover:bg-surface-hover"
                >
                  {/* Name + status dot */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${ss.dot}`} />
                      <span className="font-medium text-text-primary">
                        {agent.name}
                      </span>
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="px-4 py-3 text-text-secondary">
                    {agent.owner}
                  </td>

                  {/* Scopes */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {agent.scopes.length > 0 ? (
                        agent.scopes.map((s) => (
                          <ScopeBadge key={s} scope={s} />
                        ))
                      ) : (
                        <span className="text-xs text-text-muted">None</span>
                      )}
                    </div>
                  </td>

                  {/* Last active */}
                  <td className="px-4 py-3 text-xs text-text-muted tabular-nums">
                    {relativeTime(agent.lastActive)}
                  </td>

                  {/* Risk score bar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-hover">
                        <div
                          className={`h-full rounded-full ${riskColor}`}
                          style={{ width: `${riskPct}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-text-muted">
                        {agent.riskScore}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-xs tabular-nums text-text-secondary">
                    {formatNumber(agent.actionsToday)}
                  </td>

                  {/* Status pill */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ss.pill}`}
                    >
                      {ss.label}
                    </span>
                  </td>

                  {/* Three-dot menu */}
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(
                            menuOpen === agent.id ? null : agent.id
                          );
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-surface-hover"
                      >
                        <MoreHorizontal className="h-4 w-4 text-text-muted" />
                      </button>
                      {menuOpen === agent.id && (
                        <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-border-leash bg-surface py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard/agents/${agent.id}`);
                              setMenuOpen(null);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-surface-hover"
                          >
                            <Eye className="h-3 w-3" /> View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(null);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-surface-hover"
                          >
                            <Pause className="h-3 w-3" /> Pause
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(null);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-danger transition-colors hover:bg-surface-hover"
                          >
                            <ShieldOff className="h-3 w-3" /> Revoke
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
