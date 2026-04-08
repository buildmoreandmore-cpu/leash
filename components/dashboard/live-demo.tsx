"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Package,
  AlertTriangle,
  RotateCcw,
  Eye,
  Pencil,
  Play,
  Phone,
  CheckCircle2,
  Skull,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiskMeter } from "./risk-meter";
import { ApprovalModal } from "./approval-modal";
import { ScopeBadge } from "./scope-badge";
import { demoTasks, type DemoStep } from "@/lib/demo-engine";
import type { ActionDecision } from "@/lib/fake-data";

// ---------------------------------------------------------------------------
// Types for the live activity stream
// ---------------------------------------------------------------------------
interface StreamEntry {
  id: string;
  timestamp: string;
  action: DemoStep["action"];
  target: string;
  scope: string;
  decision: ActionDecision;
  riskDelta: number;
  message?: string;
  isAnomaly?: boolean;
  autoKill?: boolean;
}

type TaskKey = "task1" | "task2" | "task3";

// ---------------------------------------------------------------------------
// Icon map
// ---------------------------------------------------------------------------
const actionIcons: Record<string, React.ReactNode> = {
  read: <Eye className="h-3.5 w-3.5" />,
  write: <Pencil className="h-3.5 w-3.5" />,
  run: <Play className="h-3.5 w-3.5" />,
  call: <Phone className="h-3.5 w-3.5" />,
  done: <CheckCircle2 className="h-3.5 w-3.5" />,
};

const decisionColors: Record<ActionDecision, string> = {
  allow: "bg-emerald-50 text-emerald-700",
  warn: "bg-amber-50 text-amber-700",
  deny: "bg-red-50 text-red-700",
  killed: "bg-red-100 text-red-700",
};

// ---------------------------------------------------------------------------
// Task buttons config
// ---------------------------------------------------------------------------
const taskButtons: {
  key: TaskKey;
  title: string;
  icon: React.ReactNode;
  bgClass: string;
}[] = [
  {
    key: "task1",
    title: "Refactor auth module",
    icon: <Shield className="h-4 w-4" />,
    bgClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
  {
    key: "task2",
    title: "Add npm dependency",
    icon: <Package className="h-4 w-4" />,
    bgClass:
      "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
  },
  {
    key: "task3",
    title: "Read production secrets",
    icon: <AlertTriangle className="h-4 w-4" />,
    bgClass: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function LiveDemo() {
  const [currentTask, setCurrentTask] = useState<TaskKey | null>(null);
  const [stream, setStream] = useState<StreamEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [riskScore, setRiskScore] = useState(12);
  const [agentKilled, setAgentKilled] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<
    null | "approved" | "denied"
  >(null);
  const [flashRed, setFlashRed] = useState(false);
  const [activeBorder, setActiveBorder] = useState(false);

  const streamRef = useRef<HTMLDivElement>(null);
  const stepIdCounter = useRef(0);
  // Ref to hold the resolve function for the approval promise
  const approvalResolveRef = useRef<
    ((value: "approved" | "denied") => void) | null
  >(null);

  // Auto-scroll stream
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [stream]);

  // Flash the active border on new entries
  useEffect(() => {
    if (stream.length > 0) {
      setActiveBorder(true);
      const t = setTimeout(() => setActiveBorder(false), 600);
      return () => clearTimeout(t);
    }
  }, [stream.length]);

  const addEntry = useCallback(
    (step: DemoStep): StreamEntry => {
      const entry: StreamEntry = {
        id: `demo_${++stepIdCounter.current}`,
        timestamp: "just now",
        action: step.action,
        target: step.target,
        scope: step.scope,
        decision: step.decision,
        riskDelta: step.riskDelta,
        message: step.message,
        isAnomaly: step.isAnomaly,
        autoKill: step.autoKill,
      };
      setStream((prev) => [...prev, entry]);
      setRiskScore((prev) =>
        Math.max(0, Math.min(100, prev + step.riskDelta))
      );
      return entry;
    },
    []
  );

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  const runTask = useCallback(
    async (taskKey: TaskKey) => {
      const task = demoTasks[taskKey];
      setCurrentTask(taskKey);
      setIsRunning(true);

      for (const step of task.steps) {
        // If this step needs approval, pause and wait
        if (step.needsApproval) {
          addEntry(step);
          await sleep(400);

          // Show approval modal and wait for decision
          const decision = await new Promise<"approved" | "denied">(
            (resolve) => {
              approvalResolveRef.current = resolve;
              setShowApproval(true);
            }
          );

          setApprovalDecision(decision);
          setShowApproval(false);

          // Add the result entry
          if (decision === "approved") {
            addEntry({
              action: "done",
              target: step.target,
              scope: step.scope,
              riskDelta: 0,
              decision: "allow",
              message: "Human approved -- executed",
            });
          } else {
            addEntry({
              action: "done",
              target: step.target,
              scope: step.scope,
              riskDelta: -20,
              decision: "warn",
              message: "Human denied -- rolled back",
            });
          }

          await sleep(600);
          continue;
        }

        // Normal step: add with typewriter delay
        addEntry(step);

        // If this is a kill step, trigger the kill sequence
        if (step.autoKill) {
          await sleep(300);
          setFlashRed(true);
          setTimeout(() => setFlashRed(false), 800);
          setAgentKilled(true);
          setIsRunning(false);
          return;
        }

        // Typewriter delay between steps
        await sleep(600 + Math.random() * 200);
      }

      setIsRunning(false);
    },
    [addEntry]
  );

  function handleApprove() {
    if (approvalResolveRef.current) {
      approvalResolveRef.current("approved");
      approvalResolveRef.current = null;
    }
  }

  function handleDeny() {
    if (approvalResolveRef.current) {
      approvalResolveRef.current("denied");
      approvalResolveRef.current = null;
    }
  }

  function handleReset() {
    setCurrentTask(null);
    setStream([]);
    setIsRunning(false);
    setRiskScore(12);
    setAgentKilled(false);
    setShowApproval(false);
    setApprovalDecision(null);
    setFlashRed(false);
    stepIdCounter.current = 0;
    approvalResolveRef.current = null;
  }

  const tasksDisabled = isRunning || agentKilled;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">
          Run a demo task
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="gap-1.5 text-xs text-text-muted hover:text-text-secondary"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      {/* Task buttons */}
      <div className="grid grid-cols-3 gap-3">
        {taskButtons.map((tb) => (
          <button
            key={tb.key}
            disabled={tasksDisabled}
            onClick={() => runTask(tb.key)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${tb.bgClass}`}
          >
            {tb.icon}
            <span className="truncate">{tb.title}</span>
          </button>
        ))}
      </div>

      {/* Live activity stream */}
      <motion.div
        className={`relative overflow-hidden rounded-xl border bg-white ${
          flashRed
            ? "border-danger shadow-[0_0_24px_rgba(239,68,68,0.3)]"
            : activeBorder
              ? "border-primary/60"
              : "border-border-leash"
        }`}
        animate={
          flashRed
            ? {
                borderColor: [
                  "rgba(239,68,68,1)",
                  "rgba(239,68,68,0.4)",
                  "rgba(239,68,68,1)",
                ],
              }
            : {}
        }
        transition={flashRed ? { duration: 0.4, repeat: 1 } : {}}
      >
        {/* Left active border indicator */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
          animate={{
            backgroundColor: activeBorder
              ? "rgba(59, 130, 246, 1)"
              : "rgba(59, 130, 246, 0.1)",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Header */}
        <div className="flex items-center gap-2 border-b border-border-leash px-4 py-2.5">
          <span className="relative flex h-2 w-2">
            {isRunning && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${isRunning ? "bg-primary" : "bg-text-muted/40"}`}
            />
          </span>
          <span className="text-xs font-medium text-text-secondary">
            Live Activity
          </span>
          {agentKilled && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-auto flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700"
            >
              <Skull className="h-3 w-3" />
              AGENT KILLED
            </motion.span>
          )}
        </div>

        {/* Stream */}
        <div
          ref={streamRef}
          className="max-h-72 min-h-[160px] overflow-y-auto px-4 py-3"
        >
          {stream.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-xs text-text-muted">
              Select a task above to begin the simulation
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {stream.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`flex items-start gap-3 rounded-lg px-3 py-2 text-xs ${
                      entry.isAnomaly
                        ? "border border-red-200 bg-red-50"
                        : "bg-slate-50/50"
                    }`}
                  >
                    {/* Timestamp */}
                    <span className="w-12 shrink-0 text-text-muted tabular-nums">
                      {entry.timestamp}
                    </span>

                    {/* Action icon + verb */}
                    <span className="flex w-14 shrink-0 items-center gap-1 text-text-secondary">
                      {actionIcons[entry.action]}
                      {entry.action}
                    </span>

                    {/* Target */}
                    <span className="min-w-0 flex-1 truncate font-mono text-text-primary">
                      {entry.target}
                    </span>

                    {/* Scope */}
                    {entry.scope && (
                      <div className="hidden shrink-0 sm:block">
                        <ScopeBadge scope={entry.scope} />
                      </div>
                    )}

                    {/* Decision */}
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${decisionColors[entry.decision]} ${entry.decision === "killed" ? "animate-pulse" : ""}`}
                    >
                      {entry.decision}
                    </span>

                    {/* Risk delta */}
                    <span
                      className={`w-8 shrink-0 text-right font-mono tabular-nums ${
                        entry.riskDelta > 0
                          ? "text-danger"
                          : entry.riskDelta < 0
                            ? "text-success"
                            : "text-text-muted"
                      }`}
                    >
                      {entry.riskDelta > 0
                        ? `+${entry.riskDelta}`
                        : entry.riskDelta === 0
                          ? ""
                          : entry.riskDelta}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Message line for the last entry with a message */}
              {stream.length > 0 && stream[stream.length - 1].message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className={`ml-[4.5rem] rounded px-2 py-1 text-xs italic ${
                    stream[stream.length - 1].isAnomaly
                      ? "text-danger"
                      : stream[stream.length - 1].decision === "warn"
                        ? "text-warning"
                        : "text-success"
                  }`}
                >
                  {stream[stream.length - 1].message}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Risk meter */}
      <RiskMeter score={riskScore} animated />

      {/* Approval modal for task 2 */}
      <ApprovalModal
        open={showApproval}
        onApprove={handleApprove}
        onDeny={handleDeny}
        onClose={handleDeny}
        agentName="refactor-bot"
        action="write"
        target="package.json (+stripe@14.0.0)"
        scope="write:deps"
      />
    </div>
  );
}
