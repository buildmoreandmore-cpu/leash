"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const customEase = [0.16, 1, 0.3, 1] as const;

export function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="px-6 py-24">
      <div ref={ref} className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
        {/* Left — text */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
          >
            Your AI agents have admin access and nobody&apos;s watching.
          </motion.h2>

          {[
            "Every AI agent you deploy acts as a super-admin by default. It has the same access as the service account it runs on — and most of those accounts have far more permissions than any agent needs.",
            "80% of organizations have already experienced unintended agent behavior. Agents that read files they shouldn't, call APIs outside their scope, or make decisions no human approved.",
            "Existing identity tools were built for humans who log in once a day. They weren't designed for agents that make 5,000 API calls a minute, spawn sub-agents, and operate autonomously around the clock.",
          ].map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.15 + i * 0.12,
                duration: 0.7,
                ease: customEase,
              }}
              className="mb-5 text-base leading-relaxed text-text-secondary last:mb-0"
            >
              {text}
            </motion.p>
          ))}
        </div>

        {/* Right — shield illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center"
        >
          <div className="relative h-80 w-64">
            {/* Shield shape */}
            <svg
              viewBox="0 0 200 240"
              fill="none"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <motion.path
                d="M100 10 L185 50 L185 130 Q185 200 100 230 Q15 200 15 130 L15 50 Z"
                fill="url(#shieldGrad)"
                stroke="#1e3558"
                strokeWidth="1.5"
                animate={{
                  stroke: ["#1e3558", "#3b82f6", "#1e3558"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>

            {/* Agent dot 1 — safe (blue) */}
            <motion.div
              className="absolute left-[30%] top-[35%] h-4 w-4 rounded-full bg-primary"
              animate={{
                scale: [1, 1.15, 1],
                boxShadow: [
                  "0 0 8px #3b82f666",
                  "0 0 16px #3b82f699",
                  "0 0 8px #3b82f666",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Agent dot 2 — safe (green) */}
            <motion.div
              className="absolute left-[55%] top-[50%] h-4 w-4 rounded-full bg-success"
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 8px #10b98166",
                  "0 0 16px #10b98199",
                  "0 0 8px #10b98166",
                ],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />

            {/* Agent dot 3 — rogue (red) */}
            <motion.div
              className="absolute left-[45%] top-[68%] h-5 w-5 rounded-full bg-danger"
              animate={{
                scale: [1, 1.3, 1],
                boxShadow: [
                  "0 0 12px #ef444466",
                  "0 0 28px #ef4444bb",
                  "0 0 12px #ef444466",
                ],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Connection lines (decorative) */}
            <svg
              viewBox="0 0 200 240"
              fill="none"
              className="absolute inset-0 h-full w-full"
            >
              {/* Line from dot 1 to dot 2 */}
              <motion.line
                x1="68"
                y1="90"
                x2="118"
                y2="125"
                stroke="#3b82f6"
                strokeWidth="0.8"
                strokeDasharray="4 4"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Line from dot 2 to rogue dot */}
              <motion.line
                x1="118"
                y1="125"
                x2="98"
                y2="168"
                stroke="#ef4444"
                strokeWidth="0.8"
                strokeDasharray="4 4"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
