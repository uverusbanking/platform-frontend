"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Users,
  Zap,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KPICard } from "@/components/dashboard/KPICard";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";

const revenueByMonth = [
  { name: "Nov", revenue: 28_400_000, transactions: 1821 },
  { name: "Dec", revenue: 35_200_000, transactions: 2234 },
  { name: "Jan", revenue: 42_100_000, transactions: 2891 },
  { name: "Feb", revenue: 38_700_000, transactions: 2512 },
  { name: "Mar", revenue: 51_300_000, transactions: 3201 },
  { name: "Apr", revenue: 59_400_000, transactions: 3847 },
  { name: "May", revenue: 47_600_000, transactions: 3120 },
];

const txnByDay = [
  { name: "Mon", successful: 412, failed: 18, pending: 24 },
  { name: "Tue", successful: 538, failed: 22, pending: 31 },
  { name: "Wed", successful: 621, failed: 14, pending: 19 },
  { name: "Thu", successful: 489, failed: 31, pending: 28 },
  { name: "Fri", successful: 703, failed: 25, pending: 41 },
  { name: "Sat", successful: 334, failed: 9, pending: 15 },
  { name: "Sun", successful: 198, failed: 6, pending: 8 },
];

const channelData = [
  { name: "Card", value: 58 },
  { name: "Bank Transfer", value: 24 },
  { name: "USSD", value: 11 },
  { name: "Wallet", value: 7 },
];

const topCustomers = [
  { name: "Acme Corp", transactions: 142, revenue: 28_400_000, change: 12.4 },
  { name: "Bravo Ltd", transactions: 98, revenue: 14_700_000, change: 8.1 },
  { name: "Charlie Inc", transactions: 87, revenue: 21_300_000, change: -2.3 },
  { name: "Delta Stores", transactions: 64, revenue: 9_800_000, change: 18.7 },
  { name: "Echo Ventures", transactions: 51, revenue: 7_650_000, change: 5.2 },
];

function fmt(kobo: number) {
  return (kobo / 100).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("7d");

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Detailed insights into your payment performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value="₦59.6M"
          change="+18.4%"
          changeType="positive"
          description="vs prior period"
          icon={TrendingUp}
        />
        <KPICard
          title="Transactions"
          value="15,626"
          change="+12.1%"
          changeType="positive"
          description="completed"
          icon={CreditCard}
        />
        <KPICard
          title="Success Rate"
          value="96.8%"
          change="+1.2%"
          changeType="positive"
          description="of all attempts"
          icon={Zap}
        />
        <KPICard
          title="Unique Payers"
          value="4,821"
          change="+5.3%"
          changeType="positive"
          description="active customers"
          icon={Users}
        />
      </div>

      {/* Revenue + Channels */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart
            title="Revenue Over Time"
            description="Total payment volume by month"
            data={revenueByMonth}
            type="area"
            dataKey="revenue"
            height={300}
          />
        </div>
        <AnalyticsChart
          title="Payment Channels"
          description="Volume breakdown by method"
          data={channelData}
          type="pie"
          dataKey="value"
          height={300}
        />
      </div>

      {/* Transaction Volume (bar) */}
      <AnalyticsChart
        title="Transaction Volume by Day"
        description="Successful, failed, and pending transactions"
        data={txnByDay}
        type="bar"
        dataKey="successful"
        additionalKeys={["failed", "pending"]}
        height={260}
        colors={[
          "hsl(var(--success))",
          "hsl(var(--error))",
          "hsl(var(--warning))",
        ]}
      />

      {/* Top Customers */}
      <div className="bg-gradient-card rounded-xl border shadow-fintech overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-lg">Top Customers by Revenue</h3>
          <p className="text-sm text-muted-foreground">
            Highest spending merchants this period
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="text-right px-6 py-3 font-medium text-muted-foreground">
                  Transactions
                </th>
                <th className="text-right px-6 py-3 font-medium text-muted-foreground">
                  Revenue
                </th>
                <th className="text-right px-6 py-3 font-medium text-muted-foreground">
                  vs Prior
                </th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c, i) => (
                <tr
                  key={c.name}
                  className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-5">
                        {i + 1}
                      </span>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right text-muted-foreground">
                    {c.transactions.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-right font-semibold">
                    {fmt(c.revenue)}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span
                      className={`flex items-center justify-end gap-1 text-xs font-medium ${c.change >= 0 ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {c.change >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(c.change)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
