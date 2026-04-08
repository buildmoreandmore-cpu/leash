"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CodeExample } from "./code-example";

const customEase = [0.16, 1, 0.3, 1] as const;

const steps = [
  {
    num: 1,
    title: "Register your agent",
    description:
      "Give it an ID, assign a human owner, and declare exactly what it's allowed to touch.",
  },
  {
    num: 2,
    title: "Wrap your runtime",
    description:
      "One function call wraps your existing agent. No refactoring, no migration.",
  },
  {
    num: 3,
    title: "Watch the dashboard",
    description:
      "Every action streams to your audit log in real time. Set alerts, require approvals, or pull the kill switch.",
  },
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

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Three lines of code. Complete control.
          </h2>
        </motion.div>

        <div
          ref={ref}
          className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16"
        >
          {/* Left — steps */}
          <div className="flex flex-col gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  delay: i * 0.15,
                  duration: 0.7,
                  ease: customEase,
                }}
                className="flex gap-5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-sm text-primary">
                  {step.num}
                </div>
                <div>
                  <h3 className="mb-1.5 text-xl font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-tertiary">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right — code example */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              delay: 0.25,
              duration: 0.8,
              ease: customEase,
            }}
          >
            <CodeExample
              code={codeSnippet}
              language="typescript"
              filename="agent.ts"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
