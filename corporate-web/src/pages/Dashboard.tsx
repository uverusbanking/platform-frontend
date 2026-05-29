import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  {
    id: "tx-1",
    recipient: "Amazon Web Services",
    category: "Cloud Infrastructure",
    date: "2025-10-24T14:02:00Z",
    amount: -4280.0,
    status: "completed",
  },
  {
    id: "tx-3",
    recipient: "Jane Doe (Transfer)",
    category: "Q3 Bonus",
    date: "2025-10-22T16:45:00Z",
    amount: -15000.0,
    status: "pending",
  },
  {
    id: "tx-4",
    recipient: "Uber Premium Business",
    category: "Corporate Travel",
    date: "2025-10-21T21:30:00Z",
    amount: -242.15,
    status: "completed",
  },
];

const statusConfig: Record<
  TxStatus,
  { bg: string; color: string; label: string }
> = {
  completed: {
    bg: "rgb(var(--mint) / 0.3)",
    color: "rgb(var(--mint-deep))",
    label: "Completed",
  },
  pending: {
    bg: "rgb(var(--lemon) / 0.4)",
    color: "#7a6200",
    label: "Pending",
  },
  failed: {
    bg: "rgb(var(--soft))",
    color: "rgb(var(--brand-primary))",
    label: "Failed",
  },
};

function formatNaira(n: number) {
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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

  const wholePart = Math.floor(accountBalance.totalAvailable).toLocaleString(
    "en-NG",
  );
  const centsPart = (accountBalance.totalAvailable % 1).toFixed(2).slice(1);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">
            {format(new Date(), "EEEE, d MMMM yyyy")}
          </p>
          <h2 className="display">
            {getGreeting()}, <span className="serif-italic">{firstName}</span>
          </h2>
        </div>
        <button
          onClick={() => navigate("/payments/new")}
          className="btn-pill btn-primary shrink-0 hidden sm:inline-flex"
        >
          <Send className="h-4 w-4" />
          Send Money
        </button>
      </div>

      {/* Hero row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Balance card — dark ink */}
        <div
          className="lg:col-span-2 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-card"
          style={{ background: "rgb(var(--foreground))" }}
        >
          {/* Blue glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgb(var(--brand-primary) / 0.25) 0%, transparent 70%)",
              transform: "translate(20%, -30%)",
            }}
          />
          <p
            className="text-sm mb-3"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Total Available Balance
          </p>
          <p
            className="num leading-none mb-6"
            style={{
              color: "#fff",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontFamily: "Manrope, sans-serif",
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            ₦{wholePart}
            <span
              style={{
                fontSize: "0.35em",
                color: "rgba(255,255,255,0.5)",
                fontWeight: 400,
              }}
            >
              {centsPart}
            </span>
          </p>

          <div
            className="flex gap-8 pt-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-widest font-semibold mb-1"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Monthly Growth
              </p>
              <p
                className="flex items-center gap-1.5 text-lg font-bold"
                style={{ color: "#fff", fontFamily: "Manrope, sans-serif" }}
              >
                <TrendingUp
                  className="h-4 w-4"
                  style={{ color: "rgb(var(--mint))" }}
                />
                +{accountBalance.monthlyGrowth}%
              </p>
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-widest font-semibold mb-1"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Uncleared Funds
              </p>
              <p
                className="text-lg font-bold"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                ₦{accountBalance.unclearFunds.toLocaleString("en-NG")}
              </p>
            </div>
          </div>

          {/* 3-action grid */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            {quickActions.map((a) => (
              <button
                key={a.label}
                className="flex flex-col items-center gap-2 py-3 rounded-xl transition-colors"
                style={{ background: "rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.13)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                }
              >
                <a.icon className="h-4 w-4" style={{ color: "#fff" }} />
                <span
                  className="text-xs font-medium text-center leading-tight"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Accounts */}
          <div
            className="rounded-2xl p-4 sm:p-5 shadow-card"
            style={{ background: "rgb(var(--surface-highest))" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="eyebrow">Accounts</p>
              <button
                className="text-xs font-semibold"
                style={{ color: "rgb(var(--brand-primary))" }}
                onClick={() => navigate("/accounts")}
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {accounts.map((e) => (
                <div key={e.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-pill flex items-center justify-center shrink-0"
                      style={{ background: "rgb(var(--soft))" }}
                    >
                      <e.icon
                        className="h-4 w-4"
                        style={{ color: "rgb(var(--brand-primary))" }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "rgb(var(--foreground))" }}
                      >
                        {e.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "rgb(var(--foreground-subtle))" }}
                      >
                        {e.code}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-sm font-bold num"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    ₦{e.balance.toLocaleString("en-NG")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Growth stat */}
          <div
            className="rounded-2xl p-4 shadow-card"
            style={{ background: "rgb(var(--surface-highest))" }}
          >
            <p className="eyebrow mb-2">Performance</p>
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-pill flex items-center justify-center"
                style={{ background: "rgb(var(--mint) / 0.3)" }}
              >
                <TrendingUp
                  className="h-4 w-4"
                  style={{ color: "rgb(var(--mint-deep))" }}
                />
              </div>
              <div>
                <p
                  className="text-xs"
                  style={{ color: "rgb(var(--foreground-subtle))" }}
                >
                  Monthly growth
                </p>
                <p
                  className="text-base font-bold"
                  style={{
                    color: "rgb(var(--foreground))",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  +{accountBalance.monthlyGrowth}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3
            className="text-lg font-bold"
            style={{
              fontFamily: "Manrope, sans-serif",
              letterSpacing: "-0.01em",
              color: "rgb(var(--foreground))",
            }}
          >
            Recent Activity
          </h3>
          <div className="flex gap-2">
            <button className="btn-pill btn-outline text-xs">Filters</button>
            <button className="btn-pill btn-outline text-xs">Export CSV</button>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="block sm:hidden space-y-3">
          {recentTransactions.map((tx) => {
            const initials = tx.recipient
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase();
            const st = statusConfig[tx.status];
            return (
              <div
                key={tx.id}
                className="rounded-2xl p-4 space-y-2 shadow-card"
                style={{ background: "rgb(var(--surface-highest))" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-9 w-9 rounded-pill flex items-center justify-center shrink-0"
                      style={{ background: "rgb(var(--soft))" }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{ color: "rgb(var(--brand-primary))" }}
                      >
                        {initials}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: "rgb(var(--foreground))" }}
                      >
                        {tx.recipient}
                      </p>
                      <p
                        className="text-xs uppercase tracking-wider"
                        style={{ color: "rgb(var(--foreground-subtle))" }}
                      >
                        {tx.category}
                      </p>
                    </div>
                  </div>
                  <button className="p-1 rounded-xl">
                    <MoreVertical
                      className="h-4 w-4"
                      style={{ color: "rgb(var(--foreground-subtle))" }}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p
                      className="text-xs"
                      style={{ color: "rgb(var(--foreground-subtle))" }}
                    >
                      {format(new Date(tx.date), "MMM d, yyyy")}
                    </p>
                    <span
                      className="px-2 py-0.5 rounded-pill text-[10px] font-semibold"
                      style={{ background: st.bg, color: st.color }}
                    >
                      {st.label}
                    </span>
                  </div>
                  <p
                    className={`text-sm font-semibold num`}
                    style={{
                      color:
                        tx.amount >= 0
                          ? "rgb(var(--mint-deep))"
                          : "rgb(var(--foreground))",
                    }}
                  >
                    {formatNaira(tx.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div
          className="hidden sm:block rounded-2xl overflow-hidden shadow-card"
          style={{ background: "rgb(var(--surface-highest))" }}
        >
          <div
            className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3"
            style={{ background: "rgb(var(--surface))" }}
          >
            {["Recipient / Vendor", "Date", "Amount", "Status", "Action"].map(
              (h) => (
                <p key={h} className="eyebrow">
                  {h}
                </p>
              ),
            )}
          </div>

          {recentTransactions.map((tx, i) => {
            const initials = tx.recipient
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase();
            const st = statusConfig[tx.status];
            return (
              <div
                key={tx.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center transition-colors hover:bg-surface"
                style={{
                  borderTop: i > 0 ? "1px solid rgb(var(--border))" : undefined,
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-9 w-9 rounded-pill flex items-center justify-center shrink-0"
                    style={{ background: "rgb(var(--soft))" }}
                  >
                    <span
                      className="text-xs font-bold"
                      style={{ color: "rgb(var(--brand-primary))" }}
                    >
                      {initials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "rgb(var(--foreground))" }}
                    >
                      {tx.recipient}
                    </p>
                    <p
                      className="text-xs uppercase tracking-wider"
                      style={{ color: "rgb(var(--foreground-subtle))" }}
                    >
                      {tx.category}
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    className="text-sm"
                    style={{ color: "rgb(var(--foreground))" }}
                  >
                    {format(new Date(tx.date), "MMM d, yyyy")}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgb(var(--foreground-subtle))" }}
                  >
                    {format(new Date(tx.date), "hh:mm a")}
                  </p>
                </div>
                <p
                  className="text-sm font-semibold num text-right"
                  style={{
                    color:
                      tx.amount >= 0
                        ? "rgb(var(--mint-deep))"
                        : "rgb(var(--foreground))",
                  }}
                >
                  {formatNaira(tx.amount)}
                </p>
                <span
                  className="px-2.5 py-1 rounded-pill text-xs font-semibold w-fit"
                  style={{ background: st.bg, color: st.color }}
                >
                  {st.label}
                </span>
                <button className="p-1 rounded-xl hover:bg-surface">
                  <MoreVertical
                    className="h-4 w-4"
                    style={{ color: "rgb(var(--foreground-subtle))" }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
