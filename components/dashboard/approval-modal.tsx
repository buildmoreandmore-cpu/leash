"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScopeBadge } from "./scope-badge";

interface ApprovalModalProps {
  open: boolean;
  onApprove: () => void;
  onDeny: () => void;
  onClose: () => void;
  agentName: string;
  action: string;
  target: string;
  scope: string;
}

export function ApprovalModal({
  open,
  onApprove,
  onDeny,
  onClose,
  agentName,
  action,
  target,
  scope,
}: ApprovalModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-md rounded-xl border border-border-leash bg-surface p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">
                    Human approval required
                  </h3>
                  <p className="text-sm text-text-muted">
                    This action requires your authorization
                  </p>
                </div>
              </div>

              {/* Details card */}
              <div className="mt-5 rounded-lg border border-border-leash bg-background/50 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">Agent</span>
                    <span className="text-sm font-medium text-text-primary">
                      {agentName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">Action</span>
                    <span className="text-sm font-mono text-text-secondary">
                      {action}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">Target</span>
                    <span className="text-sm font-mono text-text-primary">
                      {target}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">Scope</span>
                    <ScopeBadge scope={scope} />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center gap-3">
                <Button
                  onClick={onApprove}
                  className="flex-1 gap-2 bg-success text-white hover:bg-success/90"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  onClick={onDeny}
                  className="flex-1 gap-2 bg-danger text-white hover:bg-danger/90"
                >
                  <XCircle className="h-4 w-4" />
                  Deny
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
