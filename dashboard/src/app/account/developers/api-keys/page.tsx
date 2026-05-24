"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Copy,
  CheckCheck,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type KeyEnv = "test" | "live";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  env: KeyEnv;
  createdAt: string;
  lastUsed?: string;
}

const MOCK_KEYS: ApiKey[] = [
  {
    id: "1",
    name: "Default Test Key",
    key: "secret_test_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890",
    env: "test",
    createdAt: "2026-04-01",
    lastUsed: "2026-05-13",
  },
  {
    id: "2",
    name: "CI/CD Pipeline",
    key: "secret_test_xYzAbCdEfGhIjKlMnOpQrStUv9876543210",
    env: "test",
    createdAt: "2026-04-15",
    lastUsed: "2026-05-12",
  },
  {
    id: "3",
    name: "Production Key",
    key: "secret_live_pRoDuCtIoNkEy1234567890aBcDeFgHiJkLm",
    env: "live",
    createdAt: "2026-03-20",
    lastUsed: "2026-05-14",
  },
];

const PK_MAP: Record<KeyEnv, string> = {
  test: "pk_test_pUbLiCkEy1234567890aBcDeFgHiJkLmNoP",
  live: "pk_live_pUbLiCkEy9876543210xYzAbCdEfGhIjKlM",
};

function maskKey(key: string) {
  return key.slice(0, 12) + "•".repeat(20) + key.slice(-6);
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(MOCK_KEYS);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState<KeyEnv>("test");
  const [showCreated, setShowCreated] = useState<ApiKey | null>(null);

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleReveal = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deleteKey = (id: string) =>
    setKeys((prev) => prev.filter((k) => k.id !== id));

  const createKey = () => {
    const rand = Array.from(
      { length: 32 },
      () =>
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
          Math.floor(Math.random() * 62)
        ],
    ).join("");
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `secret_${newKeyEnv}_${rand}`,
      env: newKeyEnv,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setKeys((prev) => [newKey, ...prev]);
    setShowCreate(false);
    setNewKeyName("");
    setShowCreated(newKey);
  };

  const testKeys = keys.filter((k) => k.env === "test");
  const liveKeys = keys.filter((k) => k.env === "live");

  const KeyTable = ({ items, env }: { items: ApiKey[]; env: KeyEnv }) => (
    <div className="bg-gradient-card rounded-xl border shadow-fintech overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              env === "live"
                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                : "text-amber-700 bg-amber-50 border-amber-200"
            }
          >
            {env === "live" ? "Live" : "Test"}
          </Badge>
          <span className="font-semibold">Secret Keys</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setNewKeyEnv(env);
            setShowCreate(true);
          }}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Key
        </Button>
      </div>
      <div className="divide-y">
        {/* Public Key row */}
        <div className="flex items-center gap-3 px-5 py-3 bg-muted/20">
          <KeyRound className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-0.5">Public Key</p>
            <code className="text-xs font-mono">{maskKey(PK_MAP[env])}</code>
          </div>
          <button
            onClick={() => copy(`pk-${env}`, PK_MAP[env])}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            {copied === `pk-${env}` ? (
              <CheckCheck className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
        {items.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            No secret keys yet.
          </p>
        )}
        {items.map((k) => (
          <div
            key={k.id}
            className="flex items-center gap-3 px-5 py-3 hover:bg-muted/10 transition-colors"
          >
            <KeyRound className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{k.name}</p>
              <code className="text-xs font-mono text-muted-foreground">
                {revealed.has(k.id) ? k.key : maskKey(k.key)}
              </code>
              <p className="text-xs text-muted-foreground mt-0.5">
                Created {k.createdAt}
                {k.lastUsed ? ` · Last used ${k.lastUsed}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toggleReveal(k.id)}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                {revealed.has(k.id) ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => copy(k.id, k.key)}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                {copied === k.id ? (
                  <CheckCheck className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => deleteKey(k.id)}
                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground mt-1">
          Manage your secret and public API keys for test and live environments.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800 dark:text-amber-300">
        <strong>Keep your secret keys safe.</strong> Never share them or expose
        them in client-side code. If compromised, delete and regenerate
        immediately.
      </div>

      <KeyTable items={testKeys} env="test" />
      <KeyTable items={liveKeys} env="live" />

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Create API Key
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Key Name *</Label>
              <Input
                placeholder="e.g. Mobile App"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Environment</Label>
              <div className="flex gap-2">
                {(["test", "live"] as KeyEnv[]).map((e) => (
                  <button
                    key={e}
                    onClick={() => setNewKeyEnv(e)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${newKeyEnv === e ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted border-border"}`}
                  >
                    {e === "live" ? "Live" : "Test"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={createKey} disabled={!newKeyName}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reveal new key dialog */}
      <Dialog open={!!showCreated} onOpenChange={() => setShowCreated(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-500" /> API Key Created
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Copy this key now — it won't be shown again.
            </p>
            <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
              <code className="text-xs font-mono flex-1 break-all">
                {showCreated?.key}
              </code>
              <button
                onClick={() => showCreated && copy("new", showCreated.key)}
                className="shrink-0 p-1.5 hover:bg-muted rounded-lg"
              >
                {copied === "new" ? (
                  <CheckCheck className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowCreated(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
