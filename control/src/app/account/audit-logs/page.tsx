"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Wallet,
  Building2,
  Activity,
  Clock,
  Globe,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
  History,
  AlertTriangle,
  XCircle,
  Users,
  Lock,
  FileText,
  CalendarIcon,
} from "lucide-react";
import { useGetPlatformAuditLogs } from "@/hooks/queries/usePlatformQueries";
import type {
  IAuditLog,
  AuditActionCategory,
  RiskLevel,
  AuditStatus,
  ActorLevel,
} from "@/types/activity.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const CATEGORY_CONFIG: Record<
  AuditActionCategory,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  SECURITY: { icon: Shield, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  FINANCIAL: {
    icon: Wallet,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  PLATFORM: {
    icon: Activity,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  ORGANISATION: {
    icon: Building2,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  CUSTOMER: { icon: Users, color: "text-sky-500", bgColor: "bg-sky-500/10" },
  COMPLIANCE: {
    icon: FileText,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  ADMINISTRATIVE: {
    icon: Lock,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
};

const RISK_CONFIG: Record<
  RiskLevel,
  { color: string; bgColor: string; icon: React.ElementType }
> = {
  LOW: { color: "text-blue-500", bgColor: "bg-blue-500/10", icon: Info },
  MEDIUM: {
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    icon: AlertTriangle,
  },
  HIGH: {
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    icon: AlertTriangle,
  },
  CRITICAL: {
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    icon: XCircle,
  },
};

const STATUS_CONFIG: Record<AuditStatus, { color: string; bgColor: string }> = {
  SUCCESS: { color: "text-emerald-600", bgColor: "bg-emerald-500/10" },
  FAILED: { color: "text-rose-600", bgColor: "bg-rose-500/10" },
  PENDING: { color: "text-amber-600", bgColor: "bg-amber-500/10" },
  BLOCKED: { color: "text-slate-600", bgColor: "bg-slate-500/10" },
};

const formatAction = (action: string) =>
  action
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

export default function AuditLogsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actorLevelFilter, setActorLevelFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, isLoading } = useGetPlatformAuditLogs({
    page,
    limit: 25,
    ...(categoryFilter !== "all"
      ? { actionCategory: categoryFilter as AuditActionCategory }
      : {}),
    ...(riskFilter !== "all" ? { riskLevel: riskFilter as RiskLevel } : {}),
    ...(statusFilter !== "all" ? { status: statusFilter as AuditStatus } : {}),
    ...(actorLevelFilter !== "all"
      ? { actorLevel: actorLevelFilter as ActorLevel }
      : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  });

  const logs = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 25;
  const totalPages = Math.ceil(total / pageSize) || 1;

  const resetFilters = () => {
    setCategoryFilter("all");
    setRiskFilter("all");
    setStatusFilter("all");
    setActorLevelFilter("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasActiveFilters =
    categoryFilter !== "all" ||
    riskFilter !== "all" ||
    statusFilter !== "all" ||
    actorLevelFilter !== "all" ||
    startDate ||
    endDate;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground font-medium">
            Platform-wide activity and compliance trail
          </p>
        </div>
        <Badge
          variant="outline"
          className="font-bold border-primary/20 text-primary text-sm px-4 py-1.5"
        >
          {total.toLocaleString()} Events
        </Badge>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-30 group-hover:opacity-100 transition-opacity" />
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <Select
              value={categoryFilter}
              onValueChange={(v) => {
                setCategoryFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px] h-10 bg-muted/20 border-border/40 rounded-xl font-medium">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="SECURITY">Security</SelectItem>
                <SelectItem value="FINANCIAL">Financial</SelectItem>
                <SelectItem value="PLATFORM">Platform</SelectItem>
                <SelectItem value="ORGANISATION">Organisation</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="COMPLIANCE">Compliance</SelectItem>
                <SelectItem value="ADMINISTRATIVE">Administrative</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={riskFilter}
              onValueChange={(v) => {
                setRiskFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] h-10 bg-muted/20 border-border/40 rounded-xl font-medium">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[130px] h-10 bg-muted/20 border-border/40 rounded-xl font-medium">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={actorLevelFilter}
              onValueChange={(v) => {
                setActorLevelFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px] h-10 bg-muted/20 border-border/40 rounded-xl font-medium">
                <SelectValue placeholder="Actor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actors</SelectItem>
                <SelectItem value="PLATFORM_USER">Platform User</SelectItem>
                <SelectItem value="ORGANISATION_USER">Org User</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="SYSTEM">System</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-[140px] bg-muted/20 border-border/40 rounded-xl font-medium text-sm"
              />
              <span className="text-muted-foreground text-sm">to</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-[140px] bg-muted/20 border-border/40 rounded-xl font-medium text-sm"
              />
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-10 px-4 rounded-xl text-muted-foreground hover:text-foreground"
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden min-h-[600px]">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-6">
                  <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-50">
              <History className="w-16 h-16" />
              <p className="text-xl font-black uppercase tracking-widest">
                No audit events found
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[47px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-border/40 to-transparent" />
              <div className="divide-y divide-border/10">
                {logs.map((log: IAuditLog, index: number) => {
                  const cat =
                    CATEGORY_CONFIG[log.action_category] ??
                    CATEGORY_CONFIG.ADMINISTRATIVE;
                  const Icon = cat.icon;
                  const risk = RISK_CONFIG[log.risk_level] ?? RISK_CONFIG.LOW;
                  const status =
                    STATUS_CONFIG[log.status] ?? STATUS_CONFIG.SUCCESS;

                  return (
                    <div
                      key={log.id}
                      className="flex gap-6 p-8 hover:bg-muted/5 transition-all group relative animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both cursor-pointer active:scale-[0.998]"
                      style={{ animationDelay: `${index * 20}ms` }}
                      onClick={() => navigate(`/account/audit-logs/${log.id}`)}
                    >
                      <div className="relative z-10 shrink-0">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:rotate-3 duration-500",
                            cat.bgColor,
                            cat.color,
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-2.5 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-black text-foreground group-hover:text-primary transition-colors text-base">
                              {formatAction(log.action)}
                            </h4>
                            <Badge
                              className={cn(
                                "text-[9px] font-black uppercase tracking-[0.15em] border-none px-2 py-0.5",
                                risk.bgColor,
                                risk.color,
                              )}
                            >
                              {log.risk_level}
                            </Badge>
                            <Badge
                              className={cn(
                                "text-[9px] font-black uppercase tracking-[0.15em] border-none px-2 py-0.5",
                                status.bgColor,
                                status.color,
                              )}
                            >
                              {log.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest bg-muted/10 px-3 py-1.5 rounded-xl border border-border/20 shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                          <span className="text-[11px] font-black text-muted-foreground/50 uppercase tracking-[0.15em]">
                            {log.action_category}
                          </span>
                          <span className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.15em]">
                            {log.actor_level.replace("_", " ")} ·{" "}
                            {log.actor_role}
                          </span>
                          {log.actor_ip && (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.15em]">
                              <Globe className="w-3.5 h-3.5 text-primary/40" />
                              {log.actor_ip}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-[11px] font-black text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-8px] group-hover:translate-x-0 ml-auto">
                            <Eye className="w-3.5 h-3.5" />
                            View
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>

        {totalPages > 1 && (
          <div className="border-t border-border/30 p-6 flex items-center justify-between bg-muted/5">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg">
                Page {page}
              </span>
              <span>
                of {totalPages} · {total.toLocaleString()} events
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-5 text-xs font-black uppercase tracking-widest gap-2 rounded-xl border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-5 text-xs font-black uppercase tracking-widest gap-2 rounded-xl border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
