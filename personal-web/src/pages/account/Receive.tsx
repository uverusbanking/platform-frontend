import { formatAccountNumber } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/PageHeader";
import { AppLayout } from "@/components/AppLayout";
import { Copy, Share2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/queries/useUser";
import { useWallet } from "@/hooks/useWallet";
import { BrandConfigService } from "@shared/core";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const Receive = () => {
  const {
    data: profile,
    isLoading: isProfileLoading,
  } = useUserProfile();

  const {
    wallets,
    wallet: initialWallet,
    isLoadingWallet,
    isLoadingVirtualAccount,
  } = useWallet();

  const [api, setApi] = useState<CarouselApi>();
  const [currentWalletIndex, setCurrentWalletIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrentWalletIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const activeWallet = wallets[currentWalletIndex] || initialWallet;
  const isLoading = isProfileLoading || isLoadingWallet || isLoadingVirtualAccount;
  const brandConfig = BrandConfigService.getConfigSync("personal");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Account number copied!");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareDetails = async () => {
    if (!profile && !activeWallet) return;

    const bankName = activeWallet?.bank_name || profile?.bankName || brandConfig.brandName;
    const accountNumber = activeWallet?.account_number || profile?.accountNumber || "";
    const accountName = activeWallet?.account_name || profile?.account_name || brandConfig.brandName + " User";

    const text = `Bank: ${bankName}\nAccount Number: ${accountNumber}\nAccount Name: ${accountName}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `My ${brandConfig.brandName} Account`, text });
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
      desc: `Give the sender your ${brandConfig.brandName} account number above`,
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
    <AppLayout showHeader={false}>
      <PageHeader title="Receive Money" />

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 max-w-lg">

        {/* Account Cards */}
        {isLoading ? (
          <div className="rounded-3xl bg-gradient-hero p-5 space-y-4">
            <Skeleton className="h-5 w-32 bg-white/20 rounded-full" />
            <Skeleton className="h-10 w-48 bg-white/20 rounded-xl" />
            <Skeleton className="h-12 w-full bg-white/10 rounded-2xl" />
          </div>
        ) : (
          <div className="relative">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent className="-ml-2">
                {wallets.map((w) => (
                  <CarouselItem key={w.id} className="pl-2 basis-[93%] sm:basis-full">
                    <div className="rounded-3xl overflow-hidden shadow-lg">
                      {/* Gradient top */}
                      <div className="bg-gradient-hero p-5 text-white relative overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                        <div className="absolute -bottom-6 -left-4 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

                        {/* Bank + name */}
                        <div className="flex items-center gap-3 mb-4 relative">
                          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                            <span className="font-bold text-lg">
                              {brandConfig.shortBrandName.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white/60 text-xs">{w.bank_name || brandConfig.brandName}</p>
                            <p className="font-semibold text-sm truncate">{w.account_name || "Loading…"}</p>
                          </div>
                        </div>

                        {/* Account number chip */}
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/10 relative">
                          <div className="flex-1 min-w-0">
                            <p className="text-white/50 text-[10px] mb-0.5">
                              {w.name || "Account Number"}
                            </p>
                            <p className="font-mono font-bold text-xl sm:text-2xl tracking-wider text-white truncate">
                              {formatAccountNumber(w.account_number || "")}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(w.account_number, w.id);
                            }}
                            className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/35 flex items-center justify-center transition-all shrink-0 touch-manipulation"
                            aria-label="Copy account number"
                          >
                            {copiedId === w.id
                              ? <CheckCircle2 size={18} className="text-emerald-300" />
                              : <Copy size={18} className="text-white" />}
                          </button>
                        </div>
                      </div>

                      {/* Share button */}
                      <div className="bg-card border-x border-b border-border rounded-b-3xl p-3">
                        <Button
                          variant="outline"
                          className="w-full gap-2 h-11 rounded-2xl font-medium"
                          onClick={shareDetails}
                        >
                          <Share2 size={16} />
                          Share Details
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {wallets.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {wallets.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      currentWalletIndex === i ? "w-6 bg-primary" : "w-2 bg-primary/20"
                    )}
                    aria-label={`Wallet ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* How to Receive */}
        <div className="bg-card border border-border rounded-3xl p-4 shadow-sm">
          <p className="font-semibold text-sm mb-4">How to Receive</p>
          <div className="space-y-4">
            {steps.map((item, i) => (
              <div key={item.step} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-xs">{item.step}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-1.5" />
                  )}
                </div>
                <div className="min-w-0 pb-4">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
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
