"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { User } from "lucide-react";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { buttonVariants } from "@/components/ui/button";

const customEase = [0.16, 1, 0.3, 1] as const;

const values = [
  "Security shouldn\u2019t require a six-figure contract.",
  "Developers deserve tools that ship in an afternoon, not a quarter.",
  "Governance should be a one-line wrapper, not a rebuild.",
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <div className="py-24">
          <div className="mx-auto max-w-4xl px-6">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: customEase }}
              className="mb-10 text-4xl font-bold tracking-tight text-text-primary"
            >
              Built by someone who&apos;s seen AI agents go wrong.
            </motion.h1>

            {/* Body paragraphs */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: customEase }}
              className="mb-6 text-lg leading-relaxed text-text-secondary"
            >
              Leash was built by a cybersecurity expert certified in Identity and
              Access Management who watched the AI agent wave arrive and saw the
              gap immediately. Enterprise IAM platforms — the ones Fortune 500
              companies spend six figures on — were the wrong shape for this new
              world. They assume human users, periodic logins, and manual
              approval chains. AI agents don&apos;t work that way.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: customEase }}
              className="mb-6 text-lg leading-relaxed text-text-secondary"
            >
              The developers actually shipping these agents needed something
              different: a lightweight SDK, a real-time dashboard, and governance
              that wraps around their existing code in a single function call.
              Not a six-month procurement process. Not a consultant engagement. A
              tool that ships in an afternoon.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7, ease: customEase }}
              className="mb-16 text-lg leading-relaxed text-text-secondary"
            >
              That&apos;s what Leash is. The governance layer the founder wished
              existed when agents started going sideways in production.
            </motion.p>

            {/* Founder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: customEase }}
              className="mb-16"
            >
              <div className="flex items-start gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-border-leash bg-surface">
                  <User className="h-8 w-8 text-text-muted" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-text-muted">
                    Founder — Cybersecurity expert, IAM certified
                  </p>
                  <p className="text-base leading-relaxed text-text-secondary">
                    After years of implementing identity platforms for
                    enterprises, the founder recognized that the same access
                    control principles that protect human users needed to be
                    reimagined for autonomous AI agents. Leash is the result of
                    that conviction — purpose-built governance that respects how
                    developers actually work.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7, ease: customEase }}
              className="mb-16"
            >
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-text-primary">
                What we believe
              </h2>
              <ul className="flex flex-col gap-4">
                {values.map((value, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.85 + i * 0.1,
                      duration: 0.6,
                      ease: customEase,
                    }}
                    className="flex items-start gap-3 text-lg text-text-secondary"
                  >
                    <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-primary" />
                    {value}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7, ease: customEase }}
              className="text-center"
            >
              <Link
                href="/dashboard"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-12 px-8 text-base glow-blue transition-shadow hover:shadow-[0_0_24px_#3b82f666,0_0_48px_#3b82f633]",
                })}
              >
                Try the demo
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
