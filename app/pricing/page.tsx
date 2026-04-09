"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { PricingCards } from "@/components/marketing/pricing-cards";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const customEase = [0.16, 1, 0.3, 1] as const;

const faqs = [
  {
    question: "Do I need a credit card to start?",
    answer:
      "No. The Hobby plan includes a 14-day free trial with no credit card required. Start building in under a minute.",
  },
  {
    question: "What counts as an action?",
    answer:
      "An action is any tool call, API request, or function execution that Leash intercepts and evaluates. Read operations, write operations, and external calls each count as one action.",
  },
  {
    question: "Can I bring my own agent framework?",
    answer:
      "Yes. Leash works with any agent framework — LangChain, CrewAI, AutoGen, custom builds, MCP servers, or raw API calls. The SDK wraps your existing runtime with a single function call.",
  },
  {
    question: "Is my data encrypted?",
    answer:
      "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Audit logs are immutable and tamper-evident. We never store the content of your agent\u2019s actions — only metadata.",
  },
  {
    question: "How does the kill switch work?",
    answer:
      "When triggered, Leash immediately revokes the agent\u2019s JWT, terminates all active sessions, and cancels any pending actions. The entire process completes in under five seconds.",
  },
];

export default function PricingPage() {
  const faqRef = useRef<HTMLDivElement>(null);
  const faqInView = useInView(faqRef, { once: true, margin: "-80px" });

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        {/* Page header */}
        <div className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: customEase }}
              className="mb-4 text-center"
            >
              <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
                Simple, transparent pricing
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: customEase }}
              className="mx-auto max-w-2xl text-center text-lg text-text-secondary"
            >
              Start free. Scale as your agent workforce grows.
            </motion.p>
          </div>
        </div>

        {/* Pricing cards */}
        <PricingCards />

        {/* FAQ */}
        <div ref={faqRef} className="px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: customEase }}
              className="mb-8 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-12 sm:text-3xl"
            >
              Frequently asked questions
            </motion.h2>

            <Accordion>
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={faqInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.6,
                    ease: customEase,
                  }}
                >
                  <AccordionItem value={i}>
                    <AccordionTrigger className="text-base text-text-primary hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-text-secondary">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
