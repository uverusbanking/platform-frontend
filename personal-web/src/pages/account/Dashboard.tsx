import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { useNotifications } from "@/hooks/useNotifications";
import { UserTier, TierLimits } from "@/hooks/useUserTier";
import { usePlatformKYC } from "@/hooks/usePlatformKYC";
import {
  formatCurrency,
  formatAccountNumber,
  formatRelativeTime,
} from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/AppLayout";
import { TierBadge } from "@/components/dashboard/TierBadge";
import { TierUpgradeBanner } from "@/components/dashboard/TierUpgradeBanner";
import { TransactionPinBanner } from "@/components/dashboard/TransactionPinBanner";
import {
  Copy,
  Bell,
  User,
  Send,
  QrCode,
  History,
  CreditCard,
  ChevronRight,
  LogOut,
  Eye,
  EyeOff,
  ArrowDownLeft, // Added
  ArrowUpRight, // Added
} from "lucide-react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/queries/useUser";
import { useWallet } from "@/hooks/useWallet";
import { useBalanceSocket } from "@/hooks/useBalanceSocket";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();

  const {
    data: profile,
    isLoading,
    error: profileError,
  } = useUserProfile({
    refetchInterval: 5000, // Poll every 5 seconds to simulate socket
  });

  const { data: transactionsResponse, isLoading: txLoading } = useTransactions({
    page: 1,
    limit: 10,
  });

  const { wallet, isLoadingWallet, virtualAccount, isLoadingVirtualAccount } =
    useWallet();

  // Real-time balance updates via WebSocket
  const { socketBalance, balanceFlash } = useBalanceSocket({ showToast: true });

  // Safely extract transactions array
  const transactions = transactionsResponse?.data || [];
  const { unreadCount } = useNotifications();

  const { currentTier: apiTier, loading: statusLoading } = usePlatformKYC();

  const currentTierLevel = apiTier?.kyc_level || 1;
  const currentTier = `tier_${currentTierLevel}` as UserTier;

  // Construct tierLimits from API data
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

  const tierLoading = statusLoading;

  const getTierProgress = () => (currentTierLevel / 3) * 100;

  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login");
    }
  }, [user, authLoading, navigate]);

  const copyAccountNumber = () => {
    const accountNumber =
      virtualAccount?.account_number || profile?.accountNumber;
    if (accountNumber) {
      navigator.clipboard.writeText(accountNumber);
      toast.success("Account number copied!");
    } else {
      toast.error("No account number available");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/login");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout showHeader={false}>
      {/* Header */}
      <header className="bg-gradient-hero safe-top">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <User size={20} className="text-white sm:hidden" />
                <User size={24} className="text-white hidden sm:block" />
              </div>
              <div className="min-w-0">
                <p className="text-white/70 text-xs sm:text-sm">Welcome back</p>
                <p className="text-white font-semibold text-sm sm:text-base truncate">
                  {(profile?.firstName || "") +
                    " " +
                    (profile?.lastName || "") || user.email?.split("@")[0]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                className="relative p-2.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors touch-manipulation"
                onClick={() => navigate("/account/notifications")}
                aria-label="Notifications"
              >
                <Bell size={20} className="text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <button
                className="p-2.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors touch-manipulation"
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                <LogOut size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Balance Card */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/90 text-xs sm:text-sm font-medium">
                  Available Balance
                </p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1.5 hover:bg-white/10 rounded-lg touch-manipulation"
                  aria-label={showBalance ? "Hide balance" : "Show balance"}
                >
                  {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {isLoadingWallet ? (
                <Skeleton className="h-8 sm:h-10 w-48 bg-white/20" />
              ) : (
                <p
                  className={[
                    "text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 transition-all duration-500",
                    balanceFlash
                      ? "text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                      : "text-white",
                  ].join(" ")}
                >
                  {showBalance
                    ? formatCurrency(
                        parseFloat(socketBalance ?? wallet?.balance ?? "0"),
                      )
                    : "₦****.**"}
                </p>
              )}

              {/* Virtual Account Info - Prioritize platform data */}
              {isLoadingVirtualAccount ? (
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-white/10">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-24 bg-white/20" />
                    <Skeleton className="h-4 w-32 bg-white/20" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-lg bg-white/20" />
                </div>
              ) : (
                (virtualAccount?.account_number || profile?.accountNumber) && (
                  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-white/15">
                    <div className="flex-1 min-w-0">
                      <p className="text-white/60 text-[10px] sm:text-xs mb-0.5 sm:mb-1">
                        {virtualAccount?.bank_name ||
                          profile?.bankName ||
                          "Virtual Account"}
                      </p>
                      <p className="font-mono font-semibold text-sm sm:text-base truncate">
                        {formatAccountNumber(
                          virtualAccount?.account_number ||
                            profile?.accountNumber ||
                            "",
                        )}
                      </p>
                    </div>
                    <button
                      onClick={copyAccountNumber}
                      className="p-2 sm:p-2.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors shrink-0 touch-manipulation"
                      aria-label="Copy account number"
                    >
                      <Copy size={16} className="sm:hidden" />
                      <Copy size={18} className="hidden sm:block" />
                    </button>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Tier Badge Section */}
      <div className="container mx-auto px-4 sm:px-6 -mt-3 sm:-mt-4 relative z-10 max-w-4xl">
        <TransactionPinBanner />
        {tierLoading ? (
          <Card className="mb-3">
            <CardContent className="p-3">
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ) : tierLimits ? (
          <>
            <Card className="mb-3 shadow-lg">
              <CardContent className="p-3">
                <TierBadge
                  currentTier={currentTier}
                  tierLimits={tierLimits}
                  tierProgress={getTierProgress()}
                />
              </CardContent>
            </Card>

            {/* Tier Upgrade Banner */}
            {currentTier !== "tier_3" && (
              <div className="mt-3">
                <TierUpgradeBanner
                  currentTier={currentTier}
                  tierLimits={tierLimits}
                />
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <Card className="shadow-lg">
          <CardContent className="p-3 sm:p-4">
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {[
                {
                  icon: Send,
                  label: "Send",
                  path: "/account/send",
                  color: "bg-success/10",
                  iconColor: "text-success",
                },
                {
                  icon: QrCode,
                  label: "Receive",
                  path: "/account/receive",
                  color: "bg-primary/10",
                  iconColor: "text-primary",
                },
                {
                  icon: History,
                  label: "History",
                  path: "/account/transactions",
                  color: "bg-warning/10",
                  iconColor: "text-warning",
                },
                {
                  icon: CreditCard,
                  label: "Cards",
                  path: "/account/cards",
                  color: "bg-muted",
                  iconColor: "text-muted-foreground",
                  disabled: true,
                },
              ].map((action) => (
                <button
                  key={action.path}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl hover:bg-accent active:bg-accent/80 transition-colors touch-manipulation active:scale-95"
                  onClick={() => !action.disabled && navigate(action.path)}
                  disabled={action.disabled}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${action.color} flex items-center justify-center`}
                  >
                    <action.icon
                      size={18}
                      className={`${action.iconColor} sm:hidden`}
                    />
                    <action.icon
                      size={20}
                      className={`${action.iconColor} hidden sm:block`}
                    />
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-medium ${action.disabled ? "text-muted-foreground" : ""}`}
                  >
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="container mx-auto px-4 sm:px-6 mt-4 sm:mt-6 max-w-4xl">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold">
            Recent Transactions
          </h2>
          <Button
            size="sm"
            className="text-white text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            onClick={() => navigate("/account/transactions")}
          >
            See All
            <ChevronRight size={14} className="ml-0.5" />
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {txLoading ? (
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <History className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm sm:text-base">
                  No transactions yet
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Your transaction history will appear here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {transactions.map((tx) => {
                  const txType: "credit" | "debit" =
                    tx.type === "WALLET_FUNDING" ? "credit" : "debit";
                  const amount = parseFloat(tx.amount || "0");

                  // Map status
                  let mappedStatus = "pending";
                  const rawStatus = tx.status?.toLowerCase();
                  if (
                    rawStatus === "completed" ||
                    rawStatus === "success" ||
                    rawStatus === "successful"
                  ) {
                    mappedStatus = "successful";
                  } else if (rawStatus === "failed") {
                    mappedStatus = "failed";
                  } else if (rawStatus === "reversed") {
                    mappedStatus = "reversed";
                  }

                  return (
                    <button
                      key={tx.id}
                      className="w-full flex items-center gap-3 p-3 sm:p-4 hover:bg-muted/50 active:bg-muted transition-colors cursor-pointer text-left touch-manipulation"
                      onClick={() => navigate(`/account/transactions/${tx.id}`)}
                    >
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${
                          txType === "credit"
                            ? "bg-success/10"
                            : "bg-destructive/10"
                        }`}
                      >
                        {txType === "credit" ? (
                          <ArrowDownLeft
                            size={16}
                            className="text-success sm:hidden"
                          />
                        ) : (
                          <ArrowUpRight
                            size={16}
                            className="text-destructive sm:hidden"
                          />
                        )}
                        {txType === "credit" ? (
                          <ArrowDownLeft
                            size={18}
                            className="text-success hidden sm:block"
                          />
                        ) : (
                          <ArrowUpRight
                            size={18}
                            className="text-destructive hidden sm:block"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">
                          {tx.description || "Transaction"}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {formatRelativeTime(tx.createdAt)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={`font-semibold text-sm sm:text-base ${
                            txType === "credit"
                              ? "text-success"
                              : "text-foreground"
                          }`}
                        >
                          {txType === "credit" ? "+" : "-"}
                          {formatCurrency(amount)}
                        </p>
                        <p
                          className={`text-[10px] sm:text-xs capitalize ${
                            {
                              successful: "text-success",
                              success: "text-success",
                              completed: "text-success",
                              pending: "text-warning",
                              failed: "text-destructive",
                              reversed: "text-destructive",
                            }[mappedStatus] || "text-muted-foreground"
                          }`}
                        >
                          {mappedStatus}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
