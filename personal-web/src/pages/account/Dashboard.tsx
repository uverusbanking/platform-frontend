import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { useNotifications } from "@/hooks/useNotifications";
import { UserTier, TierLimits } from "@/hooks/useUserTier";
import { usePlatformKYC } from "@/hooks/usePlatformKYC";
import { formatCurrency, formatAccountNumber } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/AppLayout";
import { TierBadge } from "@/components/dashboard/TierBadge";
import { TierUpgradeBanner } from "@/components/dashboard/TierUpgradeBanner";
import { TransactionPinBanner } from "@/components/dashboard/TransactionPinBanner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Copy,
  Bell,
  Send,
  QrCode,
  History,
  CreditCard,
  ChevronRight,
  LogOut,
  Eye,
  EyeOff,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/queries/useUser";
import { useWallet } from "@/hooks/useWallet";
import { useBalanceSocket } from "@/hooks/useBalanceSocket";
import { TransactionCard } from "@/components/TransactionCard";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();

  const { data: profile } = useUserProfile({
    refetchInterval: 5000,
  });

  const { data: transactionsResponse, isLoading: txLoading } = useTransactions({
    page: 1,
    limit: 10,
  });

  const {
    wallets,
    wallet: initialWallet,
    isLoadingWallet,
  } = useWallet();

  const [api, setApi] = useState<CarouselApi>();
  const [currentWalletIndex, setCurrentWalletIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrentWalletIndex(api.selectedScrollSnap());
    });
  }, [api]);

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
    if (!authLoading && !user) {
      navigate("/auth/login");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/login");
  };

  const firstName = profile?.firstName || user?.email?.split("@")[0] || "";
  const lastName = profile?.lastName || "";
  const initials = (firstName[0] || "") + (lastName[0] || "");
  const displayName = firstName + (lastName ? " " + lastName : "");

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      icon: Send,
      label: "Send",
      path: "/account/send",
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/30",
    },
    {
      icon: QrCode,
      label: "Receive",
      path: "/account/receive",
      gradient: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/30",
    },
    {
      icon: History,
      label: "History",
      path: "/account/transactions",
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/30",
    },
    {
      icon: CreditCard,
      label: "Cards",
      path: "/account/cards",
      gradient: "from-slate-400 to-slate-500",
      shadow: "shadow-slate-400/20",
      disabled: true,
    },
  ];

  return (
    <AppLayout showHeader={false}>
      {/* ── Hero Header ── */}
      <header className="bg-gradient-hero safe-top pb-8">
        <div className="container mx-auto px-4 sm:px-6 pt-4 sm:pt-6 max-w-2xl">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            {/* Avatar + Greeting */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 shrink-0">
                  <span className="text-white font-bold text-sm uppercase tracking-wide">
                    {initials || "U"}
                  </span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white/20" />
              </div>
              <div>
                <p className="text-white/60 text-xs leading-none mb-1">Good day,</p>
                <p className="text-white font-semibold text-sm leading-tight line-clamp-1 max-w-[150px]">
                  {displayName}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                className="relative w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors flex items-center justify-center touch-manipulation"
                onClick={() => navigate("/account/notifications")}
                aria-label="Notifications"
              >
                <Bell size={18} className="text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <button
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors flex items-center justify-center touch-manipulation"
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                <LogOut size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* ── Balance Cards Carousel ── */}
          {isLoadingWallet ? (
            <div className="rounded-3xl bg-white/10 backdrop-blur-xl p-5 space-y-4">
              <Skeleton className="h-4 w-28 bg-white/20 rounded-full" />
              <Skeleton className="h-10 w-48 bg-white/20 rounded-xl" />
              <Skeleton className="h-12 w-full bg-white/10 rounded-2xl" />
            </div>
          ) : (
            <div className="relative">
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent className="-ml-2">
                  {wallets.map((w) => {
                    const isActive = activeWallet?.id === w.id;
                    const displayBalance = parseFloat(
                      (isActive ? socketBalance : null) ?? w.balance ?? "0"
                    );

                    return (
                      <CarouselItem key={w.id} className="pl-2 basis-[93%] sm:basis-full">
                        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 space-y-4 overflow-hidden relative">
                          {/* Decorative blobs */}
                          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
                          <div className="absolute -bottom-8 -left-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

                          {/* Card header */}
                          <div className="flex items-center justify-between relative">
                            <div className="flex items-center gap-2">
                              <span className="text-white/70 text-xs font-medium">
                                {w.name || "Available Balance"}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-semibold uppercase tracking-widest text-white/70">
                                {w.currency}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowBalance(!showBalance);
                              }}
                              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors touch-manipulation"
                              aria-label={showBalance ? "Hide balance" : "Show balance"}
                            >
                              {showBalance
                                ? <Eye size={14} className="text-white/80" />
                                : <EyeOff size={14} className="text-white/80" />}
                            </button>
                          </div>

                          {/* Balance */}
                          <div className="relative">
                            <p
                              className={cn(
                                "text-3xl sm:text-4xl font-extrabold tracking-tight transition-all duration-500 leading-none",
                                balanceFlash && isActive
                                  ? "text-emerald-300 drop-shadow-[0_0_16px_rgba(52,211,153,0.9)]"
                                  : "text-white"
                              )}
                            >
                              {showBalance
                                ? formatCurrency(displayBalance, w.currency)
                                : "••••••"}
                            </p>
                            {balanceFlash && isActive && (
                              <span className="absolute top-0 right-0 flex items-center gap-1 text-[10px] font-semibold text-emerald-300">
                                <Wifi size={10} />
                                Live
                              </span>
                            )}
                          </div>

                          {/* Account chip */}
                          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/10">
                            <div className="flex-1 min-w-0">
                              <p className="text-white/50 text-[10px] font-medium mb-0.5">
                                {w.bank_name || "Virtual Account"}
                              </p>
                              <p className="font-mono font-semibold text-sm text-white truncate">
                                {formatAccountNumber(w.account_number || "")}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(w.account_number);
                                toast.success("Account number copied!");
                              }}
                              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/35 flex items-center justify-center transition-colors shrink-0 touch-manipulation"
                              aria-label="Copy account number"
                            >
                              <Copy size={15} className="text-white" />
                            </button>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>

              {wallets.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-3">
                  {wallets.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => api?.scrollTo(i)}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        currentWalletIndex === i ? "w-6 bg-white" : "w-2 bg-white/30"
                      )}
                      aria-label={`Wallet ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── Content Area ── */}
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl space-y-4 pb-8">

        {/* Banners */}
        <div className="-mt-4 space-y-2 relative z-10">
          <TransactionPinBanner />
        </div>

        {/* ── Quick Actions ── */}
        <div className="bg-card border border-border rounded-3xl p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.path}
                className={cn(
                  "flex flex-col items-center gap-2 p-2 rounded-2xl transition-all duration-150 touch-manipulation active:scale-95",
                  action.disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-accent active:bg-accent/70"
                )}
                onClick={() => !action.disabled && navigate(action.path)}
                disabled={action.disabled}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                    action.gradient,
                    action.shadow
                  )}
                >
                  <action.icon size={20} className="text-white" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-medium text-foreground/80 leading-none">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tier Card ── */}
        {statusLoading ? (
          <div className="bg-card border border-border rounded-3xl p-4">
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ) : tierLimits ? (
          <div className="space-y-3">
            <div className="bg-card border border-border rounded-3xl p-4 shadow-sm">
              <TierBadge
                currentTier={currentTier}
                tierLimits={tierLimits}
                tierProgress={getTierProgress()}
              />
            </div>
            {currentTier !== "tier_3" && (
              <TierUpgradeBanner currentTier={currentTier} tierLimits={tierLimits} />
            )}
          </div>
        ) : null}

        {/* ── Recent Transactions ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-base text-foreground">Recent Transactions</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-primary text-xs font-semibold gap-0.5 hover:bg-primary/10"
              onClick={() => navigate("/account/transactions")}
            >
              See all
              <ChevronRight size={13} />
            </Button>
          </div>

          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            {txLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-28 rounded-full" />
                      <Skeleton className="h-3 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <History className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground text-sm mb-1">No transactions yet</p>
                <p className="text-xs text-muted-foreground">
                  Send or receive money to see your history here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {transactions.map((tx) => (
                  <TransactionCard key={tx.id} transaction={tx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
