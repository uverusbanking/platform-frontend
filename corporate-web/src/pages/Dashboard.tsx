import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Send,
  FileText,
  Building2,
  TrendingUp,
  CreditCard,
  MoreVertical,
  Wallet,
} from "lucide-react";
import { format } from "date-fns";

const accountBalance = {
  label: "Primary Vault",
  totalAvailable: 2482904.42,
  unclearFunds: 12400.0,
  monthlyGrowth: 14.2,
};

const quickActions = [
  { label: "Send Money", icon: Send },
  { label: "Add Sub-account", icon: CreditCard },
  { label: "Generate Statement", icon: FileText },
];

const accounts = [
  { name: "SV Logistics", code: "...9012", balance: 42000, icon: Building2 },
  { name: "Payroll Reserve", code: "...5543", balance: 128450, icon: Wallet },
];

type TxStatus = "completed" | "pending" | "failed";

const recentTransactions: {
  id: string;
  recipient: string;
  category: string;
  date: string;
  amount: number;
  status: TxStatus;
}[] = [
  { id: "tx-1", recipient: "Amazon Web Services", category: "Cloud Infrastructure", date: "2025-10-24T14:02:00Z", amount: -4280.0, status: "completed" },
  { id: "tx-2", recipient: "Stripe Global Payout", category: "SaaS Revenue", date: "2025-10-23T09:15:00Z", amount: 84500.0, status: "completed" },
  { id: "tx-3", recipient: "Jane Doe (Transfer)", category: "Q3 Bonus", date: "2025-10-22T16:45:00Z", amount: -15000.0, status: "pending" },
  { id: "tx-4", recipient: "Uber Premium Business", category: "Corporate Travel", date: "2025-10-21T21:30:00Z", amount: -242.15, status: "completed" },
];

const statusStyles: Record<TxStatus, string> = {
  completed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  failed: "bg-destructive/10 text-destructive",
};

function formatNaira(n: number) {
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n < 0 ? `-₦${formatted}` : `+₦${formatted}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] ?? "User";

  const wholePart = Math.floor(accountBalance.totalAvailable).toLocaleString("en-NG");
  const centsPart = (accountBalance.totalAvailable % 1).toFixed(2).slice(1);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Greeting */}
      <div className="pt-1">
        <h2 className="text-xl sm:text-[2rem] font-extrabold text-foreground leading-tight" style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.03em" }}>
          {getGreeting()}, {firstName}
        </h2>
      </div>

      {/* Hero row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Balance card */}
        <div className="lg:col-span-2 bg-surface-container rounded-sm p-5 sm:p-8">
          <div className="mt-1 sm:mt-2">
            <p className="text-sm text-muted-foreground mb-1">Total Available Balance</p>
            <p className="text-2xl sm:text-[3.5rem] font-extrabold text-foreground leading-none" style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.03em" }}>
              ₦{wholePart}
              <span className="text-sm sm:text-lg text-muted-foreground font-normal">{centsPart}</span>
            </p>
          </div>
          <div className="flex gap-6 sm:gap-10 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-surface-high">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">Monthly Growth</p>
              <p className="text-lg sm:text-xl font-bold text-primary mt-0.5 flex items-center gap-1.5" style={{ fontFamily: "Manrope, sans-serif" }}>
                <TrendingUp className="h-4 w-4" />
                +{accountBalance.monthlyGrowth}%
              </p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <div className="bg-surface-container rounded-sm p-4 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase mb-3 sm:mb-4">Quick Actions</p>
            <div className="space-y-1">
              {quickActions.map((a) => (
                <button key={a.label} className="w-full flex items-center justify-between py-3 px-1 text-left group hover:bg-surface-low rounded-sm transition-colors">
                  <div className="flex items-center gap-3">
                    <a.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{a.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* Accounts */}
          <div className="bg-surface-container rounded-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">Accounts</p>
              <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">View All</button>
            </div>
            <div className="space-y-3">
              {accounts.map((e) => (
                <div key={e.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-surface-low flex items-center justify-center">
                      <e.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{e.code}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-foreground" style={{ fontFamily: "Manrope, sans-serif" }}>
                    ₦{e.balance.toLocaleString("en-NG")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.01em" }}>
            Recent Activity
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs font-medium rounded-sm">Filters</Button>
            <Button variant="outline" size="sm" className="text-xs font-medium rounded-sm">Export CSV</Button>
          </div>
        </div>

        {/* Mobile: card layout */}
        <div className="block sm:hidden space-y-3">
          {recentTransactions.map((tx) => {
            const initials = tx.recipient.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
            return (
              <div key={tx.id} className="bg-surface-container rounded-sm p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-surface-low flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">{initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{tx.recipient}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{tx.category}</p>
                    </div>
                  </div>
                  <button className="p-1 rounded-sm hover:bg-surface-low transition-colors">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{format(new Date(tx.date), "MMM d, yyyy")}</p>
                    <Badge className={`${statusStyles[tx.status]} rounded-full px-2 text-[10px] border-0 uppercase tracking-wider`}>
                      {tx.status}
                    </Badge>
                  </div>
                  <p className={`text-sm font-semibold ${tx.amount >= 0 ? "text-success" : "text-foreground"}`}>
                    {formatNaira(tx.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: table layout */}
        <div className="hidden sm:block bg-surface-container rounded-sm overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-surface-low">
            <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">Recipient / Vendor</p>
            <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">Date</p>
            <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase text-right">Amount</p>
            <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">Status</p>
            <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">Action</p>
          </div>

          {recentTransactions.map((tx, i) => {
            const initials = tx.recipient.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
            return (
              <div
                key={tx.id}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-surface-low transition-colors ${
                  i < recentTransactions.length - 1 ? "border-b border-surface-high" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-surface-low flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{tx.recipient}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{tx.category}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-foreground">{format(new Date(tx.date), "MMM d, yyyy")}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(tx.date), "hh:mm a")}</p>
                </div>
                <p className={`text-sm font-semibold text-right ${tx.amount >= 0 ? "text-success" : "text-foreground"}`}>
                  {formatNaira(tx.amount)}
                </p>
                <Badge className={`${statusStyles[tx.status]} rounded-full px-2.5 text-xs border-0 w-fit uppercase tracking-wider`}>
                  {tx.status}
                </Badge>
                <button className="p-1 rounded-sm hover:bg-surface-low transition-colors">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
