import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { useNotifications } from "@/hooks/useNotifications";
import { UserTier, TierLimits } from "@/hooks/useUserTier";
import { usePlatformKYC } from "@/hooks/usePlatformKYC";
import { formatCurrency, formatAccountNumber } from "@/lib/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/AppLayout";
import { TierBadge } from "@/components/dashboard/TierBadge";
import { TierUpgradeBanner } from "@/components/dashboard/TierUpgradeBanner";
import { TransactionPinBanner } from "@/components/dashboard/TransactionPinBanner";
import {
  Copy,
  Send,
  QrCode,
  History,
  Eye,
  EyeOff,
  Wifi,
  Plus,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/queries/useUser";
import { useWallet } from "@/hooks/useWallet";
import { useBalanceSocket } from "@/hooks/useBalanceSocket";
import { TransactionCard } from "@/components/TransactionCard";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const { data: profile } = useUserProfile({ refetchInterval: 5000 });
  const { data: transactionsResponse, isLoading: txLoading } = useTransactions({
    page: 1,
    limit: 10,
  });
  const { wallets, wallet: initialWallet, isLoadingWallet } = useWallet();
  const [currentWalletIndex, setCurrentWalletIndex] = useState(0);
  const activeWallet = wallets[currentWalletIndex] || initialWallet;

  const { socketBalance, balanceFlash } = useBalanceSocket({
    showToast: true,
    walletId: activeWallet?.id,
  });

  const transactions = transactionsResponse?.data || [];
  const { unreadCount } = useNotifications();
  const { currentTier: apiTier, loading: statusLoading } = usePlatformKYC();

  const currentTierLevel = apiTier?.kyc_level || 1;
  const currentTier = `tier_${currentTierLevel}` as UserTier;
  const tierLimits = apiTier
    ? ({
        tier: currentTier,
        tier_name: apiTier.limits.name,
        tier_description: "",
        max_send_per_tx: 0,
        max_receive_per_tx: 0,
        daily_send_limit: apiTier.limits.dailyLimit,
        daily_receive_limit: 0,
        monthly_limit: apiTier.limits.maxBalance,
        features: [],
      } as TierLimits)
    : undefined;

  const getTierProgress = () => (currentTierLevel / 3) * 100;
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth/login");
  }, [user, authLoading, navigate]);

  const firstName = profile?.firstName || user?.email?.split("@")[0] || "";
  const lastName = profile?.lastName || "";
  const displayName = firstName + (lastName ? " " + lastName : "");

  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const hourGreeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 17
        ? "Good afternoon"
        : "Good evening";

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-[3px] border-brand-primary border-t-transparent rounded-pill animate-spin mx-auto" />
          <p className="text-foreground-subtle text-sm">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  const displayBalance = parseFloat(
    (socketBalance !== null ? socketBalance : null) ??
      activeWallet?.balance ??
      "0",
  );

  return (
    <AppLayout>
      {/* ── Header row ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div className="min-w-0">
          <p className="eyebrow mb-2">{dateLabel}</p>
          <h1 className="display text-[clamp(26px,3.5vw,44px)] m-0 leading-none truncate">
            {hourGreeting},{" "}
            <span
              className="serif-italic"
              style={{ color: "rgb(var(--brand-primary))" }}
            >
              {firstName || "there"}
            </span>
          </h1>
          {unreadCount > 0 && (
            <p className="text-foreground-subtle text-sm mt-2">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => navigate("/account/send")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-foreground text-surface-highest text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Send size={14} />
            Send money
          </button>
        </div>
      </div>

      {/* ── Main 2-col grid ── */}
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr] items-start">
        {/* ── Left column ── */}
        <div className="space-y-5">
          {/* Balance card */}
          {isLoadingWallet ? (
            <div className="rounded-2xl bg-surface p-7 space-y-4">
              <Skeleton className="h-3 w-28 rounded-pill" />
              <Skeleton className="h-12 w-48 rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : (
            <div
              className="rounded-2xl p-7 relative overflow-hidden shadow-card"
              style={{ background: "rgb(var(--foreground))", color: "#fff" }}
            >
              {/* Red radial blur */}
              <div
                className="absolute -right-24 -top-24 w-72 h-72 rounded-pill pointer-events-none"
                style={{
                  background: "rgb(var(--brand-primary))",
                  opacity: 0.45,
                  filter: "blur(80px)",
                }}
              />

              {/* Wallet tabs */}
              {wallets.length > 1 && (
                <div className="relative flex gap-2 mb-5 flex-wrap">
                  {wallets.map((w, i) => (
                    <button
                      key={w.id}
                      onClick={() => setCurrentWalletIndex(i)}
                      className={cn(
                        "px-3 py-1 rounded-pill text-xs font-semibold transition-colors",
                        i === currentWalletIndex
                          ? "bg-white text-foreground"
                          : "bg-white/10 text-white/70 hover:bg-white/15",
                      )}
                    >
                      {w.currency}
                    </button>
                  ))}
                  <button
                    onClick={() => navigate("/account/create-wallet")}
                    className="px-3 py-1 rounded-pill text-xs font-semibold bg-white/10 text-white/50 hover:bg-white/15 transition-colors flex items-center gap-1"
                  >
                    <Plus size={11} />
                    New
                  </button>
                </div>
              )}

              {/* Balance */}
              <div className="relative flex items-start justify-between mb-6">
                <div className="min-w-0">
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.14em] mb-2"
                    style={{ opacity: 0.55 }}
                  >
                    Available balance
                  </p>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p
                      className={cn(
                        "num text-[clamp(32px,6vw,60px)] font-bold leading-none transition-all duration-500",
                        balanceFlash ? "text-mint" : "text-white",
                      )}
                    >
                      {showBalance
                        ? formatCurrency(
                            displayBalance,
                            activeWallet?.currency ?? "NGN",
                          )
                        : "••••••"}
                    </p>
                    {balanceFlash && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-mint">
                        <Wifi size={10} />
                        Live
                      </span>
                    )}
                  </div>

                  {/* Account number chip */}
                  {activeWallet?.account_number && (
                    <div
                      className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-pill text-xs font-medium max-w-full"
                      style={{ background: "rgba(255,255,255,0.1)" }}
                    >
                      <span className="truncate opacity-60">
                        {activeWallet.bank_name || "Virtual"}
                      </span>
                      <span className="num font-semibold shrink-0">
                        {formatAccountNumber(activeWallet.account_number)}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            activeWallet.account_number,
                          );
                          toast.success("Account number copied!");
                        }}
                        className="hover:opacity-70 transition-opacity shrink-0"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="relative w-9 h-9 rounded-pill flex items-center justify-center transition-colors shrink-0"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>

              {/* 4-action grid */}
              <div className="relative grid grid-cols-4 gap-2.5">
                {[
                  { icon: Send, label: "Send", path: "/account/send" },
                  { icon: QrCode, label: "Receive", path: "/account/receive" },
                  {
                    icon: History,
                    label: "History",
                    path: "/account/transactions",
                  },
                  {
                    icon: Plus,
                    label: "New wallet",
                    path: "/account/create-wallet",
                  },
                ].map((a) => (
                  <button
                    key={a.path}
                    onClick={() => navigate(a.path)}
                    className="flex flex-col items-start gap-3 p-3 rounded-[18px] transition-colors text-left group"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.13)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.08)")
                    }
                  >
                    <div
                      className="w-8 h-8 rounded-pill flex items-center justify-center transition-transform group-active:scale-90"
                      style={{
                        background: "#fff",
                        color: "rgb(var(--foreground))",
                      }}
                    >
                      <a.icon size={14} strokeWidth={2.5} />
                    </div>
                    <span className="text-[12px] font-semibold leading-tight truncate w-full">
                      {a.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent activity */}
          <div
            className="rounded-2xl border overflow-hidden shadow-card"
            style={{
              background: "rgb(var(--surface-highest))",
              borderColor: "rgb(var(--surface-high))",
            }}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <h3 className="font-bold text-[18px] tracking-tight">
                Recent activity
              </h3>
              <button
                onClick={() => navigate("/account/transactions")}
                className="flex items-center gap-1 text-xs font-semibold text-foreground-subtle hover:text-foreground transition-colors"
              >
                See all <ChevronRight size={13} />
              </button>
            </div>

            {txLoading ? (
              <div className="px-6 pb-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-pill shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-28 rounded-pill" />
                      <Skeleton className="h-3 w-16 rounded-pill" />
                    </div>
                    <Skeleton className="h-4 w-20 rounded-pill" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <div
                  className="w-12 h-12 rounded-pill flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgb(var(--surface))" }}
                >
                  <History className="w-6 h-6 text-foreground-subtle" />
                </div>
                <p className="font-semibold text-sm mb-1">
                  No transactions yet
                </p>
                <p className="text-xs text-foreground-subtle">
                  Send or receive money to see your history here
                </p>
              </div>
            ) : (
              <div
                className="divide-y"
                style={{ borderColor: "rgb(var(--surface-high))" }}
              >
                {transactions.map((tx) => (
                  <TransactionCard key={tx.id} transaction={tx} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">
          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Transactions"
              value={String(transactions.length)}
              sub="this page"
              icon={<History size={14} />}
            />
            <StatCard
              label="Wallets"
              value={String(wallets.length)}
              sub="active"
              icon={<ArrowUpRight size={14} />}
            />
            <StatCard
              label="KYC level"
              value={`Tier ${currentTierLevel}`}
              sub={apiTier?.limits.name ?? ""}
              icon={<ArrowDownLeft size={14} />}
            />
            <StatCard
              label="Sends today"
              value="—"
              sub="no data yet"
              icon={<Send size={14} />}
            />
          </div>

          {/* Banners */}
          <TransactionPinBanner />

          {/* Tier */}
          {statusLoading ? (
            <div
              className="rounded-2xl p-5 space-y-3"
              style={{
                background: "rgb(var(--surface-highest))",
                border: "1px solid rgb(var(--surface-high))",
              }}
            >
              <Skeleton className="h-4 w-32 rounded-pill" />
              <Skeleton className="h-3 w-full rounded-pill" />
            </div>
          ) : tierLimits ? (
            <div className="space-y-3">
              <div
                className="rounded-2xl p-5 shadow-card"
                style={{
                  background: "rgb(var(--surface-highest))",
                  border: "1px solid rgb(var(--surface-high))",
                }}
              >
                <TierBadge
                  currentTier={currentTier}
                  tierLimits={tierLimits}
                  tierProgress={getTierProgress()}
                />
              </div>
              {currentTier !== "tier_3" && (
                <TierUpgradeBanner
                  currentTier={currentTier}
                  tierLimits={tierLimits}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
};

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-4 shadow-card"
      style={{
        background: "rgb(var(--surface-highest))",
        border: "1px solid rgb(var(--surface-high))",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-7 h-7 rounded-[10px] flex items-center justify-center"
          style={{ background: "rgb(var(--surface))" }}
        >
          {icon}
        </div>
      </div>
      <p className="eyebrow mb-1">{label}</p>
      <p className="num font-bold text-2xl tracking-tight leading-none">
        {value}
      </p>
      {sub && <p className="text-xs text-foreground-subtle mt-1">{sub}</p>}
    </div>
  );
}

export default Dashboard;
