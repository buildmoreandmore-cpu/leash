"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const customEase = [0.16, 1, 0.3, 1] as const;

const headline = "Give your AI agents the keys, not the kingdom.";
const words = headline.split(" ");

const integrations = [
  "Works with Claude",
  "GPT",
  "Cursor",
  "Claude Code",
  "LangChain",
  "MCP",
];

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-24">
      {/* Animated gradient orb */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-[200px]"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Headline — word-by-word stagger */}
        <h1 className="mb-6 text-6xl font-bold leading-[1.05] tracking-[-0.03em] text-text-primary md:text-8xl">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3 + i * 0.06,
                duration: 0.7,
                ease: customEase,
              }}
              className="mr-[0.25em] inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3 + words.length * 0.06 + 0.15,
            duration: 0.8,
            ease: customEase,
          }}
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-text-tertiary"
        >
          Leash is drop-in governance for the AI agent workforce. Register every
          agent, scope what it can touch, watch what it does, and kill it mid-run
          when it goes sideways — all with one line of code.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3 + words.length * 0.06 + 0.35,
            duration: 0.8,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-text-primary px-6 text-base font-semibold text-white transition-colors hover:bg-text-secondary"
          >
            Start free with an API key
          </Link>
          <a
            href="#demo-teaser"
            className="inline-flex h-12 items-center justify-center px-2 text-base font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            See live demo &rarr;
          </a>
        </motion.div>

        {/* Integration pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {integrations.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3 + words.length * 0.06 + 0.5 + i * 0.08,
                duration: 0.6,
                ease: customEase,
              }}
              className="rounded-md bg-slate-100 px-3 py-1.5 font-mono text-xs text-text-tertiary"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
