"use client";

import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const sizes = {
  sm: { icon: 20, text: "text-lg" },
  md: { icon: 24, text: "text-xl" },
  lg: { icon: 32, text: "text-2xl" },
} as const;

const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Stylized leash-clip / carabiner icon + "Leash" wordmark.
 *
 * The SVG draws a minimal geometric carabiner shape:
 *   - Rounded rectangular loop (the ring)
 *   - A gate/latch line across the opening
 *   - A short strap connection line below
 */
export function Logo({ size = "md", animated = true }: LogoProps) {
  const { icon, text } = sizes[size];

  // Single SVG path that traces the full carabiner shape in one stroke:
  //   - Rounded rectangle loop (open on the bottom-right)
  //   - Gate line across the opening
  //   - Strap connection line descending from the bottom
  //
  // Coordinates are authored for a 24x28 viewBox.
  const clipPath =
    "M8 22 L8 8 Q8 3 13 3 L17 3 Q22 3 22 8 L22 14" + // left side up, across top, down right side
    "M14 14 L22 14" + // gate latch across opening
    "M8 22 Q8 25 12 25 L12 28"; // bottom curve into strap line

  const pathLength = 80; // approximate total length for dash animation

  return (
    <span className="inline-flex items-center gap-2">
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 30 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {animated ? (
          <motion.path
            d={clipPath}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: pathLength, strokeDashoffset: pathLength }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
          />
        ) : (
          <path
            d={clipPath}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {animated ? (
        <motion.span
          className={`${text} font-bold tracking-[-0.02em] font-sans text-text-primary`}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.8, ease: customEase }}
        >
          Leash
        </motion.span>
      ) : (
        <span
          className={`${text} font-bold tracking-[-0.02em] font-sans text-text-primary`}
        >
          Leash
        </span>
      )}
    </span>
  );
}

export default Logo;
