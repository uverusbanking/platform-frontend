"use client";

import { useParams, useNavigate } from "react-router-dom";
import { 
  Shield, 
  Wallet, 
  User, 
  Activity, 
  Clock, 
  Globe, 
  ArrowLeft,
  History,
  AlertTriangle,
  XCircle,
  Info,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Fingerprint
} from "lucide-react";
import { useGetCustomerActivityDetail, useGetCustomerById } from "@/hooks/queries/useCustomerQueries";
import { ActionCategory, RiskLevel } from "@/types/activity.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CATEGORY_CONFIG: Record<ActionCategory, { icon: any; color: string; bgColor: string }> = {
  SECURITY: { icon: Shield, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  FINANCIAL: { icon: Wallet, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  PROFILE: { icon: User, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  SYSTEM: { icon: Activity, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  AUTHENTICATION: { icon: Shield, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
};

const RISK_CONFIG: Record<RiskLevel, { color: string; bgColor: string; icon: any }> = {
  LOW: { color: "text-blue-500", bgColor: "bg-blue-500/10", icon: Info },
  MEDIUM: { color: "text-amber-500", bgColor: "bg-amber-500/10", icon: AlertTriangle },
  HIGH: { color: "text-orange-500", bgColor: "bg-orange-500/10", icon: AlertTriangle },
  CRITICAL: { color: "text-rose-500", bgColor: "bg-rose-500/10", icon: XCircle },
};

export default function CustomerActivityDetailPage() {
  const { id = "", activityId = "" } = useParams<{ id: string; activityId: string }>();
  const navigate = useNavigate();

  const { data: activityResponse, isLoading: isActivityLoading } = useGetCustomerActivityDetail(id, activityId);
  const { data: customerResponse } = useGetCustomerById(id);

  const log = activityResponse?.data;
  const customer = customerResponse?.data;

  const formatActionName = (action: string) => {
    return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  if (isActivityLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!log) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <History className="w-12 h-12 text-muted-foreground/30" />
        <h2 className="text-xl font-bold">Activity log not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const category = CATEGORY_CONFIG[log.action_category as ActionCategory] || CATEGORY_CONFIG.SYSTEM;
  const risk = RISK_CONFIG[log.risk_level as RiskLevel] || RISK_CONFIG.LOW;
  const Icon = category.icon;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="group gap-2 font-bold px-0 hover:bg-transparent"
          onClick={() => navigate(`/account/customers/${id}`)}
        >
          <div className="p-2 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
            Back to Customer Profile
          </span>
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-bold border-primary/20 text-primary">
            Audit ID: {log.id}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Audit View */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden">
            <CardHeader className="p-8 border-b border-border/30 bg-muted/5">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className={cn(
                  "w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl ring-4 ring-background/50",
                  category.bgColor,
                  category.color
                )}>
                  <Icon className="w-10 h-10" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black tracking-tight">{formatActionName(log.action)}</h1>
                    <Badge className={cn("font-black uppercase tracking-widest border-none px-3 py-1", risk.bgColor, risk.color)}>
                      {log.risk_level} Risk
                    </Badge>
                  </div>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                    {log.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              {/* Event Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Action Category", value: log.action_category, icon: ShieldCheck },
                  { label: "Actor Role", value: log.actor_role, icon: User },
                  { label: "IP Address", value: log.actor_ip, icon: Globe },
                  { label: "Timestamp", value: new Date(log.created_at).toLocaleString(), icon: Clock },
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                      <item.icon className="w-3.5 h-3.5 text-primary/50" />
                      {item.label}
                    </p>
                    <p className="text-sm font-black text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* State Changes Visualization */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Ledger & State Changes
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Before State</span>
                      <Badge variant="outline" className="text-[9px] border-destructive/20 text-destructive bg-destructive/5 uppercase font-bold">Historical</Badge>
                    </div>
                    <div className="bg-muted/30 border border-border/40 rounded-2xl p-6 font-mono text-xs whitespace-pre overflow-x-auto min-h-[200px] shadow-inner text-muted-foreground/80">
                      {log.before_state ? JSON.stringify(log.before_state, null, 2) : "// No previous state recorded"}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">After State</span>
                      <Badge variant="outline" className="text-[9px] border-success/20 text-success bg-success/5 uppercase font-bold">Applied</Badge>
                    </div>
                    <div className="bg-primary/[0.02] border border-primary/10 rounded-2xl p-6 font-mono text-xs whitespace-pre overflow-x-auto min-h-[200px] shadow-inner text-foreground">
                      {log.after_state ? JSON.stringify(log.after_state, null, 2) : "// No subsequent state recorded"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Footprint */}
              <div className="space-y-4 pt-4 border-t border-border/30">
                <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                  <Fingerprint className="w-4 h-4" />
                  Technical Footprint
                </h3>
                <div className="bg-muted/20 border border-border/20 rounded-2xl p-6 space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">User Agent String</p>
                      <p className="text-xs font-mono text-muted-foreground break-all leading-relaxed">
                        {log.user_agent || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Related Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/20">
                <Avatar className="h-12 w-12 rounded-xl shadow-lg">
                  <AvatarFallback className="bg-primary/10 text-primary font-black text-lg uppercase">
                    {customer?.first_name?.[0]}{customer?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-foreground truncate">
                    {customer?.first_name} {customer?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{customer?.email}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate(`/account/customers/${id}`)}
                  className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-muted-foreground uppercase tracking-widest">Enrollment Status</span>
                  <Badge className="font-black text-[10px] uppercase bg-success/10 text-success border-none">
                    {customer?.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-muted-foreground uppercase tracking-widest">KYC Level</span>
                  <span className="font-black">Tier {customer?.kyc_level}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-premium bg-gradient-to-br from-primary/10 to-transparent border border-primary/5">
            <CardContent className="p-6 space-y-4">
              <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-foreground">Immutable Ledger</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This audit record is cryptographically linked to the platform ledger and cannot be modified or deleted.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
