"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";

const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const sections = [
  {
    id: "the-problem",
    number: "01",
    title: "The problem",
    highlight: "Your agents have the keys to everything.",
    paragraphs: [
      'Every AI agent you deploy today inherits the permissions of the service account it runs on. Your coding assistant has the same access as your CI pipeline. Your support bot can read every database table in production. Your "research agent" can call any API your infrastructure can reach.',
      "This isn't a hypothetical. It's how most agent deployments work right now. And it's a ticking clock.",
    ],
  },
  {
    id: "why-existing-tools-fail",
    number: "02",
    title: "Why existing tools fail",
    highlight: "IAM was built for humans, not machines.",
    paragraphs: [
      "Enterprise IAM platforms assume periodic logins, session timeouts, and manual approval chains that take hours or days. They were designed for a world where one person accesses one system at a time.",
      "AI agents don't work that way. They make thousands of API calls per minute. They spawn sub-agents. They operate autonomously, around the clock, without anyone watching. Fitting them into human identity frameworks is like putting a jet engine on a bicycle.",
    ],
  },
  {
    id: "what-we-believe",
    number: "03",
    title: "What we believe",
    highlight: "Four principles for governing the agent workforce.",
    paragraphs: [
      "Every agent needs an identity — not a shared service account, but its own registered identity with a human owner and declared permissions.",
      "Every action needs a record — not just logging after the fact, but real-time interception and evaluation before execution.",
      "Every boundary needs enforcement — not documentation that agents should follow, but code-level gates that agents cannot bypass.",
      "Every risk needs a kill switch — not a manual process that takes twenty minutes, but an instant revocation that terminates sessions in under five seconds.",
    ],
  },
  {
    id: "our-approach",
    number: "04",
    title: "Our approach",
    highlight: "One SDK call. Complete governance.",
    paragraphs: [
      "Leash is a single SDK call that wraps your existing agent runtime. No refactoring. No migration. No six-month procurement process.",
      "You register your agent, declare what it's allowed to touch, and Leash handles the rest — scope enforcement, real-time audit logging, anomaly detection, human approval workflows, and emergency kill switches.",
      "We built this because we've spent years in identity and access management. We know what Fortune 500 IAM tools do well. We also know they're the wrong shape, the wrong speed, and the wrong price for the developers actually shipping AI agents today.",
    ],
  },
  {
    id: "who-this-is-for",
    number: "05",
    title: "Who this is for",
    highlight: "If you've lost sleep over what your agents did, this is for you.",
    paragraphs: [
      "Solo developers who ship AI features and lose sleep wondering what their agents did overnight.",
      "Small teams running AI in production who need governance that doesn't require a security consultant and a six-figure budget.",
      'Anyone who\'s watched an agent do something unexpected and thought: "We need to be able to stop that."',
    ],
  },
  {
    id: "the-future",
    number: "06",
    title: "The future we're building toward",
    highlight: "Governance at the speed of autonomy.",
    paragraphs: [
      "The AI agent workforce is growing faster than the infrastructure to govern it. Every week, more agents ship with more autonomy and less oversight.",
      "We're building the governance layer that makes this sustainable — not by slowing agents down, but by making their boundaries clear, their actions visible, and their risks manageable.",
      "Security shouldn't require a six-figure contract. Developers deserve tools that ship in an afternoon, not a quarter. Governance should be a one-line wrapper, not a rebuild.",
      "That's the product. That's the mission.",
    ],
  },
];

function ManifestoSection({
  section,
  index,
}: {
  section: (typeof sections)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.3"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.section
      ref={ref}
      id={section.id}
      className="relative grid gap-8 md:grid-cols-[120px_1fr] md:gap-12"
    >
      {/* Left — number and animated line */}
      <div className="relative hidden md:block">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: customEase, delay: index * 0.05 }}
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 font-mono text-sm font-bold text-primary"
        >
          {section.number}
        </motion.span>
        {/* Vertical progress line */}
        {index < sections.length - 1 && (
          <div className="absolute left-6 top-16 h-[calc(100%-4rem)] w-px bg-border-leash">
            <motion.div
              className="w-full bg-primary/40"
              style={{ height: lineHeight }}
            />
          </div>
        )}
      </div>

      {/* Right — content */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: customEase, delay: index * 0.05 }}
        >
          {/* Mobile number */}
          <span className="mb-3 inline-block font-mono text-xs font-semibold text-primary md:hidden">
            {section.number}
          </span>
          <h2 className="mb-3 text-2xl font-bold text-text-primary md:text-3xl">
            {section.title}
          </h2>
          <p className="mb-6 text-lg font-medium text-primary">
            {section.highlight}
          </p>
          <div className="flex flex-col gap-4">
            {section.paragraphs.map((p, j) => (
              <motion.p
                key={j}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  ease: customEase,
                  delay: j * 0.08,
                }}
                className="text-base leading-[1.8] text-text-secondary"
              >
                {p}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function ManifestoPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        {/* Hero section */}
        <div ref={heroRef} className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-32 lg:py-40">
          {/* Background glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]" />

          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative mx-auto max-w-3xl text-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: customEase }}
              className="mb-6 inline-block font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary"
            >
              Manifesto
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: customEase, delay: 0.1 }}
              className="mb-6 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-7xl"
            >
              Why Leash exists
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: customEase, delay: 0.3 }}
              className="text-lg text-text-tertiary md:text-xl"
            >
              Built by a cybersecurity expert certified in Identity and Access
              Management — for the developers who need governance that ships in
              an afternoon, not a quarter.
            </motion.p>
          </motion.div>
        </div>

        {/* Sections */}
        <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 md:pb-32">
          <div className="flex flex-col gap-14 sm:gap-20 md:gap-24">
            {sections.map((section, i) => (
              <ManifestoSection key={section.id} section={section} index={i} />
            ))}
          </div>

          {/* Final statement */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: customEase }}
            className="mt-16 border-t border-border-leash pt-10 text-center sm:mt-24 sm:pt-16"
          >
            <p className="mx-auto max-w-lg text-lg font-medium leading-relaxed text-text-primary sm:text-xl">
              &ldquo;Give your AI agents the keys, not the kingdom.&rdquo;
            </p>
            <p className="mt-4 font-mono text-sm text-text-muted">
              — The Leash team
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
