"use client";

import React, { useState } from "react";
import {
  ArrowDownToLine,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  ChevronRight,
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
import { KPICard } from "@/components/dashboard/KPICard";

type PayoutStatus = "completed" | "pending" | "failed";

interface Payout {
  id: string;
  reference: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  amount: number;
  narration: string;
  status: PayoutStatus;
  createdAt: string;
  settledAt?: string;
}

const MOCK_PAYOUTS: Payout[] = [
  {
    id: "1",
    reference: "PO-20260501A",
    bankName: "GTBank",
    accountName: "Acme Ventures Ltd",
    accountNumber: "0123456789",
    amount: 5_000_000_00,
    narration: "Weekly settlement",
    status: "completed",
    createdAt: "2026-05-01",
    settledAt: "2026-05-02",
  },
  {
    id: "2",
    reference: "PO-20260508B",
    bankName: "Zenith Bank",
    accountName: "Acme Ventures Ltd",
    accountNumber: "0123456789",
    amount: 3_200_000_00,
    narration: "April revenue",
    status: "completed",
    createdAt: "2026-05-08",
    settledAt: "2026-05-09",
  },
  {
    id: "3",
    reference: "PO-20260512C",
    bankName: "Access Bank",
    accountName: "Acme Ventures Ltd",
    accountNumber: "9876543210",
    amount: 1_500_000_00,
    narration: "Supplemental payout",
    status: "pending",
    createdAt: "2026-05-12",
  },
  {
    id: "4",
    reference: "PO-20260513D",
    bankName: "UBA",
    accountName: "Acme Ventures Ltd",
    accountNumber: "0123456789",
    amount: 800_000_00,
    narration: "Instant payout",
    status: "pending",
    createdAt: "2026-05-13",
  },
  {
    id: "5",
    reference: "PO-20260410E",
    bankName: "First Bank",
    accountName: "Acme Ventures Ltd",
    accountNumber: "1122334455",
    amount: 2_000_000_00,
    narration: "March settlement",
    status: "failed",
    createdAt: "2026-04-10",
  },
];

const BANKS = [
  "GTBank",
  "Zenith Bank",
  "Access Bank",
  "UBA",
  "First Bank",
  "Kuda",
  "Opay",
  "Wema Bank",
];

const statusConfig: Record<
  PayoutStatus,
  { label: string; icon: React.ElementType; badge: string }
> = {
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    badge:
      "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    badge: "text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    badge: "text-red-700 bg-red-50 dark:bg-red-950/40 border-red-200",
  },
};

function fmt(kobo: number) {
  return (kobo / 100).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
}

export default function PayoutsPage() {
  const [payouts] = useState<Payout[]>(MOCK_PAYOUTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showRequest, setShowRequest] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    bank: "",
    accountNumber: "",
    accountName: "",
    narration: "",
  });
  const [step, setStep] = useState<"form" | "confirm">("form");

  const filtered = payouts.filter((p) => {
    const matchSearch =
      p.reference.toLowerCase().includes(search.toLowerCase()) ||
      p.narration.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalSettled = payouts
    .filter((p) => p.status === "completed")
    .reduce((a, p) => a + p.amount, 0);
  const totalPending = payouts
    .filter((p) => p.status === "pending")
    .reduce((a, p) => a + p.amount, 0);

  const handleSubmit = () => {
    setShowRequest(false);
    setStep("form");
    setForm({
      amount: "",
      bank: "",
      accountNumber: "",
      accountName: "",
      narration: "",
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payouts</h1>
          <p className="text-muted-foreground mt-1">
            Request and track settlements to your bank account.
          </p>
        </div>
        <Button
          onClick={() => {
            setShowRequest(true);
            setStep("form");
          }}
          className="flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" /> Request Payout
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Total Settled"
          value={fmt(totalSettled)}
          changeType="positive"
          description="all time"
          icon={CheckCircle2}
        />
        <KPICard
          title="Pending"
          value={fmt(totalPending)}
          change={`${payouts.filter((p) => p.status === "pending").length} requests`}
          changeType="neutral"
          description="awaiting processing"
          icon={Clock}
        />
        <KPICard
          title="Available Balance"
          value="₦6,840,000"
          change="+₦1.2M today"
          changeType="positive"
          description="ready to withdraw"
          icon={ArrowDownToLine}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by reference or narration..."
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
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payouts table */}
      <div className="bg-gradient-card rounded-xl border shadow-fintech overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Reference
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Bank
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No payouts found.
                  </td>
                </tr>
              )}
              {filtered.map((payout) => {
                const cfg = statusConfig[payout.status];
                const Icon = cfg.icon;
                return (
                  <tr
                    key={payout.id}
                    className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium font-mono text-xs">
                        {payout.reference}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {payout.narration}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{payout.bankName}</p>
                          <p className="text-xs text-muted-foreground">
                            {payout.accountNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {fmt(payout.amount)}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">
                      {payout.createdAt}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 w-fit text-xs ${cfg.badge}`}
                      >
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Payout Dialog */}
      <Dialog
        open={showRequest}
        onOpenChange={(v) => {
          setShowRequest(v);
          if (!v) setStep("form");
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownToLine className="w-5 h-5 text-primary" />
              {step === "form" ? "Request Payout" : "Confirm Payout"}
            </DialogTitle>
          </DialogHeader>

          {step === "form" ? (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Amount (₦) *</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Available: ₦6,840,000
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>Bank *</Label>
                <Select
                  value={form.bank}
                  onValueChange={(v) => setForm((f) => ({ ...f, bank: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {BANKS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Account Number *</Label>
                <Input
                  placeholder="0123456789"
                  maxLength={10}
                  value={form.accountNumber}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, accountNumber: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Account Name</Label>
                <Input
                  placeholder="Auto-filled after verification"
                  value={form.accountName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, accountName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Narration</Label>
                <Input
                  placeholder="e.g. Weekly settlement"
                  value={form.narration}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, narration: e.target.value }))
                  }
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                {[
                  {
                    label: "Amount",
                    value: `₦${parseFloat(form.amount || "0").toLocaleString()}`,
                  },
                  { label: "Bank", value: form.bank },
                  { label: "Account", value: form.accountNumber },
                  { label: "Narration", value: form.narration || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Payouts are processed within 1–2 business days.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                step === "confirm" ? setStep("form") : setShowRequest(false)
              }
            >
              {step === "confirm" ? "Back" : "Cancel"}
            </Button>
            {step === "form" ? (
              <Button
                onClick={() => setStep("confirm")}
                disabled={!form.amount || !form.bank || !form.accountNumber}
                className="flex items-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex items-center gap-2"
              >
                <ArrowDownToLine className="w-4 h-4" /> Confirm Payout
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
