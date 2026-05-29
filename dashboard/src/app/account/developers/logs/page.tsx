"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LogStatus = "delivered" | "failed" | "pending";

interface EventLog {
  id: string;
  event: string;
  endpoint: string;
  status: LogStatus;
  responseCode: number | null;
  duration: number | null;
  timestamp: string;
  payload: object;
  responseBody?: string;
}

const MOCK_LOGS: EventLog[] = [
  {
    id: "1",
    event: "payment.successful",
    endpoint: "https://api.acmecorp.com/webhooks/uverus",
    status: "delivered",
    responseCode: 200,
    duration: 142,
    timestamp: "2026-05-14 09:32:14",
    payload: {
      reference: "TXN-8821A",
      amount: 240000,
      currency: "NGN",
      customer: "acme@example.com",
    },
    responseBody: '{"status":"ok"}',
  },
  {
    id: "2",
    event: "payout.completed",
    endpoint: "https://api.acmecorp.com/webhooks/uverus",
    status: "delivered",
    responseCode: 200,
    duration: 98,
    timestamp: "2026-05-14 08:15:03",
    payload: { reference: "PO-20260501A", amount: 500000000, bank: "GTBank" },
    responseBody: '{"received":true}',
  },
  {
    id: "3",
    event: "payment.failed",
    endpoint: "https://hooks.zapier.com/hooks/catch/123456/abcdef",
    status: "failed",
    responseCode: 503,
    duration: 5000,
    timestamp: "2026-05-13 22:44:51",
    payload: {
      reference: "TXN-8818D",
      amount: 34000,
      reason: "Insufficient funds",
    },
    responseBody: "Service Unavailable",
  },
  {
    id: "4",
    event: "payment.successful",
    endpoint: "https://api.acmecorp.com/webhooks/uverus",
    status: "delivered",
    responseCode: 200,
    duration: 211,
    timestamp: "2026-05-13 18:10:29",
    payload: { reference: "TXN-8817E", amount: 560000, currency: "NGN" },
    responseBody: '{"status":"ok"}',
  },
  {
    id: "5",
    event: "customer.created",
    endpoint: "https://api.acmecorp.com/webhooks/uverus",
    status: "delivered",
    responseCode: 200,
    duration: 87,
    timestamp: "2026-05-13 15:05:11",
    payload: { customer_id: "cust_001", email: "newuser@example.com" },
    responseBody: '{"status":"ok"}',
  },
  {
    id: "6",
    event: "refund.initiated",
    endpoint: "https://api.acmecorp.com/webhooks/uverus",
    status: "pending",
    responseCode: null,
    duration: null,
    timestamp: "2026-05-14 10:01:00",
    payload: { reference: "REF-001", amount: 50000 },
  },
  {
    id: "7",
    event: "payment.failed",
    endpoint: "https://api.acmecorp.com/webhooks/uverus",
    status: "failed",
    responseCode: 404,
    duration: 320,
    timestamp: "2026-05-12 11:30:44",
    payload: { reference: "TXN-8800X", amount: 120000, reason: "Card expired" },
    responseBody: "Not Found",
  },
];

const statusConfig: Record<
  LogStatus,
  { label: string; icon: React.ElementType; badge: string }
> = {
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    badge:
      "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    badge: "text-red-700 bg-red-50 dark:bg-red-950/40 border-red-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    badge: "text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200",
  },
};

const ALL_EVENTS = [
  "payment.successful",
  "payment.failed",
  "payout.completed",
  "customer.created",
  "refund.initiated",
];

export default function LogsPage() {
  const [logs] = useState<EventLog[]>(MOCK_LOGS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterEvent, setFilterEvent] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.event.includes(search.toLowerCase()) ||
      l.endpoint.includes(search.toLowerCase()) ||
      l.id.includes(search);
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    const matchEvent = filterEvent === "all" || l.event === filterEvent;
    return matchSearch && matchStatus && matchEvent;
  });

  const stats = {
    total: logs.length,
    delivered: logs.filter((l) => l.status === "delivered").length,
    failed: logs.filter((l) => l.status === "failed").length,
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Logs</h1>
          <p className="text-muted-foreground mt-1">
            Webhook delivery history and payload inspector.
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2 w-fit">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Events", value: stats.total },
          {
            label: "Delivered",
            value: stats.delivered,
            className: "text-emerald-600",
          },
          { label: "Failed", value: stats.failed, className: "text-red-500" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-gradient-card rounded-xl border shadow-fintech p-4"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {s.label}
            </p>
            <p className={`text-2xl font-bold mt-1 ${s.className ?? ""}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by event or endpoint..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterEvent} onValueChange={setFilterEvent}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {ALL_EVENTS.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs */}
      <div className="bg-gradient-card rounded-xl border shadow-fintech overflow-hidden">
        {filtered.length === 0 && (
          <p className="text-center py-12 text-muted-foreground text-sm">
            No logs found.
          </p>
        )}
        {filtered.map((log) => {
          const cfg = statusConfig[log.status];
          const Icon = cfg.icon;
          const isOpen = expanded === log.id;
          return (
            <div key={log.id} className="border-b last:border-0">
              <button
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors text-left"
                onClick={() => setExpanded(isOpen ? null : log.id)}
              >
                <Badge
                  variant="outline"
                  className={`shrink-0 flex items-center gap-1 text-xs ${cfg.badge}`}
                >
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </Badge>
                <span className="font-mono text-xs font-medium shrink-0">
                  {log.event}
                </span>
                <span className="text-xs text-muted-foreground truncate flex-1 hidden sm:block">
                  {log.endpoint}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {log.timestamp}
                </span>
                {log.responseCode && (
                  <Badge
                    variant="outline"
                    className={`text-xs shrink-0 ${log.responseCode === 200 ? "text-emerald-700 border-emerald-200" : "text-red-600 border-red-200"}`}
                  >
                    {log.responseCode}
                  </Badge>
                )}
                {log.duration && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    {log.duration}ms
                  </span>
                )}
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-4 space-y-3 bg-muted/10">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">
                        Request Payload
                      </p>
                      <pre className="bg-muted/50 rounded-lg p-3 text-xs font-mono overflow-x-auto">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </div>
                    {log.responseBody && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">
                          Response Body
                        </p>
                        <pre className="bg-muted/50 rounded-lg p-3 text-xs font-mono overflow-x-auto">
                          {log.responseBody}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
