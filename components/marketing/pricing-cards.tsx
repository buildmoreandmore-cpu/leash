"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const customEase = [0.16, 1, 0.3, 1] as const;

interface Tier {
  name: string;
  price: string;
  target: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const tiers: Tier[] = [
  {
    name: "Hobby",
    price: "$49",
    target: "Solo developers shipping side projects",
    features: [
      "1 agent",
      "10k actions/month",
      "Email support",
      "Community access",
    ],
    cta: "Start with Hobby",
  },
  {
    name: "Team",
    price: "$199",
    target: "Small teams running AI features in production",
    features: [
      "10 agents",
      "100k actions/month",
      "Slack support",
      "Approval workflows",
      "Webhook integrations",
      "Priority onboarding",
    ],
    cta: "Start with Team",
    popular: true,
  },
  {
    name: "Scale",
    price: "$999",
    target: "Growing SaaS with multiple AI products",
    features: [
      "Unlimited agents",
      "1M actions/month",
      "Priority support",
      "SSO roadmap",
      "Custom policies",
      "Dedicated account manager",
    ],
    cta: "Start with Scale",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.8,
      ease: customEase,
    },
  }),
};

export function PricingCards() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="px-6 py-24">
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
            Simple, predictable pricing
          </h2>
          <p className="mx-auto max-w-2xl text-base text-text-tertiary">
            Start free, scale when you&apos;re ready. Every plan includes the
            full Leash SDK and dashboard.
          </p>
        </motion.div>

        {/* Cards */}
        <div
          ref={ref}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileHover={{
                y: -2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`relative flex flex-col rounded-xl border p-8 ${
                tier.popular
                  ? "border-primary bg-white"
                  : "border-border-leash bg-white"
              }`}
            >
              {/* Popular badge */}
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 font-mono text-xs font-semibold text-primary-foreground">
                  Most popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold text-text-primary">
                  {tier.name}
                </h3>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight text-text-primary">
                    {tier.price}
                  </span>
                  <span className="text-sm text-text-muted">/month</span>
                </div>
                <p className="text-sm text-text-secondary">{tier.target}</p>
              </div>

              <div className="mb-8 border-t border-border-leash" />

              <ul className="mb-8 flex flex-1 flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-text-secondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard"
                className={buttonVariants({
                  variant: tier.popular ? "default" : "outline",
                  className: `w-full ${
                    !tier.popular ? "border-border-leash" : ""
                  }`,
                })}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
