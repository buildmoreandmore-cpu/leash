"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* -------------------------------------------------------------------------- */
/* Animated network graph showing agents accessing systems                     */
/* Center hub = "Your Infrastructure", surrounding nodes = agents              */
/* One agent goes rogue — its connection turns red, gets severed               */
/* -------------------------------------------------------------------------- */

const agents = [
  { id: "a1", label: "Coding Agent", x: 80, y: 45, status: "safe" as const },
  { id: "a2", label: "Support Bot", x: 320, y: 30, status: "safe" as const },
  { id: "a3", label: "Data Pipeline", x: 370, y: 160, status: "safe" as const },
  { id: "a4", label: "Rogue Agent", x: 300, y: 280, status: "rogue" as const },
  { id: "a5", label: "Research Bot", x: 60, y: 250, status: "safe" as const },
];

const hub = { x: 200, y: 160 };

function DataPacket({
  from,
  to,
  delay,
  color,
  duration = 2,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  delay: number;
  color: string;
  duration?: number;
}) {
  return (
    <motion.circle
      r="3"
      fill={color}
      initial={{ cx: from.x, cy: from.y, opacity: 0 }}
      animate={{
        cx: [from.x, to.x],
        cy: [from.y, to.y],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "easeInOut",
      }}
    />
  );
}

export function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="px-4 py-16 sm:px-6 md:py-24">
      <div
        ref={ref}
        className="mx-auto grid max-w-7xl gap-10 sm:gap-16 lg:grid-cols-2 lg:items-center"
      >
        {/* Left — text */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: customEase }}
            className="mb-6 text-2xl font-bold leading-tight tracking-tight text-text-primary sm:mb-8 sm:text-3xl md:text-4xl"
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
              className="mb-5 text-base leading-relaxed text-text-tertiary last:mb-0"
            >
              {text}
            </motion.p>
          ))}
        </div>

        {/* Right — animated network visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.9, ease: customEase }}
          className="flex items-center justify-center"
        >
          <div className="relative w-full max-w-[420px]">
            <svg
              viewBox="0 0 400 320"
              fill="none"
              className="w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Connection lines from agents to hub */}
              {agents.map((agent) => (
                <motion.line
                  key={`line-${agent.id}`}
                  x1={agent.x}
                  y1={agent.y}
                  x2={hub.x}
                  y2={hub.y}
                  stroke={agent.status === "rogue" ? "#ef4444" : "#3b82f6"}
                  strokeWidth="1"
                  strokeOpacity={agent.status === "rogue" ? 0.4 : 0.2}
                  strokeDasharray={agent.status === "rogue" ? "6 4" : "none"}
                  animate={
                    agent.status === "rogue"
                      ? { strokeOpacity: [0.2, 0.6, 0.2] }
                      : { strokeOpacity: [0.15, 0.3, 0.15] }
                  }
                  transition={{
                    duration: agent.status === "rogue" ? 1.2 : 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Data packets traveling along connections */}
              {agents.map((agent, i) =>
                agent.status === "safe" ? (
                  <DataPacket
                    key={`pkt-${agent.id}`}
                    from={{ x: agent.x, y: agent.y }}
                    to={hub}
                    delay={i * 0.8}
                    color="#3b82f6"
                  />
                ) : (
                  <>
                    {/* Rogue agent sends packets faster */}
                    <DataPacket
                      key={`pkt-${agent.id}-1`}
                      from={{ x: agent.x, y: agent.y }}
                      to={hub}
                      delay={0}
                      color="#ef4444"
                      duration={1}
                    />
                    <DataPacket
                      key={`pkt-${agent.id}-2`}
                      from={{ x: agent.x, y: agent.y }}
                      to={hub}
                      delay={0.5}
                      color="#ef4444"
                      duration={1}
                    />
                  </>
                )
              )}

              {/* Hub — center infrastructure node */}
              <motion.circle
                cx={hub.x}
                cy={hub.y}
                r="32"
                fill="#0f1e36"
                stroke="#3b82f6"
                strokeWidth="1.5"
                animate={{
                  strokeOpacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle
                cx={hub.x}
                cy={hub.y}
                r="44"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="0.5"
                strokeOpacity="0.15"
                animate={{ r: [44, 52, 44] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Hub icon — server/shield */}
              <text
                x={hub.x}
                y={hub.y - 6}
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fontWeight="600"
              >
                YOUR
              </text>
              <text
                x={hub.x}
                y={hub.y + 8}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="9"
                fontFamily="var(--font-mono)"
              >
                INFRA
              </text>

              {/* Agent nodes */}
              {agents.map((agent) => {
                const isSafe = agent.status === "safe";
                const nodeColor = isSafe ? "#3b82f6" : "#ef4444";
                return (
                  <g key={agent.id}>
                    {/* Outer pulse ring for rogue */}
                    {!isSafe && (
                      <motion.circle
                        cx={agent.x}
                        cy={agent.y}
                        r="18"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1"
                        animate={{
                          r: [18, 28, 18],
                          strokeOpacity: [0.4, 0, 0.4],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    )}
                    {/* Node circle */}
                    <motion.circle
                      cx={agent.x}
                      cy={agent.y}
                      r="16"
                      fill="#0f1e36"
                      stroke={nodeColor}
                      strokeWidth="1.5"
                      animate={
                        isSafe
                          ? { strokeOpacity: [0.5, 0.8, 0.5] }
                          : { strokeOpacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }
                      }
                      transition={{
                        duration: isSafe ? 3 : 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    {/* Status dot */}
                    <circle
                      cx={agent.x + 11}
                      cy={agent.y - 11}
                      r="4"
                      fill={isSafe ? "#10b981" : "#ef4444"}
                    />
                    {/* Label */}
                    <text
                      x={agent.x}
                      y={agent.y + 30}
                      textAnchor="middle"
                      fill={isSafe ? "#94a3b8" : "#ef4444"}
                      fontSize="9"
                      fontFamily="var(--font-mono)"
                    >
                      {agent.label}
                    </text>
                    {/* Icon letter inside node */}
                    <text
                      x={agent.x}
                      y={agent.y + 4}
                      textAnchor="middle"
                      fill={nodeColor}
                      fontSize="12"
                      fontFamily="var(--font-mono)"
                      fontWeight="600"
                    >
                      {isSafe ? "AI" : "⚠"}
                    </text>
                  </g>
                );
              })}

              {/* "BLOCKED" label on rogue connection */}
              <motion.g
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <rect
                  x="228"
                  y="210"
                  width="56"
                  height="18"
                  rx="4"
                  fill="#ef4444"
                  fillOpacity="0.15"
                />
                <text
                  x="256"
                  y="222"
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                  fontWeight="600"
                >
                  BLOCKED
                </text>
              </motion.g>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
