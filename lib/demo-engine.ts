// ---------------------------------------------------------------------------
// Leash — demo simulation engine
// ---------------------------------------------------------------------------

export interface DemoStep {
  action: "read" | "write" | "run" | "done"
  target: string
  scope: string
  riskDelta: number
  decision: "allow" | "warn" | "deny" | "killed"
  needsApproval?: boolean
  isAnomaly?: boolean
  autoKill?: boolean
  message?: string
}

export interface DemoTaskMeta {
  id: string
  title: string
  description: string
  riskLevel: "low" | "medium" | "critical"
  steps: DemoStep[]
}

// ---------------------------------------------------------------------------
// Task 1: Refactor auth module (clean run)
// ---------------------------------------------------------------------------
const task1Steps: DemoStep[] = [
  {
    action: "read",
    target: "src/auth/login.ts",
    scope: "read:src",
    riskDelta: 0,
    decision: "allow",
  },
  {
    action: "read",
    target: "src/auth/session.ts",
    scope: "read:src",
    riskDelta: 0,
    decision: "allow",
  },
  {
    action: "write",
    target: "src/auth/login.ts",
    scope: "write:src",
    riskDelta: 5,
    decision: "allow",
  },
  {
    action: "run",
    target: "npm test auth",
    scope: "run:tests",
    riskDelta: 0,
    decision: "allow",
  },
  {
    action: "done",
    target: "",
    scope: "",
    riskDelta: -5,
    decision: "allow",
    message: "3 files changed, 12 tests passing",
  },
]

// ---------------------------------------------------------------------------
// Task 2: Add npm dependency (triggers approval)
// ---------------------------------------------------------------------------
const task2Steps: DemoStep[] = [
  {
    action: "read",
    target: "package.json",
    scope: "read:src",
    riskDelta: 0,
    decision: "allow",
  },
  {
    action: "write",
    target: "package.json (+stripe@14.0.0)",
    scope: "write:deps",
    riskDelta: 40,
    decision: "warn",
    needsApproval: true,
    message: "Scope write:deps requires human approval",
  },
]

// ---------------------------------------------------------------------------
// Task 3: Read production secrets (kill switch)
// ---------------------------------------------------------------------------
const task3Steps: DemoStep[] = [
  {
    action: "read",
    target: "src/users/models.ts",
    scope: "read:src",
    riskDelta: 5,
    decision: "allow",
  },
  {
    action: "read",
    target: ".env.production",
    scope: "read:secrets",
    riskDelta: 80,
    decision: "deny",
    isAnomaly: true,
    autoKill: true,
    message:
      "Scope read:secrets not granted \u2014 bulk secret read pattern detected \u2014 agent session revoked",
  },
]

// ---------------------------------------------------------------------------
// Exported task collection
// ---------------------------------------------------------------------------
export const demoTasks = {
  task1: {
    id: "demo_task_1",
    title: "Refactor auth module",
    description:
      "Agent reads auth source files, applies refactoring changes, and runs the test suite. A clean, low-risk workflow.",
    riskLevel: "low" as const,
    steps: task1Steps,
  } satisfies DemoTaskMeta,

  task2: {
    id: "demo_task_2",
    title: "Add npm dependency",
    description:
      "Agent attempts to add a new npm package (stripe@14.0.0). The write:deps scope triggers a human-in-the-loop approval gate.",
    riskLevel: "medium" as const,
    steps: task2Steps,
  } satisfies DemoTaskMeta,

  task3: {
    id: "demo_task_3",
    title: "Read production secrets",
    description:
      "Agent reads application code, then attempts to access .env.production. The anomaly detector flags bulk secret access and the kill switch fires.",
    riskLevel: "critical" as const,
    steps: task3Steps,
  } satisfies DemoTaskMeta,
}
