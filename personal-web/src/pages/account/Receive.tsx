import { formatAccountNumber } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { AppLayout } from "@/components/AppLayout";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/queries/useUser";
import { useWallet } from "@/hooks/useWallet";
import { BrandConfigService } from "@shared/core";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const Receive = () => {
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useUserProfile();

  const {
    wallets,
    wallet: initialWallet,
    isLoadingWallet,
    virtualAccount,
    isLoadingVirtualAccount,
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

  const isLoading =
    isProfileLoading || isLoadingWallet || isLoadingVirtualAccount;
  const brandConfig = BrandConfigService.getConfigSync("personal");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const shareDetails = async () => {
    if (!profile && !activeWallet) return;

    const bankName =
      activeWallet?.bank_name || profile?.bankName || brandConfig.brandName;
    const accountNumber =
      activeWallet?.account_number || profile?.accountNumber || "";
    const accountName =
      activeWallet?.account_name ||
      profile?.accountName ||
      brandConfig.brandName + " User";

    const text = `Bank: ${bankName}\nAccount Number: ${accountNumber}\nAccount Name: ${accountName}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${brandConfig.brandName} Account`,
          text,
        });
      } catch {
        copyToClipboard(text, "Account details");
      }
    } else {
      copyToClipboard(text, "Account details");
    }
  };

  return (
    <AppLayout showHeader={false}>
      {/* Header */}
      <PageHeader title="Receive Money" />

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-lg">
        {/* Virtual Account Carousel */}
        {isLoading ? (
          <Card className="overflow-hidden">
            <div className="bg-gradient-hero p-4 sm:p-6 text-white">
              <div className="h-10 sm:h-12 bg-white/20 rounded-lg animate-pulse" />
            </div>
            <CardContent className="p-3 sm:p-4">
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ) : (
          <div className="relative group">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {wallets.map((w) => (
                  <CarouselItem
                    key={w.id}
                    className="basis-[92%] sm:basis-full"
                  >
                    <Card className="overflow-hidden border-none shadow-lg">
                      <div className="bg-gradient-hero p-4 sm:p-6 text-white">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                            <span className="font-bold text-lg sm:text-xl">
                              {brandConfig.shortBrandName.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white/70 text-xs sm:text-sm">
                              {w.bank_name || brandConfig.brandName}
                            </p>
                            <p className="font-semibold text-sm sm:text-base truncate">
                              {w.account_name || "Loading..."}
                            </p>
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur rounded-xl p-3 sm:p-4">
                          <p className="text-white/60 text-xs sm:text-sm mb-1">
                            {w.name || "Account Number"}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xl sm:text-2xl font-mono font-bold tracking-wider truncate">
                              {formatAccountNumber(w.account_number || "")}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(
                                  w.account_number,
                                  "Account number",
                                );
                              }}
                              className="p-2 sm:p-2.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors shrink-0 touch-manipulation"
                              aria-label="Copy account number"
                            >
                              <Copy size={16} className="sm:hidden" />
                              <Copy size={18} className="hidden sm:block" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-3 sm:p-4">
                        <Button
                          variant="outline"
                          className="w-full gap-2 h-11 sm:h-10"
                          onClick={shareDetails}
                        >
                          <Share2 size={16} />
                          Share Details
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {wallets.length > 1 && (
                <>
                  <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex" />
                  <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex" />
                </>
              )}
            </Carousel>

            {/* Carousel Indicators */}
            {wallets.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {wallets.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      currentWalletIndex === i
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-primary/20",
                    )}
                    aria-label={`Go to wallet ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* QR Code Card */}
        {/* <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <QrCode size={18} />
              QR Code
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Let others scan to get your account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square max-w-[200px] sm:max-w-xs mx-auto bg-muted rounded-2xl flex items-center justify-center">
              <div className="text-center p-6 sm:p-8">
                <QrCode size={60} className="text-muted-foreground mx-auto mb-3 sm:mb-4 sm:hidden" />
                <QrCode size={80} className="text-muted-foreground mx-auto mb-3 sm:mb-4 hidden sm:block" />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  QR Code feature coming soon
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Instructions */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">
              How to Receive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {[
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
            ].map((item) => (
              <div key={item.step} className="flex gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-semibold text-xs sm:text-sm">
                    {item.step}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base">
                    {item.title}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Receive;
