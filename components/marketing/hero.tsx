"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const customEase = [0.16, 1, 0.3, 1] as const;

const headline = "Governance for AI agents. One line of code.";
const words = headline.split(" ");

const integrations = [
  {
    name: "Claude",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M4.709 15.955l4.397-2.006a.4.4 0 0 1 .349.006l2.545 1.327l2.545-1.327a.4.4 0 0 1 .349-.006l4.397 2.006a.4.4 0 0 1 .209.351v2.388a.4.4 0 0 1-.218.356l-7.073 3.616a.4.4 0 0 1-.364.002L4.72 19.052a.4.4 0 0 1-.22-.357v-2.389a.4.4 0 0 1 .209-.35ZM12 1.338a.4.4 0 0 1 .182.044l7.073 3.616a.4.4 0 0 1 0 .714L12.182 9.33a.4.4 0 0 1-.364 0L4.745 5.712a.4.4 0 0 1 0-.714l7.073-3.616A.4.4 0 0 1 12 1.338Zm7.5 6.062v5.294a.4.4 0 0 1-.218.356l-4.397 2.248a.4.4 0 0 1-.585-.356V9.648a.4.4 0 0 1 .218-.356l4.397-2.248a.4.4 0 0 1 .585.356Zm-15 0v5.294a.4.4 0 0 0 .218.356l4.397 2.248a.4.4 0 0 0 .585-.356V9.648a.4.4 0 0 0-.218-.356L5.085 7.044a.4.4 0 0 0-.585.356Z" />
      </svg>
    ),
  },
  {
    name: "GPT",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073ZM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494ZM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646ZM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872Zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667Zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66ZM8.324 12.952l-2.02-1.164a.08.08 0 0 1-.038-.057V6.148a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.72 5.534a.795.795 0 0 0-.393.681l-.003 6.737Zm1.097-2.368l2.602-1.5 2.607 1.5v2.999l-2.602 1.5-2.607-1.5Z" />
      </svg>
    ),
  },
  {
    name: "Cursor",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M3 3l7.07 18 2.51-7.36L20 11.13 3 3Zm9.18 9.18L10.1 17.5 5.5 5.5l9.95 4.14-3.27 2.54Z" />
      </svg>
    ),
  },
  {
    name: "Claude Code",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    name: "LangChain",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    name: "MCP",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
];

// Floating particle component for background
function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full bg-primary/20"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.15, 0.4, 0.15],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Terminal-style CTA — types out a command, "executes" on click              */
/* -------------------------------------------------------------------------- */
const CMD = "leash demo --interactive";

function TerminalCTA() {
  const router = useRouter();
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "idle" | "running" | "done">("typing");

  // Typewriter effect on mount
  useEffect(() => {
    if (phase !== "typing") return;
    if (typed.length >= CMD.length) {
      setPhase("idle");
      return;
    }
    const timeout = setTimeout(
      () => setTyped(CMD.slice(0, typed.length + 1)),
      50 + Math.random() * 40
    );
    return () => clearTimeout(timeout);
  }, [typed, phase]);

  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("running");
    setTimeout(() => {
      setPhase("done");
      setTimeout(() => router.push("/dashboard"), 400);
    }, 1200);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative mx-auto flex cursor-pointer items-center gap-3 rounded-xl border border-primary/40 bg-[#060d1b] px-6 py-4 font-mono text-sm shadow-[0_0_20px_#3b82f615,0_0_40px_#3b82f610] transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_#3b82f630,0_0_60px_#3b82f618]"
    >
      {/* Terminal prompt */}
      <span className="select-none text-success">$</span>

      {/* Command text */}
      <span className="text-text-primary">
        {typed}
        {phase === "typing" && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="ml-px inline-block h-4 w-[2px] translate-y-[2px] bg-primary"
          />
        )}
        {phase === "idle" && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="ml-px inline-block h-4 w-[2px] translate-y-[2px] bg-primary"
          />
        )}
      </span>

      {/* Status indicator */}
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.span
            key="enter"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="ml-auto flex items-center gap-1.5 rounded-md border border-border-leash bg-surface px-2 py-0.5 text-xs text-text-muted"
          >
            press <kbd className="rounded border border-border-strong bg-surface-hover px-1.5 py-px text-text-tertiary">↵</kbd>
          </motion.span>
        )}
        {phase === "running" && (
          <motion.span
            key="running"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="ml-auto flex items-center gap-2 text-xs text-warning"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="inline-block h-3 w-3 rounded-full border-2 border-warning/30 border-t-warning"
            />
            running...
          </motion.span>
        )}
        {phase === "done" && (
          <motion.span
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-auto flex items-center gap-1.5 text-xs text-success"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            connected
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const orbX = useTransform(springX, [0, 1], [-20, 20]);
  const orbY = useTransform(springY, [0, 1], [-20, 20]);

  return (
    <section
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-24"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
      }}
    >
      {/* Animated gradient orb — follows mouse with spring physics */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
        style={{ x: orbX, y: orbY }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary orb */}
      <motion.div
        className="pointer-events-none absolute left-[30%] top-[20%] h-[300px] w-[300px] rounded-full bg-info/8 blur-[100px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      <FloatingParticle delay={0} x="15%" y="25%" size={4} />
      <FloatingParticle delay={0.5} x="80%" y="30%" size={3} />
      <FloatingParticle delay={1} x="60%" y="70%" size={5} />
      <FloatingParticle delay={1.5} x="25%" y="65%" size={3} />
      <FloatingParticle delay={2} x="70%" y="20%" size={4} />
      <FloatingParticle delay={2.5} x="40%" y="80%" size={3} />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Headline — word-by-word stagger with scale */}
        <h1 className="mb-6 text-6xl font-bold leading-[1.05] tracking-[-0.03em] text-text-primary md:text-8xl">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{
                delay: 0.2 + i * 0.07,
                duration: 0.8,
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
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2 + words.length * 0.07 + 0.2,
            duration: 0.9,
            ease: customEase,
          }}
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-text-tertiary"
        >
          Register every agent, scope what it can touch, watch what it does in
          real time, and kill it mid-run when it goes sideways.
        </motion.p>

        {/* Terminal CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.2 + words.length * 0.07 + 0.4,
            duration: 0.8,
            ease: customEase,
          }}
          className="mb-14"
        >
          <TerminalCTA />
        </motion.div>

        {/* Integration pills with icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + words.length * 0.07 + 0.6, duration: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
            Works with
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {integrations.map((item, i) => (
              <motion.span
                key={item.name}
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.2 + words.length * 0.07 + 0.7 + i * 0.08,
                  duration: 0.5,
                  ease: customEase,
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 rounded-lg border border-border-leash bg-surface px-3 py-1.5 font-mono text-xs text-text-secondary transition-colors hover:border-primary/40 hover:text-text-primary"
              >
                {item.icon}
                {item.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
