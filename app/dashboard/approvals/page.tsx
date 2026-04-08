"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Bot,
} from "lucide-react";
import { approvals, type ApprovalRequest } from "@/lib/fake-data";
import { relativeTime } from "@/lib/utils";
import { ScopeBadge } from "@/components/dashboard/scope-badge";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ApprovalsPage() {
  const [pending, setPending] = useState<ApprovalRequest[]>(
    approvals.filter((a) => a.status === "pending")
  );
  const [history, setHistory] = useState<ApprovalRequest[]>([]);

  function handleDecision(
    id: string,
    decision: "approved" | "denied"
  ) {
    const item = pending.find((p) => p.id === id);
    if (!item) return;

    const resolved: ApprovalRequest = {
      ...item,
      status: decision,
      decidedAt: new Date(),
      decidedBy: "you@example.com",
    };

    setPending((prev) => prev.filter((p) => p.id !== id));
    setHistory((prev) => [resolved, ...prev]);
  }

  const pendingCount = pending.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold text-text-primary">Approvals</h1>
        {pendingCount > 0 && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-5 min-w-5 items-center justify-center rounded-full bg-warning/20 px-1.5 text-xs font-bold text-warning"
          >
            {pendingCount}
          </motion.span>
        )}
      </div>

      {/* Pending section */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text-primary">
          Pending
        </h2>
        <AnimatePresence mode="popLayout">
          {pending.length > 0 ? (
            <div className="space-y-3">
              {pending.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-xl border border-warning/30 bg-warning/5 p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-warning" />
                        <span className="text-sm font-semibold text-text-primary">
                          {item.agentName}
                        </span>
                        <ScopeBadge scope={item.action} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-text-secondary">
                          <span className="font-medium">Target:</span>{" "}
                          <span className="font-mono">{item.target}</span>
                        </p>
                        <p className="text-xs text-text-muted">
                          {item.details}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <Clock className="h-3 w-3" />
                        Requested {relativeTime(item.requestedAt)}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button
                        onClick={() => handleDecision(item.id, "approved")}
                        className="gap-1.5 bg-success text-white hover:bg-success/90"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleDecision(item.id, "denied")}
                        className="gap-1.5 bg-danger text-white hover:bg-danger/90"
                      >
                        <XCircle className="h-4 w-4" />
                        Deny
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-border-leash bg-surface py-12 text-center"
            >
              <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-success/60" />
              <p className="text-sm text-text-muted">
                All caught up! No pending approvals.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History section */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text-primary">
          History
        </h2>
        <AnimatePresence mode="popLayout">
          {history.length > 0 ? (
            <div className="space-y-2">
              {history.map((item) => {
                const isApproved = item.status === "approved";
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-xl border border-border-leash bg-surface p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bot className="h-4 w-4 text-text-muted" />
                        <span className="text-sm font-medium text-text-primary">
                          {item.agentName}
                        </span>
                        <span className="font-mono text-xs text-text-secondary">
                          {item.action}
                        </span>
                        <span className="font-mono text-xs text-text-muted">
                          {item.target}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            isApproved
                              ? "bg-success/10 text-success"
                              : "bg-danger/10 text-danger"
                          }`}
                        >
                          {isApproved ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {isApproved ? "Approved" : "Denied"}
                        </span>
                        {item.decidedAt && (
                          <span className="text-xs text-text-muted">
                            {relativeTime(item.decidedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-border-leash bg-surface py-8 text-center">
              <p className="text-xs text-text-muted">
                Resolved approvals will appear here
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
