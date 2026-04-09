"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const customEase = [0.16, 1, 0.3, 1] as const;

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl"
        >
          Get early access.
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
          className="mb-10 text-base text-text-tertiary"
        >
          Founding customers get six months free and a direct line to the
          roadmap. Put your agents on a leash before they put you on notice.
        </motion.p>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 flex-1 rounded-lg border border-border-leash bg-surface text-text-primary placeholder:text-text-muted"
              />
              <Button
                type="submit"
                size="lg"
                className="h-11 shrink-0 rounded-lg bg-primary px-6 text-white hover:bg-primary/90"
              >
                Join waitlist
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.15,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10"
              >
                <Check className="h-7 w-7 text-success" />
              </motion.div>
              <p className="text-lg font-medium text-text-primary">
                You&apos;re on the list. We&apos;ll be in touch.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
