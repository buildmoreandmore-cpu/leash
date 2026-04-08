"use client";

import { motion } from "framer-motion";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";

const customEase = [0.16, 1, 0.3, 1] as const;

const sections = [
  {
    id: "the-problem",
    title: "The problem",
    body: `Every AI agent you deploy today inherits the permissions of the service account it runs on. That means your coding assistant has the same access as your CI pipeline. Your customer support bot can read every database table in production. Your "research agent" can call any API your infrastructure can reach.\n\nThis isn't a hypothetical. It's how most agent deployments work right now. And it's a ticking clock.`,
  },
  {
    id: "why-existing-tools-fail",
    title: "Why existing tools fail",
    body: `Enterprise IAM platforms were built for humans. They assume periodic logins, session timeouts, and manual approval chains that take hours or days. They were designed for a world where one person accesses one system at a time.\n\nAI agents don't work that way. They make thousands of API calls per minute. They spawn sub-agents. They operate autonomously, around the clock, without anyone watching. Fitting them into human identity frameworks is like putting a jet engine on a bicycle — the frame wasn't built for it.`,
  },
  {
    id: "what-we-believe",
    title: "What we believe",
    body: `Every agent needs an identity — not a shared service account, but its own registered identity with a human owner and declared permissions.\n\nEvery action needs a record — not just logging after the fact, but real-time interception and evaluation before execution.\n\nEvery boundary needs enforcement — not documentation that agents should follow, but code-level gates that agents cannot bypass.\n\nEvery risk needs a kill switch — not a manual process that takes twenty minutes, but an instant revocation that terminates sessions in under five seconds.`,
  },
  {
    id: "our-approach",
    title: "Our approach",
    body: `Leash is a single SDK call that wraps your existing agent runtime. No refactoring. No migration. No six-month procurement process.\n\nYou register your agent, declare what it's allowed to touch, and Leash handles the rest — scope enforcement, real-time audit logging, anomaly detection, human approval workflows, and emergency kill switches.\n\nWe built this because we've spent years in identity and access management. We know what Fortune 500 IAM tools do well. We also know they're the wrong shape, the wrong speed, and the wrong price for the developers actually shipping AI agents today.`,
  },
  {
    id: "who-this-is-for",
    title: "Who this is for",
    body: `Solo developers who ship AI features and lose sleep wondering what their agents did overnight.\n\nSmall teams running AI in production who need governance that doesn't require a security consultant and a six-figure budget.\n\nAnyone who's watched an agent do something unexpected and thought: "We need to be able to stop that."`,
  },
  {
    id: "the-future",
    title: "The future we're building toward",
    body: `The AI agent workforce is growing faster than the infrastructure to govern it. Every week, more agents ship with more autonomy and less oversight.\n\nWe're building the governance layer that makes this sustainable — not by slowing agents down, but by making their boundaries clear, their actions visible, and their risks manageable.\n\nSecurity shouldn't require a six-figure contract. Developers deserve tools that ship in an afternoon, not a quarter. Governance should be a one-line wrapper, not a rebuild.\n\nThat's the product. That's the mission.`,
  },
];

const sidebarItems = sections.map((s) => ({ label: s.title, id: s.id }));

export default function ManifestoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <div className="mx-auto flex max-w-7xl px-6 py-24">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: customEase }}
            className="sticky top-24 hidden h-fit w-60 shrink-0 lg:block"
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
              Manifesto
            </h3>
            <nav className="flex flex-col gap-1">
              {sidebarItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="rounded-md px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-hover hover:text-text-secondary"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.aside>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: customEase }}
            className="min-w-0 flex-1 lg:pl-12"
          >
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
              Why Leash exists
            </h1>

            <div className="flex flex-col gap-16">
              {sections.map((section, i) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.7,
                    ease: customEase,
                  }}
                >
                  <h2 className="mb-6 text-2xl font-semibold text-text-primary">
                    {section.title}
                  </h2>
                  <div className="flex flex-col gap-4 text-base leading-[1.8] text-text-secondary">
                    {section.body.split("\n\n").map((paragraph, j) => (
                      <p key={j}>{paragraph}</p>
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
