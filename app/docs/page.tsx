"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { CodeExample } from "@/components/marketing/code-example";

const customEase = [0.16, 1, 0.3, 1] as const;

const sidebarItems = [
  { label: "Getting Started", id: "getting-started" },
  { label: "Installation", id: "installation" },
  { label: "Registering an Agent", id: "registering-an-agent" },
  { label: "Scopes", id: "scopes" },
  { label: "Approvals", id: "approvals" },
  { label: "Kill Switch", id: "kill-switch" },
  { label: "API Reference", id: "api-reference" },
];

const codeSnippet = `import { Leash } from "@leash-ai/sdk"

const leash = new Leash({ apiKey: process.env.LEASH_KEY })

// 1. Register the agent
const agent = await leash.agents.register({
  name: "refactor-bot",
  owner: "eng-team@acme.com",
  scopes: ["repo:read", "repo:write", "ci:trigger"],
})

// 2. Wrap your runtime
const session = await leash.sessions.start({
  agentId: agent.id,
  ttl: "1h",
  approvalPolicy: "auto",
})

// 3. Every action is now logged
await session.action("file.read", {
  path: "/src/index.ts",
})`;

export default function DocsPage() {
  const [activeSection] = useState("getting-started");

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
            <nav className="flex flex-col gap-1">
              {sidebarItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`rounded-md px-3 py-2 text-sm transition-colors ${
                    activeSection === item.id
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
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
            {/* Preview banner */}
            <div className="mb-10 rounded-lg border border-primary/20 bg-primary/10 p-4">
              <p className="text-sm text-text-secondary">
                Full docs launching with v1. This is a preview.
              </p>
            </div>

            {/* Getting Started */}
            <section id="getting-started">
              <h1 className="mb-8 text-3xl font-bold tracking-tight text-text-primary">
                Getting Started
              </h1>

              {/* Installation */}
              <h2
                id="installation"
                className="mb-4 text-xl font-semibold text-text-primary"
              >
                Installation
              </h2>
              <div className="mb-8 overflow-hidden rounded-lg border border-border-leash bg-[#060d1b]">
                <pre className="p-4 font-mono text-sm text-text-primary">
                  <code>npm install @leash/sdk</code>
                </pre>
              </div>

              {/* Your first agent */}
              <h2 className="mb-4 text-xl font-semibold text-text-primary">
                Your first agent
              </h2>
              <p className="mb-6 text-base leading-relaxed text-text-secondary">
                The snippet below shows the complete lifecycle — registering an
                agent, starting a scoped session, and logging an action. This is
                all you need to get Leash running in your project.
              </p>

              <div className="mb-8">
                <CodeExample
                  code={codeSnippet}
                  language="typescript"
                  filename="agent.ts"
                />
              </div>

              {/* Walkthrough */}
              <h2 className="mb-4 text-xl font-semibold text-text-primary">
                Step-by-step walkthrough
              </h2>
              <div className="mb-8 flex flex-col gap-4 text-base leading-relaxed text-text-secondary">
                <p>
                  <strong className="text-text-primary">
                    Import and initialize.
                  </strong>{" "}
                  The SDK exports a single{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-primary">
                    Leash
                  </code>{" "}
                  class. Pass your API key (from the dashboard) to create a
                  client instance. All subsequent calls go through this instance.
                </p>
                <p>
                  <strong className="text-text-primary">
                    Register the agent.
                  </strong>{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-primary">
                    leash.agents.register()
                  </code>{" "}
                  creates a named agent identity with a human owner and a
                  declared set of scopes. Scopes define the maximum boundary of
                  what this agent is allowed to do.
                </p>
                <p>
                  <strong className="text-text-primary">
                    Start a session.
                  </strong>{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-primary">
                    leash.sessions.start()
                  </code>{" "}
                  issues a time-bound JWT for the agent. The{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-primary">
                    ttl
                  </code>{" "}
                  controls how long the session lasts, and{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-primary">
                    approvalPolicy
                  </code>{" "}
                  determines whether actions require human sign-off.
                </p>
                <p>
                  <strong className="text-text-primary">Log an action.</strong>{" "}
                  Every call to{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-primary">
                    session.action()
                  </code>{" "}
                  is intercepted by Leash, checked against the agent&apos;s
                  scopes, and recorded in the immutable audit log. If the action
                  is outside the agent&apos;s declared scopes, it is blocked
                  before execution.
                </p>
              </div>

              {/* Next steps */}
              <h2 className="mb-4 text-xl font-semibold text-text-primary">
                Next steps
              </h2>
              <ul className="flex flex-col gap-2.5 text-base text-text-secondary">
                <li>
                  <a
                    href="#scopes"
                    className="text-primary transition-colors hover:text-primary/80"
                  >
                    Scopes
                  </a>{" "}
                  — Learn how to define fine-grained permission boundaries.
                </li>
                <li>
                  <a
                    href="#approvals"
                    className="text-primary transition-colors hover:text-primary/80"
                  >
                    Approvals
                  </a>{" "}
                  — Set up human-in-the-loop approval workflows.
                </li>
                <li>
                  <a
                    href="#kill-switch"
                    className="text-primary transition-colors hover:text-primary/80"
                  >
                    Kill Switch
                  </a>{" "}
                  — Configure emergency agent termination.
                </li>
                <li>
                  <a
                    href="#api-reference"
                    className="text-primary transition-colors hover:text-primary/80"
                  >
                    API Reference
                  </a>{" "}
                  — Full endpoint documentation.
                </li>
              </ul>
            </section>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
