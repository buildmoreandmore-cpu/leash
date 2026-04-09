"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";

const navLinks = [
  { label: "Manifesto", href: "/docs" },
];

const customEase = [0.16, 1, 0.3, 1] as const;

const navItemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.5,
      ease: customEase,
    },
  }),
};

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-surface/80 backdrop-blur-xl border-b border-border-leash"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <motion.div
          custom={0}
          variants={navItemVariants}
          initial="hidden"
          animate="visible"
        >
          <Link href="/" className="flex items-center">
            <Logo size="md" animated={false} />
          </Link>
        </motion.div>

        {/* Center link — visible on all sizes */}
        <div className="flex items-center">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.label}
              custom={i + 1}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                href={link.href}
                className="text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Spacer for layout balance */}
        <div className="w-20" />
      </div>

    </motion.nav>
  );
}
