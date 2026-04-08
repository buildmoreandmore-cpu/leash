"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Key,
  Plus,
  Copy,
  Check,
  User,
  Mail,
  Bell,
  MessageSquare,
  Smartphone,
} from "lucide-react";
import { apiKeys, type ApiKey } from "@/lib/fake-data";
import { relativeTime, generateId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function SettingsPage() {
  const [keys, setKeys] = useState<ApiKey[]>(apiKeys);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Notification preferences (local state)
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(false);

  function handleGenerateKey() {
    const newKey = `lsh_live_${generateId()}${generateId()}`;
    setGeneratedKey(newKey);
    setCopied(false);
    setDialogOpen(true);

    const keyEntry: ApiKey = {
      id: `key_${generateId()}`,
      name: `Key ${keys.length + 1}`,
      key: newKey,
      maskedKey: newKey.slice(0, 8) + "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" + newKey.slice(-4),
      createdAt: new Date(),
      lastUsed: new Date(),
      status: "active",
    };
    setKeys((prev) => [...prev, keyEntry]);
  }

  function handleCopy() {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold text-text-primary">Settings</h1>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* API Keys                                                            */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border border-border-leash bg-surface"
      >
        <div className="flex items-center justify-between border-b border-border-leash px-4 py-3">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-text-muted" />
            <h2 className="text-sm font-semibold text-text-primary">
              API Keys
            </h2>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleGenerateKey}
                />
              }
            >
              <Plus className="h-3 w-3" /> Generate new key
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>New API Key</DialogTitle>
                <DialogDescription>
                  Copy this key now. You will not be able to see it again.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 rounded-lg border border-border-leash bg-surface-hover p-3">
                <code className="flex-1 break-all text-xs text-text-primary">
                  {generatedKey}
                </code>
                <button
                  onClick={handleCopy}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-surface-hover"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4 text-text-muted" />
                  )}
                </button>
              </div>
              <DialogFooter showCloseButton />
            </DialogContent>
          </Dialog>
        </div>

        {/* Keys table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-leash bg-surface-hover text-left text-xs text-text-muted">
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Key</th>
                <th className="px-4 py-2.5 font-medium">Created</th>
                <th className="px-4 py-2.5 font-medium">Last used</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr
                  key={k.id}
                  className="border-b border-border-leash/30 transition-colors hover:bg-surface-hover"
                >
                  <td className="px-4 py-2.5 font-medium text-text-primary">
                    {k.name}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-text-secondary">
                    {k.maskedKey}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-text-muted">
                    {relativeTime(k.createdAt)}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-text-muted">
                    {relativeTime(k.lastUsed)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        k.status === "active"
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      }`}
                    >
                      {k.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* Account                                                             */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        className="rounded-xl border border-border-leash bg-surface p-4"
      >
        <h2 className="mb-4 text-sm font-semibold text-text-primary">
          Account
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-text-muted">
              <User className="h-3 w-3" /> Name
            </label>
            <Input defaultValue="Francis Martin" readOnly />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-text-muted">
              <Mail className="h-3 w-3" /> Email
            </label>
            <Input defaultValue="francis@example.com" readOnly />
          </div>
        </div>
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* Notification Preferences                                            */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
        className="rounded-xl border border-border-leash bg-surface p-4"
      >
        <h2 className="mb-4 text-sm font-semibold text-text-primary">
          Notification Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Email alerts
                </p>
                <p className="text-xs text-text-muted">
                  Receive email notifications for agent events
                </p>
              </div>
            </div>
            <Switch
              checked={emailAlerts}
              onCheckedChange={(checked) => setEmailAlerts(checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Slack alerts
                </p>
                <p className="text-xs text-text-muted">
                  Post alerts to your Slack channel
                </p>
              </div>
            </div>
            <Switch
              checked={slackAlerts}
              onCheckedChange={(checked) => setSlackAlerts(checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/10">
                <Smartphone className="h-4 w-4 text-danger" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  SMS for critical events
                </p>
                <p className="text-xs text-text-muted">
                  Get SMS alerts when kill switch fires or agents revoked
                </p>
              </div>
            </div>
            <Switch
              checked={smsAlerts}
              onCheckedChange={(checked) => setSmsAlerts(checked)}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
