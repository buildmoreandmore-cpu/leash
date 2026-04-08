"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useInView,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const customEase = [0.16, 1, 0.3, 1] as const;

/* -------------------------------------------------------------------------
   Scenario data
   ------------------------------------------------------------------------- */

type LogEntry = {
  text: string;
  status: "allowed" | "warning" | "denied" | "info" | "killed";
};

type ScopeCheck = {
  label: string;
  status: "pass" | "warn" | "fail";
};

type Scenario = {
  id: string;
  title: string;
  color: "green" | "amber" | "red";
  /** Status shown on right panel at each step index */
  statusSteps: {
    label: string;
    color: "green" | "amber" | "red";
  }[];
  /** Risk value at each step index */
  riskSteps: number[];
  logs: LogEntry[];
  scopeChecks: ScopeCheck[];
};

const scenarios: Scenario[] = [
  {
    id: "clean",
    title: "Clean Run",
    color: "green",
    statusSteps: [
      { label: "Running", color: "green" },
      { label: "Running", color: "green" },
      { label: "Running", color: "green" },
      { label: "Running", color: "green" },
      { label: "Complete", color: "green" },
    ],
    riskSteps: [8, 10, 12, 12, 12],
    logs: [
      { text: "\u2192 read src/auth/login.ts", status: "allowed" },
      { text: "\u2192 read src/auth/session.ts", status: "allowed" },
      { text: "\u2192 write src/auth/login.ts", status: "allowed" },
      { text: "\u2192 run npm test auth", status: "allowed" },
      {
        text: "\u2713 Task complete \u2014 3 files changed, 12 tests passing",
        status: "info",
      },
    ],
    scopeChecks: [
      { label: "read:src \u2014 granted", status: "pass" },
      { label: "read:src \u2014 granted", status: "pass" },
      { label: "write:src \u2014 granted", status: "pass" },
      { label: "exec:test \u2014 granted", status: "pass" },
      { label: "all scopes verified", status: "pass" },
    ],
  },
  {
    id: "approval",
    title: "Approval Flow",
    color: "amber",
    statusSteps: [
      { label: "Running", color: "green" },
      { label: "Approval Required", color: "amber" },
      { label: "Approval Required", color: "amber" },
      { label: "Approved", color: "green" },
      { label: "Running", color: "green" },
    ],
    riskSteps: [14, 52, 52, 38, 22],
    logs: [
      { text: "\u2192 read package.json", status: "allowed" },
      {
        text: "\u2192 write package.json (+stripe@14.0.0)",
        status: "warning",
      },
      { text: "\u23f3 Waiting for human approval\u2026", status: "info" },
      {
        text: "\u2713 Approved by francis@example.com",
        status: "allowed",
      },
      { text: "\u2192 write package.json", status: "allowed" },
    ],
    scopeChecks: [
      { label: "read:config \u2014 granted", status: "pass" },
      { label: "write:deps \u2014 not in scope", status: "warn" },
      { label: "awaiting human review", status: "warn" },
      { label: "write:deps \u2014 approved", status: "pass" },
      { label: "write:config \u2014 granted", status: "pass" },
    ],
  },
  {
    id: "kill",
    title: "Kill Switch",
    color: "red",
    statusSteps: [
      { label: "Running", color: "green" },
      { label: "DENIED", color: "red" },
      { label: "Anomaly Detected", color: "red" },
      { label: "KILLED", color: "red" },
    ],
    riskSteps: [18, 74, 88, 92],
    logs: [
      { text: "\u2192 read src/users/models.ts", status: "allowed" },
      { text: "\u2192 read .env.production", status: "denied" },
      {
        text: "\u26a0 Anomaly: bulk secret read pattern",
        status: "warning",
      },
      {
        text: "\ud83d\uded1 AGENT KILLED \u2014 session revoked",
        status: "killed",
      },
    ],
    scopeChecks: [
      { label: "read:src \u2014 granted", status: "pass" },
      { label: "read:secrets \u2014 NOT GRANTED", status: "fail" },
      { label: "anomaly score: critical", status: "fail" },
      { label: "session terminated", status: "fail" },
    ],
  },
];

/* -------------------------------------------------------------------------
   Status badge colors
   ------------------------------------------------------------------------- */

function statusDotColor(color: "green" | "amber" | "red") {
  if (color === "green") return "bg-success";
  if (color === "amber") return "bg-warning";
  return "bg-danger";
}

function statusTextColor(color: "green" | "amber" | "red") {
  if (color === "green") return "text-success";
  if (color === "amber") return "text-warning";
  return "text-danger";
}

function logStatusSuffix(status: LogEntry["status"]) {
  switch (status) {
    case "allowed":
      return (
        <span className="ml-2 text-success">\u2713 allowed</span>
      );
    case "warning":
      return (
        <span className="ml-2 text-warning">\u26a0 requires approval</span>
      );
    case "denied":
      return (
        <span className="ml-2 text-danger">\u2717 DENIED</span>
      );
    case "killed":
      return null;
    case "info":
      return null;
  }
}

function scopeColor(status: ScopeCheck["status"]) {
  if (status === "pass") return "text-success";
  if (status === "warn") return "text-warning";
  return "text-danger";
}

function scopeIcon(status: ScopeCheck["status"]) {
  if (status === "pass") return "\u2713";
  if (status === "warn") return "\u26a0";
  return "\u2717";
}

/* -------------------------------------------------------------------------
   Scenario label pills
   ------------------------------------------------------------------------- */

function ScenarioIndicator({
  scenarios: items,
  activeIndex,
}: {
  scenarios: Scenario[];
  activeIndex: number;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      {items.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              i === activeIndex
                ? s.color === "green"
                  ? "bg-success"
                  : s.color === "amber"
                    ? "bg-warning"
                    : "bg-danger"
                : "bg-text-muted/30"
            }`}
          />
          <span
            className={`font-mono text-xs transition-colors duration-300 ${
              i === activeIndex ? "text-text-secondary" : "text-text-muted/50"
            }`}
          >
            {s.title}
          </span>
          {i < items.length - 1 && (
            <span className="text-text-muted/20 mx-1">/</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Risk meter
   ------------------------------------------------------------------------- */

function RiskMeter({ value }: { value: number }) {
  const springValue = useSpring(value, { stiffness: 100, damping: 15 });
  const width = useTransform(springValue, [0, 100], ["0%", "100%"]);

  const barColor =
    value < 30
      ? "bg-success"
      : value < 60
        ? "bg-warning"
        : "bg-danger";

  const glowColor =
    value < 30
      ? "shadow-[0_0_8px_#10b98144]"
      : value < 60
        ? "shadow-[0_0_8px_#f59e0b44]"
        : "shadow-[0_0_12px_#ef444466]";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Risk Score
        </span>
        <motion.span
          className={`font-mono text-sm font-bold ${
            value < 30
              ? "text-success"
              : value < 60
                ? "text-warning"
                : "text-danger"
          }`}
        >
          {value}
        </motion.span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-hover">
        <motion.div
          className={`h-full rounded-full ${barColor} ${glowColor}`}
          style={{ width }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Main component
   ------------------------------------------------------------------------- */

export function InlineDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-100px" });

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isKillFlash, setIsKillFlash] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const scenario = scenarios[scenarioIdx];
  const totalSteps = scenario.logs.length;

  // Left border pulse color
  const borderPulseColor =
    scenario.id === "kill" && stepIdx >= totalSteps - 1
      ? "border-l-danger"
      : stepIdx >= 0 && stepIdx < totalSteps
        ? "border-l-primary"
        : "border-l-border-leash";

  // Advance step within a scenario
  const advanceStep = useCallback(() => {
    setStepIdx((prev) => prev + 1);
  }, []);

  // Move to next scenario
  const nextScenario = useCallback(() => {
    setStepIdx(-1);
    setScenarioIdx((prev) => (prev + 1) % scenarios.length);
  }, []);

  // Start animation when in view
  useEffect(() => {
    if (inView && !hasStarted) {
      setHasStarted(true);
      setStepIdx(-1);
      setScenarioIdx(0);
    }
  }, [inView, hasStarted]);

  // Step timer: advance entries one by one, then pause before switching scenario
  useEffect(() => {
    if (!hasStarted) return;

    // Small initial delay before first entry
    if (stepIdx === -1) {
      const t = setTimeout(() => advanceStep(), 600);
      return () => clearTimeout(t);
    }

    if (stepIdx < totalSteps - 1) {
      // Continue showing entries
      const t = setTimeout(() => advanceStep(), 800);
      return () => clearTimeout(t);
    }

    if (stepIdx === totalSteps - 1) {
      // Kill flash effect
      if (scenario.id === "kill") {
        setIsKillFlash(true);
        const flashTimer = setTimeout(() => setIsKillFlash(false), 400);
        // After showing last entry, wait then transition
        const t = setTimeout(() => {
          nextScenario();
        }, 2800);
        return () => {
          clearTimeout(t);
          clearTimeout(flashTimer);
        };
      }
      // Non-kill: linger on final state
      const t = setTimeout(() => {
        nextScenario();
      }, 2400);
      return () => clearTimeout(t);
    }
  }, [stepIdx, hasStarted, totalSteps, scenario.id, advanceStep, nextScenario]);

  // Current governance state
  const currentStatusStep =
    stepIdx >= 0 && stepIdx < scenario.statusSteps.length
      ? scenario.statusSteps[stepIdx]
      : scenario.statusSteps[0];
  const currentRisk =
    stepIdx >= 0 && stepIdx < scenario.riskSteps.length
      ? scenario.riskSteps[stepIdx]
      : scenario.riskSteps[0];
  const visibleLogs = scenario.logs.slice(0, Math.max(0, stepIdx + 1));
  const visibleScopes = scenario.scopeChecks.slice(
    0,
    Math.max(0, stepIdx + 1)
  );

  return (
    <section ref={sectionRef} id="demo" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: customEase }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            See it in action
          </h2>
          <p className="mx-auto max-w-2xl text-base text-text-tertiary md:text-lg">
            Watch Leash govern an agent through three real scenarios &mdash; a
            clean run, an approval gate, and a kill switch.
          </p>
        </motion.div>

        {/* Demo container */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: customEase, delay: 0.15 }}
          className={`relative mx-auto max-w-4xl overflow-hidden rounded-xl border bg-surface transition-colors duration-300 ${
            isKillFlash
              ? "border-danger shadow-[0_0_24px_#ef444455]"
              : "border-border-leash"
          }`}
        >
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-border-leash bg-[#0b1a2e] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-text-muted">
                leash dashboard &mdash; refactor-bot
              </span>
            </div>
            <ScenarioIndicator
              scenarios={scenarios}
              activeIndex={scenarioIdx}
            />
          </div>

          {/* Two columns */}
          <div className="flex min-h-[320px] flex-col md:flex-row">
            {/* Left: Agent Activity (60%) */}
            <div
              className={`relative flex-[3] border-l-2 transition-colors duration-500 ${borderPulseColor}`}
            >
              {/* Animated left border glow */}
              {stepIdx >= 0 && stepIdx < totalSteps && (
                <motion.div
                  className="pointer-events-none absolute inset-y-0 left-0 w-[2px]"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    background:
                      scenario.id === "kill" && stepIdx >= totalSteps - 1
                        ? "#ef4444"
                        : "#3b82f6",
                    boxShadow:
                      scenario.id === "kill" && stepIdx >= totalSteps - 1
                        ? "0 0 8px #ef444488"
                        : "0 0 8px #3b82f688",
                  }}
                />
              )}

              <div className="px-4 py-3">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                    Agent Activity
                  </span>
                </div>

                {/* Log entries */}
                <div className="space-y-0.5 font-mono text-[13px] leading-relaxed">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={scenario.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {visibleLogs.map((entry, i) => (
                        <motion.div
                          key={`${scenario.id}-${i}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: customEase,
                          }}
                          className={`flex items-start py-1 ${
                            entry.status === "killed"
                              ? "text-danger font-bold"
                              : entry.status === "denied"
                                ? "text-danger"
                                : entry.status === "warning"
                                  ? "text-warning"
                                  : entry.status === "info"
                                    ? "text-text-tertiary"
                                    : "text-text-secondary"
                          }`}
                        >
                          <span className="mr-2 select-none text-text-muted/40">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1">
                            {entry.text}
                            {logStatusSuffix(entry.status)}
                          </span>
                        </motion.div>
                      ))}

                      {/* Blinking cursor at end */}
                      {stepIdx < totalSteps - 1 && stepIdx >= 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center py-1"
                        >
                          <span className="mr-2 select-none text-text-muted/40">
                            {String(visibleLogs.length + 1).padStart(2, "0")}
                          </span>
                          <motion.span
                            className="inline-block h-4 w-[7px] bg-primary/70"
                            animate={{ opacity: [1, 1, 0, 0] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              times: [0, 0.49, 0.5, 1],
                              ease: "linear",
                            }}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden w-px bg-border-leash md:block" />

            {/* Right: Governance (40%) */}
            <div className="flex-[2] border-t border-border-leash bg-[#0b1a2e]/50 md:border-t-0">
              <div className="px-4 py-3">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-info" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                    Governance
                  </span>
                </div>

                {/* Status */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${scenario.id}-status-${stepIdx}`}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="mb-5"
                  >
                    <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-muted">
                      Status
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        className={`h-2.5 w-2.5 rounded-full ${statusDotColor(currentStatusStep.color)}`}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                          duration:
                            currentStatusStep.color === "red" ? 0.6 : 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <span
                        className={`font-mono text-sm font-semibold ${statusTextColor(currentStatusStep.color)}`}
                      >
                        {currentStatusStep.label}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Risk meter */}
                <div className="mb-5">
                  <RiskMeter value={currentRisk} />
                </div>

                {/* Scope checks */}
                <div>
                  <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-text-muted">
                    Scope Checks
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={scenario.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-1"
                    >
                      {visibleScopes.map((scope, i) => (
                        <motion.div
                          key={`${scenario.id}-scope-${i}`}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.1,
                            ease: customEase,
                          }}
                          className={`flex items-center gap-2 font-mono text-xs ${scopeColor(scope.status)}`}
                        >
                          <span className="w-3 text-center">
                            {scopeIcon(scope.status)}
                          </span>
                          <span>{scope.label}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="flex items-center justify-between border-t border-border-leash bg-[#0b1a2e] px-4 py-2">
            <span className="font-mono text-[11px] text-text-muted">
              agent:refactor-bot &bull; session:a3f8c2
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-text-muted">
                {scenario.id === "clean"
                  ? "scenario 1/3"
                  : scenario.id === "approval"
                    ? "scenario 2/3"
                    : "scenario 3/3"}
              </span>
              <motion.div
                className="h-1 w-1 rounded-full bg-success"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
