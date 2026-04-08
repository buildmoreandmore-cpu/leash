# Leash — AI Agent Governance

> Give your AI agents the keys, not the kingdom.

Leash is drop-in governance for the AI agent workforce. Register every agent, scope what it can touch, watch what it does in real time, require human approval for high-risk actions, and kill agents mid-execution when they go sideways.

**Live demo:** [identityleash.com](https://identityleash.com) (or [leash-azure.vercel.app](https://leash-azure.vercel.app))

## Quick Start

```bash
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the marketing site. Navigate to `/dashboard` for the interactive demo.

## What's Built

### Marketing Site (`/`)
- Hero with word-by-word stagger animation
- Problem statement with animated SVG shield illustration
- Features grid (6 cards) with scroll-triggered reveals
- How it works (3 steps + syntax-highlighted code example)
- Live demo teaser section
- Pricing cards (3 tiers)
- Waitlist email capture form
- Footer with navigation

### Additional Pages
- `/pricing` — Full pricing page with FAQ accordion
- `/about` — Founder story, values, CTA
- `/docs` — Docs stub with installation guide and code walkthrough

### Dashboard (`/dashboard`)
- **Overview** — Metric cards, live activity feed (auto-updates every 4s), agent mini-cards
- **Agents** (`/dashboard/agents`) — Searchable/sortable table of 6 agents with status dots, risk bars, scope badges
- **Agent Detail** (`/dashboard/agents/[id]`) — Tabs: Overview, Activity, Scopes, Settings. Includes the **interactive live demo simulation**
- **Audit Log** (`/dashboard/audit`) — 80+ entries, filterable by agent/action/status/time, paginated
- **Approvals** (`/dashboard/approvals`) — 2 pending requests with approve/deny flow
- **Settings** (`/dashboard/settings`) — API key management with generate/copy, account preferences

### Live Demo Simulation (`/dashboard/agents/refactor-bot`)
Three interactive tasks demonstrate Leash's core value:
1. **Refactor auth module** — Clean run through read/write/test with real-time audit stream
2. **Add npm dependency** — Triggers human approval flow with modal
3. **Read production secrets** — Triggers anomaly detection, scope violation, and kill switch

## What's Mocked vs. Real

| Feature | Status |
|---|---|
| Marketing site | Fully built, production-quality copy |
| Dashboard UI | Fully interactive with seeded data |
| Live demo simulation | Real-time with animated audit stream |
| Approval/deny flow | Works in-browser (local state) |
| API key generation | Generates fake keys, copy works |
| Backend/database | None — all data is in-memory (`lib/fake-data.ts`) |
| Authentication | None — dashboard is public for demo |
| Waitlist form | Fake submission (no real backend) |
| Real-time updates | `setInterval` + React state, not WebSockets |

## Tech Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- shadcn/ui components
- Framer Motion (scroll-triggered reveals, spring physics, staggered offsets)
- Lucide React icons
- Inter + JetBrains Mono fonts
- Dark mode only

## Project Structure

```
leash/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Marketing homepage
│   ├── pricing/page.tsx        # Pricing page with FAQ
│   ├── about/page.tsx          # About page
│   ├── docs/page.tsx           # Docs stub
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard shell with sidebar
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── agents/page.tsx     # Agent list
│   │   ├── agents/[id]/page.tsx # Agent detail + live demo
│   │   ├── audit/page.tsx      # Global audit log
│   │   ├── approvals/page.tsx  # Pending approvals queue
│   │   └── settings/page.tsx   # API keys management
│   └── globals.css
├── components/
│   ├── marketing/              # 10 marketing components
│   ├── dashboard/              # 8 dashboard components
│   └── ui/                     # shadcn components
├── lib/
│   ├── fake-data.ts            # Seeded agents, actions, approvals, API keys
│   ├── demo-engine.ts          # Task simulation logic (3 tasks)
│   └── utils.ts                # Helpers (relativeTime, formatNumber, etc.)
└── tailwind.config.ts
```

## License

Proprietary. All rights reserved.
