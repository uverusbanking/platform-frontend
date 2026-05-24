"use client";

import { KPICard } from "@/components/dashboard/KPICard";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import {
  ArrowUpRight,
  TrendingUp,
  Users,
  Link2,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  XCircle,
  Wallet,
} from "lucide-react";
import { useGetOrganisationStats } from "@/hooks/queries/useOrganisationQueries";
import { KPICardSkeleton } from "@/components/dashboard/KPICardSkeleton";
import { GoLiveNotice } from "@/components/dashboard/GoLiveNotice";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/lib/routes";

const revenueData = [
  { name: "Jan", revenue: 4_200_000, transactions: 312 },
  { name: "Feb", revenue: 6_800_000, transactions: 489 },
  { name: "Mar", revenue: 5_100_000, transactions: 401 },
  { name: "Apr", revenue: 9_400_000, transactions: 634 },
  { name: "May", revenue: 8_200_000, transactions: 572 },
  { name: "Jun", revenue: 11_600_000, transactions: 821 },
  { name: "Jul", revenue: 14_300_000, transactions: 978 },
];

const channelData = [
  { name: "Card", value: 58 },
  { name: "Bank Transfer", value: 24 },
  { name: "USSD", value: 11 },
  { name: "Wallet", value: 7 },
];

const recentTransactions = [
  {
    ref: "TXN-8821A",
    customer: "Acme Corp",
    amount: "₦240,000",
    status: "success",
    time: "2 min ago",
  },
  {
    ref: "TXN-8820B",
    customer: "Bravo Ltd",
    amount: "₦85,500",
    status: "success",
    time: "14 min ago",
  },
  {
    ref: "TXN-8819C",
    customer: "Charlie Inc",
    amount: "₦1,200,000",
    status: "pending",
    time: "31 min ago",
  },
  {
    ref: "TXN-8818D",
    customer: "Delta Stores",
    amount: "₦34,000",
    status: "failed",
    time: "1 hr ago",
  },
  {
    ref: "TXN-8817E",
    customer: "Echo Ventures",
    amount: "₦560,000",
    status: "success",
    time: "2 hr ago",
  },
];

const statusConfig = {
  success: {
    label: "Success",
    icon: CheckCircle2,
    className: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "text-red-600 bg-red-50 dark:bg-red-950/40",
  },
};

export default function Dashboard() {
  const { data: statsData, isLoading: isLoadingStats } =
    useGetOrganisationStats();
  const stats = statsData?.data;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <GoLiveNotice />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Your payment operations at a glance.
          </p>
        </div>
        <Link
          to={APP_ROUTES.ACCOUNT.PAYMENT_LINKS.LIST}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Link2 className="w-4 h-4" />
          Create Payment Link
        </Link>
      </div>

      {/* KPI Cards */}
      {isLoadingStats ? (
        <KPICardSkeleton count={4} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Revenue"
            value="₦59.6M"
            change="+18.4%"
            changeType="positive"
            description="vs last month"
            icon={TrendingUp}
          />
          <KPICard
            title="Total Transactions"
            value={stats?.members?.total?.toString() ?? "4,207"}
            change="+12.1%"
            changeType="positive"
            description="this month"
            icon={ArrowUpRight}
          />
          <KPICard
            title="Active Customers"
            value={stats?.members?.active?.toString() ?? "1,842"}
            change="+5.3%"
            changeType="positive"
            description="unique payers"
            icon={Users}
          />
          <KPICard
            title="Pending Payouts"
            value="₦4.2M"
            change="3 pending"
            changeType="neutral"
            description="awaiting settlement"
            icon={Wallet}
          />
        </div>
      )}

      {/* Secondary KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Payment Links"
          value="24"
          change="8 active"
          changeType="positive"
          description="total created"
          icon={Link2}
        />
        <KPICard
          title="Success Rate"
          value="96.8%"
          change="+1.2%"
          changeType="positive"
          description="transactions completed"
          icon={CheckCircle2}
        />
        <KPICard
          title="Total Payouts"
          value="₦112.4M"
          change="+22.7%"
          changeType="positive"
          description="settled this month"
          icon={ArrowDownToLine}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart
            title="Revenue Over Time"
            description="Monthly payment volume for the last 7 months"
            data={revenueData}
            type="area"
            dataKey="revenue"
            height={300}
          />
        </div>
        <AnalyticsChart
          title="Payment Channels"
          description="Volume breakdown by channel"
          data={channelData}
          type="pie"
          dataKey="value"
          height={300}
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-gradient-card rounded-xl border shadow-fintech p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Transactions</h3>
          <Link
            to={APP_ROUTES.ACCOUNT.BANKING.TRANSACTIONS}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-1">
          {recentTransactions.map((tx) => {
            const cfg = statusConfig[tx.status as keyof typeof statusConfig];
            const Icon = cfg.icon;
            return (
              <div
                key={tx.ref}
                className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0"
              >
                <div className={`p-2 rounded-lg ${cfg.className}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.customer}</p>
                  <p className="text-xs text-muted-foreground">{tx.ref}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{tx.amount}</p>
                  <p className="text-xs text-muted-foreground">{tx.time}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${cfg.className} hidden sm:flex`}
                >
                  {cfg.label}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
