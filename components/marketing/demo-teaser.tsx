"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const customEase = [0.16, 1, 0.3, 1] as const;

export function DemoTeaser() {
  return (
    <section id="demo-teaser" className="relative overflow-hidden px-4 py-16 sm:px-6 md:py-24">
      {/* Subtle gradient bg instead of flat blue */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-transparent" />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: customEase }}
          className="rounded-2xl border border-border-leash bg-surface p-6 sm:p-12 md:p-16"
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5"
            animate={{ borderColor: ["#3b82f633", "#3b82f6", "#3b82f633"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono font-medium text-primary">
              Live interactive demo
            </span>
          </motion.div>

          <h2 className="mb-4 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl md:text-4xl">
            See the dashboard in action.
          </h2>

          <p className="mb-8 text-base text-text-tertiary">
            Run three real scenarios — a clean execution, an approval gate, and a
            kill switch — in a fully interactive dashboard.
          </p>

          <Link
            href="/dashboard/agents/refactor-bot"
            className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-8 text-base font-semibold text-white transition-all duration-300 hover:bg-primary/90 glow-blue hover:scale-[1.02]"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 2,
              }}
            />
            <span className="relative">Launch the demo</span>
            <motion.span
              className="relative"
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
