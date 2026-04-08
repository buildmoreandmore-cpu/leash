"use client";

import { use, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Globe,
  Plus,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { agents, auditLog, type Agent } from "@/lib/fake-data";
import { relativeTime } from "@/lib/utils";
import { LiveDemo } from "@/components/dashboard/live-demo";
import { ScopeBadge } from "@/components/dashboard/scope-badge";
import { KillSwitchButton } from "@/components/dashboard/kill-switch-button";
import { AuditRow } from "@/components/dashboard/audit-row";
import { RiskMeter } from "@/components/dashboard/risk-meter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

// ---------------------------------------------------------------------------
// Status styles
// ---------------------------------------------------------------------------
const statusDot: Record<Agent["status"], string> = {
  active: "bg-success",
  paused: "bg-warning",
  revoked: "bg-danger",
};
const statusLabel: Record<Agent["status"], string> = {
  active: "Active",
  paused: "Paused",
  revoked: "Revoked",
};

const ITEMS_PER_PAGE = 20;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const agent = agents.find((a) => a.id === id);

  const [killed, setKilled] = useState(false);
  const [scopes, setScopes] = useState<string[]>(agent?.scopes ?? []);
  const [newScope, setNewScope] = useState("");
  const [activityPage, setActivityPage] = useState(0);

  // Agent audit entries
  const agentEntries = useMemo(
    () => auditLog.filter((e) => e.agentId === id),
    [id]
  );

  const recentEntries = agentEntries.slice(0, 20);

  // Paginated entries for Activity tab
  const totalActivityPages = Math.max(
    1,
    Math.ceil(agentEntries.length / ITEMS_PER_PAGE)
  );
  const paginatedEntries = agentEntries.slice(
    activityPage * ITEMS_PER_PAGE,
    (activityPage + 1) * ITEMS_PER_PAGE
  );

  if (!agent) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-text-muted">
        <AlertTriangle className="h-8 w-8" />
        <p className="text-sm font-medium">Agent not found</p>
        <Link href="/dashboard/agents">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-3 w-3" /> Back to agents
          </Button>
        </Link>
      </div>
    );
  }

  const effectiveStatus = killed ? "revoked" : agent.status;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/agents"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-secondary"
      >
        <ArrowLeft className="h-3 w-3" /> Back to agents
      </Link>

      {/* Top section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${statusDot[effectiveStatus]}`}
            />
            <h1 className="text-xl font-bold text-text-primary">
              {agent.name}
            </h1>
            <span className="rounded-full bg-surface-hover px-2 py-0.5 text-xs font-medium capitalize text-text-secondary">
              {statusLabel[effectiveStatus]}
            </span>
          </div>
          <p className="mt-1 text-sm text-text-muted">{agent.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" /> {agent.owner}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Created{" "}
              {relativeTime(agent.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> Last active{" "}
              {relativeTime(agent.lastActive)}
            </span>
          </div>
        </div>

        {/* Kill switch */}
        <KillSwitchButton
          onKill={() => setKilled(true)}
          killed={killed || agent.status === "revoked"}
          disabled={agent.status === "revoked"}
        />
      </div>

      {/* Risk meter */}
      <div className="max-w-xs">
        <RiskMeter score={agent.riskScore} animated />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="scopes">Scopes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* ---------------------------------------------------------------- */}
        {/* Overview Tab                                                      */}
        {/* ---------------------------------------------------------------- */}
        <TabsContent value="overview">
          <div className="mt-4 space-y-6">
            {/* Live Demo */}
            <div className="rounded-xl border border-border-leash bg-surface p-4">
              <h3 className="mb-4 text-sm font-semibold text-text-primary">
                Live Simulation
              </h3>
              <LiveDemo />
            </div>

            {/* Scopes panel */}
            <div className="rounded-xl border border-border-leash bg-surface p-4">
              <h3 className="mb-3 text-sm font-semibold text-text-primary">
                Granted Scopes
              </h3>
              <div className="flex flex-wrap gap-2">
                {agent.scopes.length > 0 ? (
                  agent.scopes.map((s) => <ScopeBadge key={s} scope={s} />)
                ) : (
                  <span className="text-xs text-text-muted">
                    No scopes assigned
                  </span>
                )}
              </div>
            </div>

            {/* Recent actions */}
            <div className="rounded-xl border border-border-leash bg-surface">
              <div className="border-b border-border-leash px-4 py-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  Recent Actions
                </h3>
              </div>
              <div className="space-y-1 p-3">
                {recentEntries.length > 0 ? (
                  recentEntries.map((entry, i) => (
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
                  <p className="py-6 text-center text-xs text-text-muted">
                    No activity recorded
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        {/* Activity Tab                                                      */}
        {/* ---------------------------------------------------------------- */}
        <TabsContent value="activity">
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-border-leash bg-surface">
              <div className="border-b border-border-leash px-4 py-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  Full Activity Log
                </h3>
              </div>
              <div className="space-y-1 p-3">
                {paginatedEntries.length > 0 ? (
                  paginatedEntries.map((entry, i) => (
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
                  <p className="py-6 text-center text-xs text-text-muted">
                    No activity recorded
                  </p>
                )}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">
                Page {activityPage + 1} of {totalActivityPages} (
                {agentEntries.length} entries)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activityPage === 0}
                  onClick={() => setActivityPage((p) => p - 1)}
                  className="gap-1"
                >
                  <ChevronLeft className="h-3 w-3" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activityPage >= totalActivityPages - 1}
                  onClick={() => setActivityPage((p) => p + 1)}
                  className="gap-1"
                >
                  Next <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        {/* Scopes Tab                                                        */}
        {/* ---------------------------------------------------------------- */}
        <TabsContent value="scopes">
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-border-leash bg-surface p-4">
              <h3 className="mb-4 text-sm font-semibold text-text-primary">
                Manage Scopes
              </h3>

              {/* Add scope */}
              <div className="mb-4 flex items-center gap-2">
                <Input
                  placeholder="e.g. read:logs"
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                  className="max-w-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newScope.trim()) {
                      setScopes((prev) => [...prev, newScope.trim()]);
                      setNewScope("");
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    if (newScope.trim()) {
                      setScopes((prev) => [...prev, newScope.trim()]);
                      setNewScope("");
                    }
                  }}
                >
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>

              {/* Scope list */}
              <div className="space-y-2">
                {scopes.length > 0 ? (
                  scopes.map((s, i) => (
                    <motion.div
                      key={`${s}-${i}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between rounded-lg border border-border-leash bg-surface-hover px-3 py-2"
                    >
                      <ScopeBadge scope={s} />
                      <button
                        onClick={() =>
                          setScopes((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-xs text-text-muted">No scopes assigned</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        {/* Settings Tab                                                      */}
        {/* ---------------------------------------------------------------- */}
        <TabsContent value="settings">
          <div className="mt-4 space-y-6">
            {/* Metadata */}
            <div className="rounded-xl border border-border-leash bg-surface p-4">
              <h3 className="mb-4 text-sm font-semibold text-text-primary">
                Agent Metadata
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">
                    Agent ID
                  </label>
                  <Input value={agent.id} readOnly className="font-mono" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">
                    Name
                  </label>
                  <Input value={agent.name} readOnly />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">
                    Owner
                  </label>
                  <Input value={agent.owner} readOnly />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">
                    Created
                  </label>
                  <Input
                    value={agent.createdAt.toLocaleDateString()}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Webhooks */}
            <div className="rounded-xl border border-border-leash bg-surface p-4">
              <h3 className="mb-4 text-sm font-semibold text-text-primary">
                Webhook Configuration
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">
                    <Globe className="mr-1 inline h-3 w-3" />
                    Event webhook URL
                  </label>
                  <Input placeholder="https://your-app.com/webhooks/leash" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">
                    <Globe className="mr-1 inline h-3 w-3" />
                    Alert webhook URL
                  </label>
                  <Input placeholder="https://your-app.com/webhooks/alerts" />
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-danger">
                <AlertTriangle className="h-4 w-4" /> Danger Zone
              </h3>
              <p className="mb-4 text-xs text-text-muted">
                Revoking an agent permanently invalidates its credentials. This
                action cannot be undone.
              </p>
              <KillSwitchButton
                onKill={() => setKilled(true)}
                killed={killed || agent.status === "revoked"}
                disabled={agent.status === "revoked"}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
