"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

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
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 inline-flex"
        >
          <span className="inline-flex items-center rounded-full border border-border-leash bg-surface px-4 py-1.5 text-sm text-text-secondary animate-border-pulse">
            Agent identity and access control, purpose-built for developers
          </span>
        </motion.div>

        {/* Headline — word-by-word stagger */}
        <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-text-primary md:text-7xl">
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
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl"
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
            className={buttonVariants({
              size: "lg",
              className:
                "h-12 px-6 text-base glow-blue transition-shadow hover:shadow-[0_0_24px_#3b82f666,0_0_48px_#3b82f633]",
            })}
          >
            Start free with an API key
          </Link>
          <a
            href="#demo-teaser"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "h-12 px-6 text-base border-border-leash",
            })}
          >
            See live demo
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
              className="rounded-full border border-border-leash px-4 py-1.5 text-sm text-text-secondary"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
