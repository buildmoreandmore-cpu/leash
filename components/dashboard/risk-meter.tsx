"use client";

import { motion } from "framer-motion";

interface RiskMeterProps {
  score: number;
  animated?: boolean;
}

export function RiskMeter({ score, animated = true }: RiskMeterProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  // Determine the fill color based on score
  const fillColor =
    clampedScore <= 30
      ? "bg-success"
      : clampedScore <= 60
        ? "bg-warning"
        : "bg-danger";

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">
          Risk Score
        </span>
        <span
          className={`text-sm font-bold tabular-nums ${
            clampedScore <= 30
              ? "text-success"
              : clampedScore <= 60
                ? "text-warning"
                : "text-danger"
          }`}
        >
          {clampedScore}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full">
        {/* Background zones */}
        <div className="absolute inset-0 flex">
          <div className="h-full w-[30%] bg-success/20" />
          <div className="h-full w-[30%] bg-warning/20" />
          <div className="h-full w-[40%] bg-danger/20" />
        </div>
        {/* Filled portion */}
        {animated ? (
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${fillColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${clampedScore}%` }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              mass: 0.8,
            }}
          />
        ) : (
          <div
            className={`absolute inset-y-0 left-0 rounded-full ${fillColor}`}
            style={{ width: `${clampedScore}%` }}
          />
        )}
      </div>
    </div>
  );
}
