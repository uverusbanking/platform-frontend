import { formatAccountNumber } from "@/lib/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/AppLayout";
import { Copy, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/queries/useUser";
import { useWallet } from "@/hooks/useWallet";
import { BrandConfigService } from "@shared/core";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Receive = () => {
  const { isLoading: isProfileLoading } = useUserProfile();
  const {
    wallets,
    wallet: initialWallet,
    isLoadingWallet,
    isLoadingVirtualAccount,
  } = useWallet();

  const [currentWalletIndex, setCurrentWalletIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const brandConfig = BrandConfigService.getConfigSync("personal");

  const activeWallet = wallets[currentWalletIndex] || initialWallet;
  const isLoading =
    isProfileLoading || isLoadingWallet || isLoadingVirtualAccount;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Account number copied!");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareDetails = async () => {
    if (!activeWallet) return;
    const bankName = activeWallet.bank_name || brandConfig.brandName;
    const accountNumber = activeWallet.account_number || "";
    const accountName =
      activeWallet.account_name || brandConfig.brandName + " User";
    const text = `Bank: ${bankName}\nAccount Number: ${accountNumber}\nAccount Name: ${accountName}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${brandConfig.brandName} Account`,
          text,
        });
      } catch {
        copyToClipboard(text, "share");
      }
    } else {
      copyToClipboard(text, "share");
    }
  };

  const steps = [
    {
      step: 1,
      title: "Share your account details",
      desc: `Give the sender your ${brandConfig.brandName} account number`,
    },
    {
      step: 2,
      title: "Receive bank transfer",
      desc: "The sender transfers to your virtual account from any Nigerian bank",
    },
    {
      step: 3,
      title: "Funds credited instantly",
      desc: "Money appears in your wallet within seconds",
    },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-7">
        <p className="eyebrow mb-2">Receive money</p>
        <h1 className="display text-[clamp(26px,3.5vw,44px)] m-0 leading-none">
          Your{" "}
          <span
            className="serif-italic"
            style={{ color: "rgb(var(--brand-primary))" }}
          >
            account details.
          </span>
        </h1>
        <p className="text-foreground-subtle text-sm mt-2">
          Share below to receive from any Nigerian bank
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] items-start">
        {/* Account card */}
        <div className="space-y-4">
          {isLoading ? (
            <div
              className="rounded-2xl p-7 space-y-4"
              style={{
                background: "rgb(var(--surface-highest))",
                border: "1px solid rgb(var(--surface-high))",
              }}
            >
              <Skeleton className="h-3 w-28 rounded-pill" />
              <Skeleton className="h-10 w-48 rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : (
            <>
              {/* Wallet tab switcher */}
              {wallets.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {wallets.map((w, i) => (
                    <button
                      key={w.id}
                      onClick={() => setCurrentWalletIndex(i)}
                      className={cn(
                        "px-3 py-1.5 rounded-pill text-xs font-semibold border transition-colors",
                        i === currentWalletIndex
                          ? "bg-foreground text-surface-highest border-foreground"
                          : "border-border text-foreground-subtle hover:bg-surface",
                      )}
                    >
                      {w.currency}
                    </button>
                  ))}
                </div>
              )}

              {/* Dark account card */}
              <div
                className="rounded-2xl p-6 relative overflow-hidden"
                style={{ background: "rgb(var(--foreground))", color: "#fff" }}
              >
                {/* Red blur */}
                <div
                  className="absolute -right-16 -top-16 w-52 h-52 rounded-pill pointer-events-none"
                  style={{
                    background: "rgb(var(--brand-primary))",
                    opacity: 0.4,
                    filter: "blur(60px)",
                  }}
                />

                <div className="relative">
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.14em] mb-1"
                    style={{ opacity: 0.55 }}
                  >
                    {activeWallet?.bank_name || brandConfig.brandName}
                  </p>
                  <p
                    className="font-semibold text-sm mb-5"
                    style={{ opacity: 0.8 }}
                  >
                    {activeWallet?.account_name || "Your Account"}
                  </p>

                  {/* Account number */}
                  <div
                    className="flex items-center justify-between p-4 rounded-xl mb-4"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    <div>
                      <p
                        className="text-[10px] font-medium mb-1"
                        style={{ opacity: 0.55 }}
                      >
                        Account number
                      </p>
                      <p className="num font-bold text-2xl tracking-wider">
                        {formatAccountNumber(
                          activeWallet?.account_number || "",
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          activeWallet?.account_number || "",
                          activeWallet?.id || "",
                        )
                      }
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                      style={{ background: "rgba(255,255,255,0.15)" }}
                    >
                      {copiedId === activeWallet?.id ? (
                        <Check
                          size={16}
                          style={{ color: "rgb(var(--mint))" }}
                        />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>

                  {/* Share button */}
                  <button
                    onClick={shareDetails}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-pill text-sm font-semibold transition-colors"
                    style={{ background: "rgba(255,255,255,0.12)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.18)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.12)")
                    }
                  >
                    <Share2 size={15} />
                    Share details
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* How to receive */}
        <div
          className="rounded-2xl p-5 shadow-card"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          <p className="eyebrow mb-4">How to receive</p>
          <div className="space-y-0">
            {steps.map((item, i) => (
              <div key={item.step} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="w-7 h-7 rounded-pill flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{
                      background: "rgb(var(--foreground))",
                      color: "#fff",
                    }}
                  >
                    {item.step}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="w-px flex-1 my-1"
                      style={{ background: "rgb(var(--surface-high))" }}
                    />
                  )}
                </div>
                <div
                  className={cn("min-w-0", i < steps.length - 1 ? "pb-5" : "")}
                >
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-foreground-subtle mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Receive;
