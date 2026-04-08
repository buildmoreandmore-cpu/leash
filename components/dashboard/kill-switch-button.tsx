"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KillSwitchButtonProps {
  onKill: () => void;
  disabled?: boolean;
  killed?: boolean;
}

export function KillSwitchButton({
  onKill,
  disabled = false,
  killed = false,
}: KillSwitchButtonProps) {
  const [confirming, setConfirming] = useState(false);

  function handleConfirm() {
    onKill();
    setConfirming(false);
  }

  if (killed) {
    return (
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Button
          variant="destructive"
          disabled
          className="pointer-events-none gap-2 opacity-60"
        >
          <ShieldOff className="h-4 w-4" />
          Agent revoked
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!confirming ? (
        <motion.div
          key="trigger"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            disabled={disabled}
            onClick={() => setConfirming(true)}
            className="gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-600"
          >
            <XCircle className="h-4 w-4" />
            Kill switch
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="confirm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2"
        >
          <span className="text-sm text-text-secondary">Are you sure?</span>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="gap-2 bg-danger text-white hover:bg-danger/90"
          >
            <XCircle className="h-4 w-4" />
            Confirm revoke
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirming(false)}
            className="text-text-muted hover:text-text-secondary"
          >
            Cancel
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
