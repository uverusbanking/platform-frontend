"use client";

import { useNavigate } from "react-router-dom";
import { KPICard } from "@/components/features/dashboard/KPICard";
import { useGetOrganisationStatistics } from "@/hooks/queries/useOrganisationQueries";
import { useGetFrozenFunds } from "@/hooks/queries/usePlatformQueries";
import { KPICardSkeleton } from "@/components/features/dashboard/KPICardSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
// import { AnalyticsChart } from "@/components/features/dashboard/AnalyticsChart";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Snowflake,
  Lock,
  ArrowUpDown,
  ArrowRight,
} from "lucide-react";

// Sample data for demonstration
// const transactionData = [
//   { name: "Jan", value: 2400000, deposits: 2400000, withdrawals: 1800000 },
//   { name: "Feb", value: 1398000, deposits: 1398000, withdrawals: 2100000 },
//   { name: "Mar", value: 9800000, deposits: 9800000, withdrawals: 1900000 },
//   { name: "Apr", value: 3908000, deposits: 3908000, withdrawals: 2800000 },
//   { name: "May", value: 4800000, deposits: 4800000, withdrawals: 1890000 },
//   { name: "Jun", value: 3800000, deposits: 3800000, withdrawals: 2390000 },
// ];

// const loanData = [
//   { name: "Jan", value: 120, active: 120, completed: 95 },
//   { name: "Feb", value: 135, active: 135, completed: 110 },
//   { name: "Mar", value: 142, active: 142, completed: 125 },
//   { name: "Apr", value: 158, active: 158, completed: 140 },
//   { name: "May", value: 170, active: 170, completed: 155 },
//   { name: "Jun", value: 165, active: 165, completed: 162 },
// ];

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: platformStats, isLoading: platformStatsLoading } =
    useGetOrganisationStatistics();
  const { data: frozenFundsData, isLoading: frozenFundsLoading } =
    useGetFrozenFunds({ page: 1, limit: 5 });

  const stats = platformStats?.data;
  const frozenEntries = frozenFundsData?.data || [];
  const frozenMeta = frozenFundsData?.meta;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground">
          Monitor the entire Uverus ecosystem and corporate performance.
        </p>
      </div>

      {/* KPI Cards */}
      {platformStatsLoading ? (
        <KPICardSkeleton count={7} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <KPICard
            title={"Platform Aggregate Balance"}
            value={stats?.total_balance || 0}
            change="NIL%"
            changeType="positive"
            description="vs last month"
            icon={Wallet}
          />
          <KPICard
            title="Total Organisations"
            value={stats?.total_organisations || 0}
            change="NIL%"
            changeType="positive"
            description="this month"
            icon={TrendingUp}
          />
          <KPICard
            title="Total Active Organisations"
            value={stats?.total_active_organisations || 0}
            change="NIL%"
            changeType="negative"
            description="this month"
            icon={TrendingDown}
          />
          <KPICard
            title="Total Pending Organisations"
            value={stats?.total_pending_organisations || 0}
            change="NIL"
            changeType="positive"
            description="new this month"
            icon={Users}
          />
          <KPICard
            title="Total Customers"
            value={stats?.total_customers || 0}
            change="NIL"
            changeType="positive"
            description="new customers"
            icon={Users}
          />
          <KPICard
            title="KYC Upload Rate"
            value={stats?.kyc_statistics?.upload_percentage || 0}
            change="NIL"
            changeType="positive"
            description="new companies"
            icon={Building2}
          />
          <KPICard
            title="KYC Approval Rate"
            value={stats?.kyc_statistics?.approval_percentage || 0}
            change="NIL"
            changeType="positive"
            description="new companies"
            icon={Building2}
          />
          {/* <KPICard
            title="Registered Organisations"
            value={stats.organisations}
            change="NIL"
            changeType="positive"
            description="new companies"
            icon={Building2}
          />
          <KPICard
            title="SMS Charges"
            value="₦850,000"
            change="+15.2%"
            changeType="neutral"
            description="total spend"
            icon={MessageSquare}
          />
          <KPICard
            title="E-Banking Portfolio"
            value={stats.loans}
            change="+22.1%"
            changeType="positive"
            description="portfolio value"
            icon={PiggyBank}
          />
          <KPICard
            title="Card Transactions"
            value="₦156,430,000"
            change="+18.7%"
            changeType="positive"
            description="this month"
            icon={CreditCard}
          /> */}
        </div>
      )}

      {/* Frozen Funds Summary */}
      <Card className="border-none shadow-premium bg-blue-500/5 backdrop-blur-md overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Snowflake className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-black text-base">Frozen Funds</p>
                <p className="text-xs text-muted-foreground">
                  {frozenFundsLoading
                    ? "Loading…"
                    : `${frozenMeta?.total ?? 0} frozen wallet${(frozenMeta?.total ?? 0) !== 1 ? "s" : ""} platform-wide`}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/account/wallets/frozen-funds")}
              className="rounded-xl font-bold gap-2"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {frozenFundsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : frozenEntries.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
              <Snowflake className="w-8 h-8 opacity-20" />
              <p className="text-sm font-bold">No frozen wallets</p>
            </div>
          ) : (
            <div className="space-y-2">
              {frozenEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-xl bg-muted/20 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/account/customers/${entry.customer_id}`)
                  }
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm truncate">
                      {entry.customer_name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {entry.account_number}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {entry.is_transfer_frozen && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded-lg">
                        <ArrowUpDown className="w-3 h-3" /> Transfer
                      </div>
                    )}
                    {entry.is_funding_frozen && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-500/10 px-2 py-0.5 rounded-lg">
                        <Lock className="w-3 h-3" /> Funding
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      {/* <AnalyticsChart
        title="Monthly Transaction Volume"
        description="Deposits vs Withdrawals over the last 6 months"
        data={transactionData}
        type="area"
        dataKey="deposits"
        height={350}
      /> */}

      {/* <div className="grid gap-6 md:grid-cols-1">
        <AnalyticsChart
          title="Loan Portfolio Performance"
          description="Active vs Completed loans over time"
          data={loanData}
          type="bar"
          dataKey="active"
          height={300}
        />
      </div> */}

      {/* Additional Metrics */}
      {/* <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-card p-6 rounded-lg shadow-fintech">
          <h3 className="text-lg font-semibold mb-4">Commission & Profit</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Today</span>
              <span className="font-semibold text-success">₦2,450,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">This Week</span>
              <span className="font-semibold text-success">₦15,230,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">This Month</span>
              <span className="font-semibold text-success">₦67,890,000</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-card p-6 rounded-lg shadow-fintech">
          <h3 className="text-lg font-semibold mb-4">3rd Party Services</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">SMS Balance</span>
              <span className="font-semibold">₦450,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">WhatsApp</span>
              <span className="font-semibold">₦230,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">USSD</span>
              <span className="font-semibold">₦180,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VTU</span>
              <span className="font-semibold">₦320,000</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-card p-6 rounded-lg shadow-fintech">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">New customer approved</p>
                <p className="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Large transaction pending</p>
                <p className="text-xs text-muted-foreground">12 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Loan application received</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
