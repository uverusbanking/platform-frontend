"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  XCircle,
  ArrowLeft
} from "lucide-react";
import { useGetCustomerActivity, useGetCustomerById } from "@/hooks/queries/useCustomerQueries";
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
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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

export default function CustomerActivityListPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const { data: customerResponse } = useGetCustomerById(id);
  const { data, isLoading } = useGetCustomerActivity(id, {
    page,
    limit: 20,
    ...(categoryFilter !== "all" ? { actionCategory: categoryFilter } : {}),
    ...(riskFilter !== "all" ? { riskLevel: riskFilter } : {}),
  });

  const logs = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.pages ?? 1;
  const customer = customerResponse?.data;

  const handleViewDetails = (log: ICustomerActivityLog) => {
    navigate(`/account/customers/${id}/activity/${log.id}`);
  };

  const formatActionName = (action: string) => {
    return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <Button 
            variant="ghost" 
            className="group gap-2 font-bold px-0 hover:bg-transparent"
            onClick={() => navigate(`/account/customers/${id}`)}
          >
            <div className="p-2 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              Back to {customer?.first_name}'s Profile
            </span>
          </Button>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black tracking-tight">Full Activity Log</h1>
            <Badge variant="outline" className="font-bold border-primary/20 text-primary">
              {meta?.total ?? 0} Events
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-30 group-hover:opacity-100 transition-opacity" />
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group/search">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within/search:text-primary transition-colors" />
              <Input
                placeholder="Search audit trail..."
                className="pl-11 h-12 bg-muted/20 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl transition-all font-medium"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-12 bg-muted/20 border-border/40 rounded-xl font-medium">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="SECURITY">Security</SelectItem>
                  <SelectItem value="FINANCIAL">Financial</SelectItem>
                  <SelectItem value="PROFILE">Profile</SelectItem>
                  <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                  <SelectItem value="SYSTEM">System</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-12 bg-muted/20 border-border/40 rounded-xl font-medium">
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Card */}
      <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden min-h-[600px]">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-6">
                  <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-50">
              <History className="w-16 h-16" />
              <p className="text-xl font-black uppercase tracking-widest">No activities recorded</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[47px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-border/40 to-transparent" />
              <div className="divide-y divide-border/10">
                {logs.map((log, index) => {
                  const config = CATEGORY_CONFIG[log.action_category as ActionCategory] || CATEGORY_CONFIG.SYSTEM;
                  const Icon = config.icon;
                  const risk = RISK_CONFIG[log.risk_level as RiskLevel] || RISK_CONFIG.LOW;

                  return (
                    <div 
                      key={log.id} 
                      className="flex gap-6 p-8 hover:bg-muted/5 transition-all group relative animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both cursor-pointer active:scale-[0.998]"
                      style={{ animationDelay: `${index * 30}ms` }}
                      onClick={() => handleViewDetails(log)}
                    >
                      <div className="relative z-10 shrink-0">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:rotate-3 duration-500",
                          config.bgColor,
                          config.color
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-black text-foreground group-hover:text-primary transition-colors text-lg">
                              {formatActionName(log.action)}
                            </h4>
                            <Badge className={cn("text-[9px] font-black uppercase tracking-[0.15em] border-none px-2 py-0.5", risk.bgColor, risk.color)}>
                              {log.risk_level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest bg-muted/10 px-3 py-1.5 rounded-xl border border-border/20">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                        </div>

                        <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-5xl opacity-80 group-hover:opacity-100 transition-opacity">
                          {log.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
                          <div className="flex items-center gap-2.5 text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.15em]">
                            <User className="w-4 h-4 text-primary/40" />
                            <span>{log.actor_role} · {log.actor_ip}</span>
                          </div>
                          {log.user_agent && (
                            <div className="hidden md:flex items-center gap-2.5 text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.15em]">
                              <Globe className="w-4 h-4 text-primary/40" />
                              <span className="truncate max-w-[300px]">{log.user_agent}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-[11px] font-black text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 ml-auto">
                            Details
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-border/30 p-6 flex items-center justify-between bg-muted/5">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg">Page {page}</span> 
              <span>of {totalPages}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-5 text-xs font-black uppercase tracking-widest gap-2 rounded-xl border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-5 text-xs font-black uppercase tracking-widest gap-2 rounded-xl border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all"
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
