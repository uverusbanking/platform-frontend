"use client";

import { useParams, useNavigate } from "react-router-dom";
import {
  Shield,
  Wallet,
  Building2,
  Activity,
  Clock,
  Globe,
  ArrowLeft,
  History,
  AlertTriangle,
  XCircle,
  Info,
  Users,
  Lock,
  FileText,
  Fingerprint,
  ChevronRight,
} from "lucide-react";
import { useGetPlatformAuditLogDetail } from "@/hooks/queries/usePlatformQueries";
import type {
  AuditActionCategory,
  RiskLevel,
  AuditStatus,
} from "@/types/activity.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function AuditLogDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: response, isLoading } = useGetPlatformAuditLogDetail(id);
  const log = response?.data;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!log) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <History className="w-12 h-12 text-muted-foreground/30" />
        <h2 className="text-xl font-bold">Audit log not found</h2>
        <Button onClick={() => navigate("/account/audit-logs")}>
          Back to Audit Logs
        </Button>
      </div>
    );
  }

  const cat =
    CATEGORY_CONFIG[log.action_category] ?? CATEGORY_CONFIG.ADMINISTRATIVE;
  const risk = RISK_CONFIG[log.risk_level] ?? RISK_CONFIG.LOW;
  const status = STATUS_CONFIG[log.status] ?? STATUS_CONFIG.SUCCESS;
  const Icon = cat.icon;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="group gap-2 font-bold px-0 hover:bg-transparent"
          onClick={() => navigate("/account/audit-logs")}
        >
          <div className="p-2 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
            Back to Audit Logs
          </span>
        </Button>
        <Badge
          variant="outline"
          className="font-bold border-primary/20 text-primary font-mono text-xs"
        >
          {log.id}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden">
            <CardHeader className="p-8 border-b border-border/30 bg-muted/5">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div
                  className={cn(
                    "w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl ring-4 ring-background/50 shrink-0",
                    cat.bgColor,
                    cat.color,
                  )}
                >
                  <Icon className="w-10 h-10" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center flex-wrap gap-3">
                    <h1 className="text-3xl font-black tracking-tight">
                      {formatAction(log.action)}
                    </h1>
                    <Badge
                      className={cn(
                        "font-black uppercase tracking-widest border-none px-3 py-1",
                        risk.bgColor,
                        risk.color,
                      )}
                    >
                      {log.risk_level} Risk
                    </Badge>
                    <Badge
                      className={cn(
                        "font-black uppercase tracking-widest border-none px-3 py-1",
                        status.bgColor,
                        status.color,
                      )}
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground font-medium">
                    {log.action_category} · {log.service_name}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-10">
              {/* Event grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    label: "Actor Level",
                    value: log.actor_level.replace(/_/g, " "),
                    icon: Users,
                  },
                  { label: "Actor Role", value: log.actor_role, icon: Lock },
                  {
                    label: "IP Address",
                    value: log.actor_ip ?? "N/A",
                    icon: Globe,
                  },
                  {
                    label: "Timestamp",
                    value: new Date(log.created_at).toLocaleString(),
                    icon: Clock,
                  },
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                      <item.icon className="w-3.5 h-3.5 text-primary/50" />
                      {item.label}
                    </p>
                    <p className="text-sm font-black text-foreground break-all">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {(log.target_type || log.target_id) && (
                <div className="grid grid-cols-2 gap-6 pt-2 border-t border-border/20">
                  {log.target_type && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        Target Type
                      </p>
                      <p className="text-sm font-black">{log.target_type}</p>
                    </div>
                  )}
                  {log.target_id && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        Target ID
                      </p>
                      <p className="text-sm font-mono text-muted-foreground break-all">
                        {log.target_id}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {log.error_message && (
                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                    Error
                  </p>
                  <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
                    {log.error_message}
                  </p>
                </div>
              )}

              {/* State changes */}
              <div className="space-y-6">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  State Changes
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Before
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] border-destructive/20 text-destructive bg-destructive/5 uppercase font-bold"
                      >
                        Historical
                      </Badge>
                    </div>
                    <div className="bg-muted/30 border border-border/40 rounded-2xl p-5 font-mono text-xs whitespace-pre overflow-x-auto min-h-[160px] shadow-inner text-muted-foreground/80">
                      {log.before_state
                        ? JSON.stringify(log.before_state, null, 2)
                        : "// No previous state"}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        After
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] border-success/20 text-success bg-success/5 uppercase font-bold"
                      >
                        Applied
                      </Badge>
                    </div>
                    <div className="bg-primary/[0.02] border border-primary/10 rounded-2xl p-5 font-mono text-xs whitespace-pre overflow-x-auto min-h-[160px] shadow-inner text-foreground">
                      {log.after_state
                        ? JSON.stringify(log.after_state, null, 2)
                        : "// No subsequent state"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical footprint */}
              <div className="space-y-4 pt-4 border-t border-border/30">
                <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                  <Fingerprint className="w-4 h-4" />
                  Technical Footprint
                </h3>
                <div className="bg-muted/20 border border-border/20 rounded-2xl p-6 space-y-4">
                  {[
                    { label: "User Agent", value: log.actor_user_agent },
                    { label: "Request ID", value: log.request_id },
                    { label: "Hash Signature", value: log.hash_signature },
                  ]
                    .filter((r) => r.value)
                    .map((r) => (
                      <div key={r.label} className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          {r.label}
                        </p>
                        <p className="text-xs font-mono text-muted-foreground break-all leading-relaxed">
                          {r.value}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md">
            <CardContent className="p-6 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Actor
              </p>
              <div className="space-y-3">
                {[
                  { label: "ID", value: log.actor_id },
                  { label: "Role", value: log.actor_role },
                  { label: "Level", value: log.actor_level.replace(/_/g, " ") },
                  ...(log.actor_organisation_id
                    ? [{ label: "Org ID", value: log.actor_organisation_id }]
                    : []),
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <span className="text-muted-foreground font-medium shrink-0">
                      {r.label}
                    </span>
                    <span className="font-black text-right font-mono text-xs break-all">
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {log.actor_id && (
            <Button
              variant="outline"
              className="w-full rounded-xl gap-2 border-border/40 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
              onClick={() =>
                navigate(`/account/audit-logs?actorId=${log.actor_id}`)
              }
            >
              All events by this actor
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}

          <Card className="border-none shadow-premium bg-gradient-to-br from-primary/10 to-transparent border border-primary/5">
            <CardContent className="p-6 space-y-4">
              <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-foreground">Immutable Ledger</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This audit record is cryptographically linked to the platform
                  ledger and cannot be modified or deleted.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
