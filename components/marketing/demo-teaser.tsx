"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const customEase = [0.16, 1, 0.3, 1] as const;

export function DemoTeaser() {
  return (
    <section
      id="demo-teaser"
      className="bg-primary px-6 py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl"
        >
          Watch an agent get caught in real time.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            delay: 0.1,
            duration: 0.7,
            ease: customEase,
          }}
          className="mb-10 text-lg text-white/80"
        >
          See Leash detect a scope violation, flag an anomaly, and kill a rogue
          agent — all in a live, interactive simulation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="mb-4"
        >
          <Link
            href="/dashboard/agents/refactor-bot"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-semibold text-text-primary transition-colors hover:bg-white/90"
          >
            Launch the demo
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            delay: 0.35,
            duration: 0.6,
            ease: customEase,
          }}
          className="text-sm text-white/60"
        >
          No signup. No credit card. Just a working demo.
        </motion.p>
      </div>
    </section>
  );
}
