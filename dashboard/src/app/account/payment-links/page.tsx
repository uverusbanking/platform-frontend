"use client";

import React, { useState } from "react";
import {
  Link2,
  Copy,
  CheckCheck,
  Plus,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Trash2,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface PaymentLink {
  id: string;
  name: string;
  slug: string;
  amount: number | null;
  currency: string;
  isActive: boolean;
  uses: number;
  revenue: number;
  createdAt: string;
  description?: string;
}

const MOCK_LINKS: PaymentLink[] = [
  {
    id: "1",
    name: "Monthly Subscription",
    slug: "monthly-sub",
    amount: 5000_00,
    currency: "NGN",
    isActive: true,
    uses: 142,
    revenue: 710_000_00,
    createdAt: "2026-04-01",
    description: "Monthly access fee",
  },
  {
    id: "2",
    name: "Product Purchase",
    slug: "product-buy",
    amount: 25000_00,
    currency: "NGN",
    isActive: true,
    uses: 38,
    revenue: 950_000_00,
    createdAt: "2026-04-10",
  },
  {
    id: "3",
    name: "Custom Donation",
    slug: "donate-now",
    amount: null,
    currency: "NGN",
    isActive: true,
    uses: 67,
    revenue: 340_000_00,
    createdAt: "2026-04-15",
    description: "Pay what you want",
  },
  {
    id: "4",
    name: "Annual Plan",
    slug: "annual-2026",
    amount: 50000_00,
    currency: "NGN",
    isActive: false,
    uses: 12,
    revenue: 600_000_00,
    createdAt: "2026-03-20",
  },
  {
    id: "5",
    name: "Consultation Fee",
    slug: "consult-fee",
    amount: 15000_00,
    currency: "NGN",
    isActive: true,
    uses: 9,
    revenue: 135_000_00,
    createdAt: "2026-05-01",
  },
];

const BASE_URL = "https://pay.uverus.com";

function fmt(kobo: number) {
  return (kobo / 100).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
}

export default function PaymentLinksPage() {
  const [links, setLinks] = useState<PaymentLink[]>(MOCK_LINKS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    description: "",
    fixedAmount: true,
  });

  const filtered = links.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.slug.includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" ? l.isActive : !l.isActive);
    return matchSearch && matchStatus;
  });

  const copyLink = (id: string, slug: string) => {
    navigator.clipboard.writeText(`${BASE_URL}/${slug}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleActive = (id: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l)),
    );
  };

  const deleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleCreate = () => {
    const newLink: PaymentLink = {
      id: Date.now().toString(),
      name: form.name,
      slug: form.name.toLowerCase().replace(/\s+/g, "-"),
      amount:
        form.fixedAmount && form.amount ? parseFloat(form.amount) * 100 : null,
      currency: "NGN",
      isActive: true,
      uses: 0,
      revenue: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      description: form.description,
    };
    setLinks((prev) => [newLink, ...prev]);
    setShowCreate(false);
    setForm({ name: "", amount: "", description: "", fixedAmount: true });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Links</h1>
          <p className="text-muted-foreground mt-1">
            Create shareable links to collect payments.
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" /> Create Link
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Links", value: links.length },
          { label: "Active", value: links.filter((l) => l.isActive).length },
          {
            label: "Total Uses",
            value: links.reduce((a, l) => a + l.uses, 0).toLocaleString(),
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-gradient-card rounded-xl border shadow-fintech p-4"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {s.label}
            </p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search links..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Links table */}
      <div className="bg-gradient-card rounded-xl border shadow-fintech overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Link
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                  Uses
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                  Revenue
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No payment links found.
                  </td>
                </tr>
              )}
              {filtered.map((link) => (
                <tr
                  key={link.id}
                  className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{link.name}</p>
                    {link.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {link.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground font-mono">
                      /{link.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {link.amount ? (
                      <span className="font-medium">{fmt(link.amount)}</span>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Custom
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                    {link.uses}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell font-medium">
                    {fmt(link.revenue)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(link.id)}
                      className="flex items-center gap-1 text-xs"
                    >
                      {link.isActive ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-emerald-500" />
                          <span className="hidden sm:inline text-emerald-600 font-medium">
                            Active
                          </span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                          <span className="hidden sm:inline text-muted-foreground">
                            Off
                          </span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => copyLink(link.id, link.slug)}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        title="Copy link"
                      >
                        {copiedId === link.id ? (
                          <CheckCheck className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <a
                        href={`${BASE_URL}/${link.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        title="Open link"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" /> Create Payment Link
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Link Name *</Label>
              <Input
                placeholder="e.g. Product Purchase"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Fixed Amount</Label>
              <Switch
                checked={form.fixedAmount}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, fixedAmount: v }))
                }
              />
            </div>
            {form.fixedAmount && (
              <div className="space-y-1.5">
                <Label>Amount (₦)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Textarea
                placeholder="What is this payment for?"
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            {form.name && (
              <div className="bg-muted/50 rounded-lg p-3 text-xs font-mono text-muted-foreground">
                {BASE_URL}/{form.name.toLowerCase().replace(/\s+/g, "-")}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!form.name}>
              Create Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
