"use client";

import { KPICard } from "@/components/dashboard/KPICard";
// import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import {
  Wallet,
  // TrendingUp,
  // TrendingDown,
  Users,
  Building2,
  MessageSquare,
  PiggyBank,
  CreditCard,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useGetOrganisationStats } from "@/hooks/endpoints/useOrganisationHook";
import { KPICardSkeleton } from "@/components/dashboard/KPICardSkeleton";

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
  const { data: statsData, isLoading: isLoadingStats } =
    useGetOrganisationStats();
  const stats = statsData?.data;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Monitor your financial operations and business performance in
          real-time.
        </p>
      </div>

      {/* KPI Cards */}
      {isLoadingStats ? (
        <KPICardSkeleton count={8} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <KPICard
            title="Total Members"
            value={stats?.members.total.toString() || "NIL"}
            change={`${stats?.members.active || "NIL"}`}
            changeType="positive"
            description="staff members"
            icon={Users}
          />
          <KPICard
            title="Documents"
            value={stats?.documents.total.toString() || "NIL"}
            change={`${stats?.documents.pending || "NIL"}`}
            changeType={stats?.documents.pending ? "negative" : "positive"}
            description="total uploaded"
            icon={FileText}
          />
          <KPICard
            title="KYC Level"
            value={`Tier ${stats?.kyc_level || "NIL"}`}
            change="Verified"
            changeType="positive"
            description="current status"
            icon={ShieldCheck}
          />
          <KPICard
            title="Company Settlement Balance"
            value="NIL"
            change="NIL%"
            changeType="positive"
            description="vs last month"
            icon={Wallet}
          />
          <KPICard
            title="Total Branches"
            value="NIL"
            change="NIL"
            changeType="positive"
            description="new branches"
            icon={Building2}
          />
          <KPICard
            title="SMS Charges"
            value="NIL"
            change="NIL%"
            changeType="neutral"
            description="total spend"
            icon={MessageSquare}
          />
          <KPICard
            title="Active Loans"
            value="NIL"
            change="NIL%"
            changeType="positive"
            description="portfolio value"
            icon={PiggyBank}
          />
          <KPICard
            title="Card Transactions"
            value="NIL"
            change="NIL%"
            changeType="positive"
            description="this month"
            icon={CreditCard}
          />
        </div>
      )}

      {/* Second Row KPIs */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Branches"
          value="24"
          change="+2"
          changeType="positive"
          description="new branches"
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
          title="Active Loans"
          value="₦89,560,000"
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
        />
      </div> */}

      {/* Charts */}
      {/* <AnalyticsChart
        title="Monthly Transaction Volume"
        description="Deposits vs Withdrawals over the last 6 months"
        data={transactionData}
        type="area"
        dataKey="deposits"
        height={350}
      />
      <AnalyticsChart
        title="Loan Portfolio Performance"
        description="Active vs Completed loans over time"
        data={loanData}
        type="bar"
        dataKey="active"
        height={300}
      /> */}

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
