"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield,
  Key,
  Activity,
  AlertTriangle,
  Eye,
  Zap,
} from "lucide-react";

const customEase = [0.16, 1, 0.3, 1] as const;

const features = [
  {
    icon: Shield,
    title: "Agent registry",
    description:
      "Every agent gets an ID, a human owner, and declared scopes. One SDK call to register, no IT ticket required.",
  },
  {
    icon: Key,
    title: "Scoped permissions",
    description:
      "Least-privilege access enforced on every tool call. Agents only touch what you explicitly allow.",
  },
  {
    icon: Activity,
    title: "Live audit log",
    description:
      "Every action, every decision, every risk score — searchable, exportable, and ready for your next compliance review.",
  },
  {
    icon: AlertTriangle,
    title: "Anomaly detection",
    description:
      "Rule-based plus LLM-powered risk scoring flags suspicious action sequences before they cause damage.",
  },
  {
    icon: Eye,
    title: "Human approval flow",
    description:
      "Pause high-risk actions automatically. Approvers get pinged on Slack, SMS, or email. One tap to allow or deny.",
  },
  {
    icon: Zap,
    title: "Kill switch",
    description:
      "Revoke an agent mid-execution. JWT invalidated, sessions terminated, pending actions cancelled in under five seconds.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: customEase,
    },
  }),
};

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="px-6 py-24">
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
            Everything you need to govern your AI agents
          </h2>
          <p className="mx-auto max-w-2xl text-base text-text-tertiary">
            From registration to revocation, Leash gives you complete visibility
            and control over every agent in your stack.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                whileHover={{
                  y: -2,
                  boxShadow: "0 0 16px #3b82f622",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="rounded-xl border border-border-leash bg-surface p-8"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-tertiary">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
