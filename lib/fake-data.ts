// ---------------------------------------------------------------------------
// Leash — seeded demo data
// ---------------------------------------------------------------------------

export type AgentStatus = "active" | "paused" | "revoked"
export type ActionDecision = "allow" | "warn" | "deny" | "killed"

export interface Agent {
  id: string
  name: string
  owner: string
  scopes: string[]
  riskScore: number
  status: AgentStatus
  actionsToday: number
  lastActive: Date
  createdAt: Date
  description: string
}

export interface AuditEntry {
  id: string
  timestamp: Date
  agentId: string
  agentName: string
  action: string
  target: string
  scope: string
  decision: ActionDecision
  riskDelta: number
  ipAddress: string
  userAgent: string
}

export interface ApprovalRequest {
  id: string
  agentId: string
  agentName: string
  action: string
  target: string
  details: string
  requestedAt: Date
  status: "pending" | "approved" | "denied"
  decidedAt?: Date
  decidedBy?: string
}

export interface ApiKey {
  id: string
  name: string
  key: string
  maskedKey: string
  createdAt: Date
  lastUsed: Date
  status: "active" | "revoked"
}

// ---------------------------------------------------------------------------
// Helper — deterministic-looking dates relative to "now"
// ---------------------------------------------------------------------------
function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 60 * 60 * 1000)
}
function minutesAgo(m: number): Date {
  return new Date(Date.now() - m * 60 * 1000)
}
function daysAgo(d: number): Date {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000)
}

// ---------------------------------------------------------------------------
// Agents
// ---------------------------------------------------------------------------
export const agents: Agent[] = [
  {
    id: "agt_001",
    name: "refactor-bot",
    owner: "francis@example.com",
    scopes: ["read:src", "write:src", "run:tests"],
    riskScore: 12,
    status: "active",
    actionsToday: 847,
    lastActive: minutesAgo(1),
    createdAt: daysAgo(45),
    description: "Automated code refactoring agent for the main codebase",
  },
  {
    id: "agt_002",
    name: "customer-support-ai",
    owner: "sara@example.com",
    scopes: ["read:tickets", "write:replies"],
    riskScore: 34,
    status: "active",
    actionsToday: 312,
    lastActive: minutesAgo(4),
    createdAt: daysAgo(30),
    description: "Drafts customer support replies for review",
  },
  {
    id: "agt_003",
    name: "data-pipeline-agent",
    owner: "devops@example.com",
    scopes: ["read:logs", "write:metrics"],
    riskScore: 8,
    status: "active",
    actionsToday: 1891,
    lastActive: minutesAgo(0),
    createdAt: daysAgo(90),
    description: "Ingests log streams and writes aggregated metrics",
  },
  {
    id: "agt_004",
    name: "invoice-processor",
    owner: "finance@example.com",
    scopes: ["read:invoices", "write:drafts", "call:stripe"],
    riskScore: 67,
    status: "paused",
    actionsToday: 56,
    lastActive: hoursAgo(2),
    createdAt: daysAgo(60),
    description: "Processes incoming invoices and drafts Stripe charges",
  },
  {
    id: "agt_005",
    name: "research-assistant",
    owner: "research@example.com",
    scopes: ["read:docs", "call:web"],
    riskScore: 19,
    status: "active",
    actionsToday: 203,
    lastActive: minutesAgo(12),
    createdAt: daysAgo(15),
    description: "Searches documentation and the web for research queries",
  },
  {
    id: "agt_006",
    name: "legacy-script-bot",
    owner: "(unassigned)",
    scopes: [],
    riskScore: 91,
    status: "revoked",
    actionsToday: 0,
    lastActive: daysAgo(3),
    createdAt: daysAgo(180),
    description: "Shadow agent discovered during security audit",
  },
]

// ---------------------------------------------------------------------------
// Audit Log — 84 entries
// ---------------------------------------------------------------------------

const ips = [
  "10.0.12.4",
  "10.0.12.5",
  "10.0.14.22",
  "10.0.14.23",
  "192.168.1.100",
  "172.16.0.50",
  "10.0.8.91",
  "10.0.8.92",
]

const userAgents = [
  "leash-sdk/1.2.0 (linux; amd64)",
  "leash-sdk/1.2.0 (darwin; arm64)",
  "leash-sdk/1.1.8 (linux; amd64)",
  "python-requests/2.31.0",
  "node-fetch/3.3.2",
  "curl/8.4.0",
]

function ip(agentIdx: number, extra: number = 0): string {
  return ips[(agentIdx + extra) % ips.length]
}
function ua(agentIdx: number): string {
  return userAgents[agentIdx % userAgents.length]
}

let entryId = 1
function entry(
  minsAgo: number,
  agentId: string,
  agentName: string,
  action: string,
  target: string,
  scope: string,
  decision: ActionDecision,
  riskDelta: number,
  agentIdx: number,
  extra: number = 0,
): AuditEntry {
  return {
    id: `aud_${String(entryId++).padStart(3, "0")}`,
    timestamp: minutesAgo(minsAgo),
    agentId,
    agentName,
    action,
    target,
    scope,
    decision,
    riskDelta,
    ipAddress: ip(agentIdx, extra),
    userAgent: ua(agentIdx),
  }
}

export const auditLog: AuditEntry[] = [
  // refactor-bot (agt_001) — heavy read/write/run cycle
  entry(1, "agt_001", "refactor-bot", "read", "src/auth/login.ts", "read:src", "allow", 0, 0),
  entry(1, "agt_001", "refactor-bot", "read", "src/auth/session.ts", "read:src", "allow", 0, 0),
  entry(2, "agt_001", "refactor-bot", "write", "src/auth/login.ts", "write:src", "allow", 5, 0),
  entry(2, "agt_001", "refactor-bot", "run", "npm test auth", "run:tests", "allow", 0, 0),
  entry(4, "agt_001", "refactor-bot", "read", "src/utils/helpers.ts", "read:src", "allow", 0, 0),
  entry(5, "agt_001", "refactor-bot", "read", "src/utils/format.ts", "read:src", "allow", 0, 0),
  entry(6, "agt_001", "refactor-bot", "write", "src/utils/helpers.ts", "write:src", "allow", 3, 0),
  entry(7, "agt_001", "refactor-bot", "run", "npm test utils", "run:tests", "allow", 0, 0),
  entry(10, "agt_001", "refactor-bot", "read", "src/middleware/cors.ts", "read:src", "allow", 0, 0),
  entry(12, "agt_001", "refactor-bot", "write", "src/middleware/cors.ts", "write:src", "allow", 4, 0),
  entry(14, "agt_001", "refactor-bot", "run", "npm test middleware", "run:tests", "allow", 0, 0),
  entry(18, "agt_001", "refactor-bot", "read", "src/controllers/user.ts", "read:src", "allow", 0, 0),
  entry(20, "agt_001", "refactor-bot", "read", "src/controllers/billing.ts", "read:src", "allow", 0, 0),
  entry(22, "agt_001", "refactor-bot", "write", "src/controllers/user.ts", "write:src", "allow", 2, 0),
  entry(25, "agt_001", "refactor-bot", "run", "npm test controllers", "run:tests", "allow", 0, 0),
  entry(30, "agt_001", "refactor-bot", "read", "src/models/user.ts", "read:src", "allow", 0, 0),
  entry(35, "agt_001", "refactor-bot", "write", "src/models/user.ts", "write:src", "warn", 8, 0),
  entry(40, "agt_001", "refactor-bot", "run", "npm test models", "run:tests", "allow", -3, 0),
  entry(60, "agt_001", "refactor-bot", "read", "src/routes/index.ts", "read:src", "allow", 0, 0),
  entry(75, "agt_001", "refactor-bot", "write", "src/routes/index.ts", "write:src", "allow", 2, 0),

  // customer-support-ai (agt_002) — ticket reads + reply writes
  entry(4, "agt_002", "customer-support-ai", "read", "tickets/4421", "read:tickets", "allow", 0, 1),
  entry(5, "agt_002", "customer-support-ai", "read", "tickets/4420", "read:tickets", "allow", 0, 1),
  entry(6, "agt_002", "customer-support-ai", "write", "replies/4420", "write:replies", "allow", 2, 1),
  entry(8, "agt_002", "customer-support-ai", "read", "tickets/4419", "read:tickets", "allow", 0, 1),
  entry(10, "agt_002", "customer-support-ai", "write", "replies/4419", "write:replies", "allow", 3, 1),
  entry(15, "agt_002", "customer-support-ai", "read", "tickets/4418", "read:tickets", "allow", 0, 1),
  entry(16, "agt_002", "customer-support-ai", "write", "replies/4418", "write:replies", "warn", 12, 1),
  entry(20, "agt_002", "customer-support-ai", "read", "tickets/4417", "read:tickets", "allow", 0, 1),
  entry(22, "agt_002", "customer-support-ai", "write", "replies/4417", "write:replies", "allow", 1, 1),
  entry(30, "agt_002", "customer-support-ai", "read", "tickets/4416", "read:tickets", "allow", 0, 1),
  entry(32, "agt_002", "customer-support-ai", "write", "replies/4416", "write:replies", "allow", 2, 1),
  entry(45, "agt_002", "customer-support-ai", "read", "tickets/4415", "read:tickets", "allow", 0, 1),
  entry(48, "agt_002", "customer-support-ai", "write", "replies/4415", "write:replies", "allow", 1, 1),
  entry(60, "agt_002", "customer-support-ai", "read", "tickets/4414", "read:tickets", "allow", 0, 1),
  entry(65, "agt_002", "customer-support-ai", "write", "replies/4414", "write:replies", "allow", 2, 1),

  // data-pipeline-agent (agt_003) — high volume log reads + metric writes
  entry(0, "agt_003", "data-pipeline-agent", "read", "logs/nginx/access.log", "read:logs", "allow", 0, 2),
  entry(0, "agt_003", "data-pipeline-agent", "write", "metrics/http_requests_total", "write:metrics", "allow", 0, 2),
  entry(1, "agt_003", "data-pipeline-agent", "read", "logs/app/error.log", "read:logs", "allow", 0, 2),
  entry(1, "agt_003", "data-pipeline-agent", "write", "metrics/error_rate_5m", "write:metrics", "allow", 0, 2),
  entry(2, "agt_003", "data-pipeline-agent", "read", "logs/nginx/access.log", "read:logs", "allow", 0, 2),
  entry(2, "agt_003", "data-pipeline-agent", "write", "metrics/p99_latency_ms", "write:metrics", "allow", 1, 2),
  entry(3, "agt_003", "data-pipeline-agent", "read", "logs/worker/job.log", "read:logs", "allow", 0, 2),
  entry(3, "agt_003", "data-pipeline-agent", "write", "metrics/job_throughput", "write:metrics", "allow", 0, 2),
  entry(5, "agt_003", "data-pipeline-agent", "read", "logs/app/audit.log", "read:logs", "allow", 0, 2),
  entry(5, "agt_003", "data-pipeline-agent", "write", "metrics/audit_events_total", "write:metrics", "allow", 0, 2),
  entry(10, "agt_003", "data-pipeline-agent", "read", "logs/nginx/error.log", "read:logs", "allow", 0, 2, 1),
  entry(15, "agt_003", "data-pipeline-agent", "write", "metrics/disk_usage_pct", "write:metrics", "allow", 0, 2),
  entry(20, "agt_003", "data-pipeline-agent", "read", "logs/postgres/slow.log", "read:logs", "allow", 0, 2, 2),
  entry(25, "agt_003", "data-pipeline-agent", "write", "metrics/db_query_p95_ms", "write:metrics", "allow", 0, 2),
  entry(30, "agt_003", "data-pipeline-agent", "read", "logs/redis/commands.log", "read:logs", "allow", 0, 2),
  entry(35, "agt_003", "data-pipeline-agent", "write", "metrics/cache_hit_ratio", "write:metrics", "allow", 0, 2),

  // invoice-processor (agt_004) — reads + writes + stripe calls
  entry(120, "agt_004", "invoice-processor", "read", "invoices/INV-2024-0891", "read:invoices", "allow", 0, 3),
  entry(121, "agt_004", "invoice-processor", "write", "drafts/DRF-2024-0891", "write:drafts", "allow", 3, 3),
  entry(123, "agt_004", "invoice-processor", "call", "stripe/charges/create ($1,200)", "call:stripe", "allow", 10, 3),
  entry(130, "agt_004", "invoice-processor", "read", "invoices/INV-2024-0890", "read:invoices", "allow", 0, 3),
  entry(131, "agt_004", "invoice-processor", "write", "drafts/DRF-2024-0890", "write:drafts", "allow", 2, 3),
  entry(132, "agt_004", "invoice-processor", "call", "stripe/charges/create ($850)", "call:stripe", "allow", 8, 3),
  entry(140, "agt_004", "invoice-processor", "read", "invoices/INV-2024-0889", "read:invoices", "allow", 0, 3),
  entry(141, "agt_004", "invoice-processor", "write", "drafts/DRF-2024-0889", "write:drafts", "allow", 2, 3),
  entry(142, "agt_004", "invoice-processor", "call", "stripe/charges/create ($4,800)", "call:stripe", "warn", 25, 3),
  entry(150, "agt_004", "invoice-processor", "read", "invoices/INV-2024-0888", "read:invoices", "allow", 0, 3),
  entry(155, "agt_004", "invoice-processor", "read", "invoices/INV-2024-0887", "read:invoices", "allow", 0, 3),
  entry(160, "agt_004", "invoice-processor", "write", "drafts/DRF-2024-0887", "write:drafts", "deny", 15, 3),

  // research-assistant (agt_005) — doc reads + web calls
  entry(12, "agt_005", "research-assistant", "read", "docs/api-reference.md", "read:docs", "allow", 0, 4),
  entry(14, "agt_005", "research-assistant", "call", "web/search?q=oauth2+pkce+flow", "call:web", "allow", 2, 4),
  entry(18, "agt_005", "research-assistant", "read", "docs/architecture.md", "read:docs", "allow", 0, 4),
  entry(22, "agt_005", "research-assistant", "call", "web/search?q=rate+limiting+best+practices", "call:web", "allow", 1, 4),
  entry(30, "agt_005", "research-assistant", "read", "docs/deployment.md", "read:docs", "allow", 0, 4),
  entry(35, "agt_005", "research-assistant", "call", "web/fetch?url=https://owasp.org/top-10", "call:web", "allow", 3, 4),
  entry(45, "agt_005", "research-assistant", "read", "docs/security-policy.md", "read:docs", "allow", 0, 4),
  entry(50, "agt_005", "research-assistant", "call", "web/search?q=jwt+refresh+token+rotation", "call:web", "allow", 1, 4),
  entry(60, "agt_005", "research-assistant", "read", "docs/changelog.md", "read:docs", "allow", 0, 4),
  entry(70, "agt_005", "research-assistant", "call", "web/search?q=nextjs+middleware+auth", "call:web", "allow", 2, 4),

  // legacy-script-bot (agt_006) — the anomaly / kill event
  entry(4320, "agt_006", "legacy-script-bot", "read", "src/users/models.ts", "read:src", "allow", 5, 5),
  entry(4319, "agt_006", "legacy-script-bot", "read", ".env.production", "read:secrets", "deny", 80, 5),
  entry(4318, "agt_006", "legacy-script-bot", "read", ".env.staging", "read:secrets", "killed", 0, 5),
]

// ---------------------------------------------------------------------------
// Approval Requests
// ---------------------------------------------------------------------------
export const approvals: ApprovalRequest[] = [
  {
    id: "apr_001",
    agentId: "agt_004",
    agentName: "invoice-processor",
    action: "call:stripe",
    target: "stripe/charges/create",
    details: "Charge $4,800 to customer_id=cus_abc123 for invoice INV-2024-0891",
    requestedAt: minutesAgo(3),
    status: "pending",
  },
  {
    id: "apr_002",
    agentId: "agt_002",
    agentName: "customer-support-ai",
    action: "write:replies",
    target: "tickets/4421",
    details: 'Draft reply to ticket #4421 — refund request over $500 flagged for human review',
    requestedAt: minutesAgo(18),
    status: "pending",
  },
]

// ---------------------------------------------------------------------------
// API Keys
// ---------------------------------------------------------------------------
export const apiKeys: ApiKey[] = [
  {
    id: "key_001",
    name: "Production",
    key: "lsh_live_Kx7mN2pQ3f2a",
    maskedKey: "lsh_live••••••••Qf2a",
    createdAt: daysAgo(60),
    lastUsed: minutesAgo(2),
    status: "active",
  },
  {
    id: "key_002",
    name: "Development",
    key: "lsh_test_Yb4wR8jL9d41",
    maskedKey: "lsh_test••••••••9d41",
    createdAt: daysAgo(30),
    lastUsed: hoursAgo(1),
    status: "active",
  },
]
