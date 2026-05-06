"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Wallet, 
  User, 
  Activity, 
  Clock, 
  Globe, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Info,
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useGetCustomerActivity } from "@/hooks/queries/useCustomerQueries";
import { 
  ICustomerActivityLog, 
  ActionCategory, 
  RiskLevel 
} from "@/types/activity.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomerActivityTabProps {
  customerId: string;
}

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

export function CustomerActivityTab({ customerId }: CustomerActivityTabProps) {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading } = useGetCustomerActivity(customerId, {
    page: 1,
    limit: 8,
  });

  const logs = data?.data ?? [];
  const meta = data?.meta;

  const handleViewDetails = (log: ICustomerActivityLog) => {
    navigate(`/account/customers/${customerId}/activity/${log.id}`);
  };

  const formatActionName = (action: string) => {
    return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md py-20">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-5 bg-muted/20 rounded-full">
            <History className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-foreground">No activity found</p>
            <p className="text-sm text-muted-foreground">There are no recorded actions for this customer yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-border/30 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-widest border-primary/20 text-primary">
                {meta?.total ?? 0} Events
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[47px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-border/40 to-transparent" />

            <div className="divide-y divide-border/20">
              {logs.map((log, index) => {
                const config = CATEGORY_CONFIG[log.action_category] || CATEGORY_CONFIG.SYSTEM;
                const Icon = config.icon;
                const risk = RISK_CONFIG[log.risk_level] || RISK_CONFIG.LOW;

                return (
                  <div 
                    key={log.id} 
                    className="flex gap-6 p-6 hover:bg-muted/5 transition-all group relative animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both cursor-pointer active:scale-[0.995]"
                    style={{ animationDelay: `${index * 40}ms` }}
                    onClick={() => handleViewDetails(log)}
                  >
                    {/* Icon Column */}
                    <div className="relative z-10 shrink-0">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:rotate-3 duration-500",
                        config.bgColor,
                        config.color
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 space-y-2.5 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-black text-foreground group-hover:text-primary transition-colors text-base">
                            {formatActionName(log.action)}
                          </h4>
                          <Badge className={cn("text-[9px] font-black uppercase tracking-[0.15em] border-none px-2 py-0.5", risk.bgColor, risk.color)}>
                            {log.risk_level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest bg-muted/10 px-2 py-1 rounded-lg border border-border/20">
                          <Clock className="w-3 h-3" />
                          {new Date(log.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-4xl opacity-80 group-hover:opacity-100 transition-opacity">
                        {log.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.1em]">
                          <User className="w-3.5 h-3.5" />
                          <span>{log.actor_role} · {log.actor_ip}</span>
                        </div>
                        {log.user_agent && (
                          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.1em]">
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[200px]">{log.user_agent.split(' ')[0]}</span>
                          </div>
                        )}
                        {(log.before_state || log.after_state) && (
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                            <Eye className="w-3.5 h-3.5" />
                            View Audit Detail
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>

        <div className="border-t border-border/30 p-4 bg-muted/5">
          <Button
            variant="ghost"
            className="w-full font-black text-xs uppercase tracking-widest gap-2 hover:bg-primary/5 hover:text-primary transition-all group"
            onClick={() => navigate(`/account/customers/${customerId}/activity`)}
          >
            View All Activity Logs
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
