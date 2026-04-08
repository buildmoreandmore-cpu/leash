"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, Zap, ShieldCheck, AlertTriangle } from "lucide-react";
import { agents, auditLog, type AuditEntry } from "@/lib/fake-data";
import { formatNumber } from "@/lib/utils";
import { AgentCard } from "@/components/dashboard/agent-card";
import { AuditRow } from "@/components/dashboard/audit-row";

// ---------------------------------------------------------------------------
// Pool of realistic fake entries for the live feed
// ---------------------------------------------------------------------------
const fakeEntryPool: Omit<AuditEntry, "id" | "timestamp">[] = [
  {
    agentId: "agt_001",
    agentName: "refactor-bot",
    action: "read",
    target: "src/services/payment.ts",
    scope: "read:src",
    decision: "allow",
    riskDelta: 0,
    ipAddress: "10.0.12.4",
    userAgent: "leash-sdk/1.2.0 (linux; amd64)",
  },
  {
    agentId: "agt_003",
    agentName: "data-pipeline-agent",
    action: "write",
    target: "metrics/cpu_usage_pct",
    scope: "write:metrics",
    decision: "allow",
    riskDelta: 0,
    ipAddress: "10.0.14.22",
    userAgent: "leash-sdk/1.2.0 (linux; amd64)",
  },
  {
    agentId: "agt_002",
    agentName: "customer-support-ai",
    action: "read",
    target: "tickets/4422",
    scope: "read:tickets",
    decision: "allow",
    riskDelta: 0,
    ipAddress: "10.0.12.5",
    userAgent: "leash-sdk/1.2.0 (darwin; arm64)",
  },
  {
    agentId: "agt_005",
    agentName: "research-assistant",
    action: "call",
    target: "web/search?q=redis+caching+strategies",
    scope: "call:web",
    decision: "allow",
    riskDelta: 1,
    ipAddress: "192.168.1.100",
    userAgent: "node-fetch/3.3.2",
  },
  {
    agentId: "agt_001",
    agentName: "refactor-bot",
    action: "write",
    target: "src/services/payment.ts",
    scope: "write:src",
    decision: "allow",
    riskDelta: 4,
    ipAddress: "10.0.12.4",
    userAgent: "leash-sdk/1.2.0 (linux; amd64)",
  },
  {
    agentId: "agt_003",
    agentName: "data-pipeline-agent",
    action: "read",
    target: "logs/app/request.log",
    scope: "read:logs",
    decision: "allow",
    riskDelta: 0,
    ipAddress: "10.0.14.22",
    userAgent: "leash-sdk/1.2.0 (linux; amd64)",
  },
  {
    agentId: "agt_001",
    agentName: "refactor-bot",
    action: "run",
    target: "npm test services",
    scope: "run:tests",
    decision: "allow",
    riskDelta: -2,
    ipAddress: "10.0.12.4",
    userAgent: "leash-sdk/1.2.0 (linux; amd64)",
  },
  {
    agentId: "agt_002",
    agentName: "customer-support-ai",
    action: "write",
    target: "replies/4422",
    scope: "write:replies",
    decision: "allow",
    riskDelta: 2,
    ipAddress: "10.0.12.5",
    userAgent: "leash-sdk/1.2.0 (darwin; arm64)",
  },
];

// ---------------------------------------------------------------------------
// Metric cards data
// ---------------------------------------------------------------------------
const metrics = [
  {
    label: "Active agents",
    value: 3,
    delta: "+2 from yesterday",
    deltaPositive: true,
    icon: Bot,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Actions today",
    value: 1247,
    delta: "+18% vs avg",
    deltaPositive: true,
    icon: Zap,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "Pending approvals",
    value: 2,
    delta: "1 urgent",
    deltaPositive: false,
    icon: ShieldCheck,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    label: "Risk events",
    value: 1,
    delta: "-3 from yesterday",
    deltaPositive: true,
    icon: AlertTriangle,
    color: "text-danger",
    bg: "bg-danger/10",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DashboardOverviewPage() {
  const [entries, setEntries] = useState<AuditEntry[]>(() =>
    auditLog.slice(0, 15)
  );
  const idCounter = useRef(1000);

  // Push a new fake entry every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const template =
        fakeEntryPool[Math.floor(Math.random() * fakeEntryPool.length)];
      const newEntry: AuditEntry = {
        ...template,
        id: `aud_live_${++idCounter.current}`,
        timestamp: new Date(),
      };
      setEntries((prev) => [newEntry, ...prev].slice(0, 30));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeAgents = agents.filter((a) => a.status === "active").slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.08,
              }}
              className="rounded-xl border border-border-leash bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">
                  {m.label}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${m.bg}`}
                >
                  <Icon className={`h-4 w-4 ${m.color}`} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums text-text-primary">
                {formatNumber(m.value)}
              </p>
              <p
                className={`mt-1 text-xs ${m.deltaPositive ? "text-success" : "text-warning"}`}
              >
                {m.delta}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Recent Activity (2/3) */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border-leash bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-border-leash px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <h2 className="text-sm font-semibold text-text-primary">
                  Recent Activity
                </h2>
              </div>
              <span className="text-xs text-text-muted">Live</span>
            </div>
            <div className="max-h-[520px] space-y-1 overflow-y-auto p-3">
              {entries.map((entry, i) => (
                <AuditRow
                  key={entry.id}
                  timestamp={entry.timestamp}
                  agentName={entry.agentName}
                  action={entry.action}
                  target={entry.target}
                  scope={entry.scope}
                  decision={entry.decision}
                  riskDelta={entry.riskDelta}
                  animate={i < 3}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Agents mini-panel (1/3) */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border-leash bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-text-primary">
              Agents
            </h2>
            <div className="space-y-3">
              {activeAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  id={agent.id}
                  name={agent.name}
                  status={agent.status}
                  lastActive={agent.lastActive}
                  riskScore={agent.riskScore}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
