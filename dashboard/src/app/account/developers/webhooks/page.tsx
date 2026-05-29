"use client";

import React, { useState } from "react";
import {
  Webhook,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Copy,
  CheckCheck,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ALL_EVENTS = [
  "payment.successful",
  "payment.failed",
  "payment.pending",
  "payout.completed",
  "payout.failed",
  "customer.created",
  "refund.initiated",
  "refund.completed",
  "dispute.opened",
  "dispute.resolved",
];

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
  successRate: number;
  lastTriggered?: string;
}

const MOCK_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: "1",
    url: "https://api.acmecorp.com/webhooks/uverus",
    events: ["payment.successful", "payment.failed", "payout.completed"],
    isActive: true,
    secret: "whsec_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890",
    successRate: 98.4,
    lastTriggered: "2026-05-14 09:32",
  },
  {
    id: "2",
    url: "https://hooks.zapier.com/hooks/catch/123456/abcdef",
    events: ["payment.successful"],
    isActive: false,
    secret: "whsec_xYzAbCdEfGhIjKlMnOpQrStUv9876543210",
    successRate: 91.2,
    lastTriggered: "2026-05-10 14:21",
  },
];

function maskSecret(s: string) {
  return s.slice(0, 10) + "•".repeat(20) + s.slice(-4);
}

export default function WebhooksPage() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>(MOCK_WEBHOOKS);
  const [showCreate, setShowCreate] = useState(false);
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(
    new Set(),
  );
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({ url: "", events: [] as string[] });

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleReveal = (id: string) => {
    setRevealedSecrets((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleActive = (id: string) =>
    setEndpoints((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isActive: !e.isActive } : e)),
    );

  const deleteEndpoint = (id: string) =>
    setEndpoints((prev) => prev.filter((e) => e.id !== id));

  const toggleEvent = (event: string) => {
    setForm((f) => ({
      ...f,
      events: f.events.includes(event)
        ? f.events.filter((e) => e !== event)
        : [...f.events, event],
    }));
  };

  const createEndpoint = () => {
    const rand = Array.from(
      { length: 32 },
      () =>
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
          Math.floor(Math.random() * 62)
        ],
    ).join("");
    const ep: WebhookEndpoint = {
      id: Date.now().toString(),
      url: form.url,
      events: form.events.length > 0 ? form.events : ALL_EVENTS,
      isActive: true,
      secret: `whsec_${rand}`,
      successRate: 100,
    };
    setEndpoints((prev) => [ep, ...prev]);
    setShowCreate(false);
    setForm({ url: "", events: [] });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
          <p className="text-muted-foreground mt-1">
            Receive real-time event notifications at your endpoints.
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" /> Add Endpoint
        </Button>
      </div>

      {endpoints.length === 0 && (
        <div className="bg-gradient-card rounded-xl border shadow-fintech p-12 text-center text-muted-foreground">
          No webhook endpoints configured yet.
        </div>
      )}

      {endpoints.map((ep) => (
        <div
          key={ep.id}
          className="bg-gradient-card rounded-xl border shadow-fintech overflow-hidden"
        >
          <div className="px-5 py-4 border-b flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <Webhook className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-sm break-all">{ep.url}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge
                    variant="outline"
                    className={`text-xs ${ep.isActive ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-muted-foreground"}`}
                  >
                    {ep.isActive ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1 inline" />
                        Inactive
                      </>
                    )}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Success rate: {ep.successRate}%
                  </span>
                  {ep.lastTriggered && (
                    <span className="text-xs text-muted-foreground">
                      Last: {ep.lastTriggered}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Switch
                checked={ep.isActive}
                onCheckedChange={() => toggleActive(ep.id)}
              />
              <button
                onClick={() => deleteEndpoint(ep.id)}
                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
              </button>
            </div>
          </div>

          <div className="px-5 py-4 space-y-3">
            {/* Secret */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-16 shrink-0">
                Secret
              </span>
              <code className="text-xs font-mono flex-1">
                {revealedSecrets.has(ep.id) ? ep.secret : maskSecret(ep.secret)}
              </code>
              <button
                onClick={() => toggleReveal(ep.id)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                {revealedSecrets.has(ep.id) ? (
                  <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => copy(ep.id, ep.secret)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                {copied === ep.id ? (
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
            </div>

            {/* Events */}
            <div>
              <span className="text-xs text-muted-foreground">Events</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {ep.events.map((ev) => (
                  <Badge
                    key={ev}
                    variant="secondary"
                    className="text-xs font-mono"
                  >
                    {ev}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" /> Add Webhook
              Endpoint
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Endpoint URL *</Label>
              <Input
                placeholder="https://your-server.com/webhook"
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Events to listen to</Label>
              <p className="text-xs text-muted-foreground">
                Leave all unchecked to receive every event.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ALL_EVENTS.map((ev) => (
                  <label
                    key={ev}
                    className="flex items-center gap-2 text-xs cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.events.includes(ev)}
                      onChange={() => toggleEvent(ev)}
                      className="rounded"
                    />
                    <span className="font-mono">{ev}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={createEndpoint} disabled={!form.url}>
              Add Endpoint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
