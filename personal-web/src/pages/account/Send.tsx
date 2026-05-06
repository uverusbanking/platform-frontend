import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandInput, CommandItem } from "@/components/ui/command";
import PageHeader from "@/components/PageHeader";
import { AppLayout } from "@/components/AppLayout";
import {
  Loader2,
  User,
  Building2,
  CheckCircle,
  Check,
  ChevronsUpDown,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { EnterPinDialog } from "@/components/TransactionPinDialog";
import { useUserProfile } from "@/hooks/queries/useUser";
import { useWallet } from "@/hooks/useWallet";
import { usePinStatus } from "@/hooks/queries/useSecurity";
import { useResolveAccount } from "@/hooks/mutations/useTransferMutations";
import { TransferService } from "@/services/transfer.service";
import { useBanks } from "@/hooks/queries/useTransfers";
import { BankListResponseDto } from "@/types";
import { BrandConfigService } from "@shared/core";

// Isolated BankList component
const BankList = ({
  banks,
  loading,
  selectedCode,
  onSelect,
}: {
  banks: BankListResponseDto[];
  loading: boolean;
  selectedCode: string;
  onSelect: (code: string) => void;
}) => {
  const [searchBank, setSearchBank] = useState("");
  const parentRef = useRef<HTMLDivElement>(null);

  const filteredBanks = banks.filter((bank) =>
    bank.bank_name.toLowerCase().includes(searchBank.toLowerCase()),
  );

  const rowVirtualizer = useVirtualizer({
    count: filteredBanks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  return (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder="Search bank..."
        value={searchBank}
        onValueChange={setSearchBank}
      />
      <div ref={parentRef} className="h-[300px] overflow-y-auto">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().length === 0 && !loading && (
            <div className="p-4 text-sm text-center text-muted-foreground w-full absolute top-0">
              No bank found.
            </div>
          )}
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const bank = filteredBanks[virtualRow.index];
            return (
              <CommandItem
                key={bank.bank_code}
                value={bank.bank_name}
                onSelect={() => onSelect(bank.bank_code)}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCode === bank.bank_code
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {bank.bank_name}
              </CommandItem>
            );
          })}
        </div>
      </div>
    </Command>
  );
};

type WizardStep = "type" | "recipient" | "amount" | "success";

const Send = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const brand = BrandConfigService.getConfigSync("personal");

  // API Queries/Mutations
  const { data: banksResponse, isLoading: loadingBanks } = useBanks();
  const { data: profile } = useUserProfile();
  const { wallets, wallet: initialWallet, isLoadingWallet } = useWallet();
  const { data: pinStatus } = usePinStatus();
  const { mutateAsync: resolveAccount } = useResolveAccount();

  // State
  const [step, setStep] = useState<WizardStep>("type");
  const [transferType, setTransferType] = useState<"internal" | "bank">("bank");
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [narration, setNarration] = useState("");
  const [loading, setLoading] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [openBankSelect, setOpenBankSelect] = useState(false);

  // Wallet Selection (Carousel)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentWalletIndex, setCurrentWalletIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("select", () => {
      setCurrentWalletIndex(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const activeWallet = wallets[currentWalletIndex] || initialWallet;
  const banks = banksResponse?.data || [];

  // Helper for verification
  const lookupAccountName = async (num: string, bCode: string) => {
    if (num.length !== 10 || !bCode) return;

    setLookingUp(true);
    setAccountName("");

    try {
      const data = await resolveAccount({
        bank_code: bCode,
        account_number: num,
      });
      setAccountName(data.account_name);
      toast.success("Account verified");
    } catch (error: any) {
      toast.error(error.message || "Could not verify account");
    } finally {
      setLookingUp(false);
    }
  };

  useEffect(() => {
    if (transferType === "internal") {
      // Find Wema Bank code or similar if possible, but the curl just uses account number
      // Assuming internal transfer doesn't need bankCode or has a fixed one
      setBankCode("000017"); // Example fixed bank code for internal
    }
  }, [transferType]);

  const handleNextStep = () => {
    if (step === "type") setStep("recipient");
    else if (step === "recipient") setStep("amount");
  };

  const handlePrevStep = () => {
    if (step === "recipient") setStep("type");
    else if (step === "amount") setStep("recipient");
    else navigate(-1);
  };

  const executeTransfer = async (pin: string) => {
    setLoading(true);
    try {
      const amountNum = parseFloat(amount);
      let response;

      if (transferType === "bank") {
        const bankName =
          banks.find((b) => b.bank_code === bankCode)?.bank_name || "";
        response = await TransferService.initiateTransfer({
          amount: amountNum,
          bank_code: bankCode,
          bank_name: bankName,
          account_number: accountNumber,
          account_name: accountName,
          narrative: narration || `Transfer to ${accountName}`,
          pin,
        });
      } else {
        response = await TransferService.initiateInternalTransfer({
          recipient_account_number: accountNumber,
          amount: amountNum,
          narration: narration || `Internal transfer to ${accountNumber}`,
          pin,
          source_wallet_id: activeWallet?.id || "",
        });
      }

      if (response.status === "success" || response.status === "successful") {
        setTransactionDetails(response.data);
        setStep("success");
        setVerifyOpen(false);
        toast.success("Transfer successful!");
      } else {
        toast.error(response.message || "Transfer failed");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isRecipientValid =
    accountNumber.length === 10 && !!accountName && !lookingUp;

  return (
    <AppLayout showHeader={false}>
      <PageHeader
        title={step === "success" ? "Success" : "Send Money"}
        onBack={step === "success" ? undefined : handlePrevStep}
      />

      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Progress Dots */}
        {step !== "success" && (
          <div className="flex justify-center gap-2 mb-8">
            {["type", "recipient", "amount"].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  step === s ? "w-8 bg-primary" : "w-2 bg-muted",
                )}
              />
            ))}
          </div>
        )}

        {/* Step 1: Transfer Type */}
        {step === "type" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-6 text-center">
              How would you like to send?
            </h2>
            <button
              onClick={() => {
                setTransferType("internal");
                handleNextStep();
              }}
              className="w-full p-6 rounded-2xl border-2 border-transparent bg-card hover:border-primary/50 transition-all text-left flex items-center gap-4 group shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <User className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">Internal Transfer</p>
                <p className="text-sm text-muted-foreground">
                  To another {brand.shortBrandName} account
                </p>
              </div>
              <ArrowRight
                className="text-muted-foreground group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </button>

            <button
              onClick={() => {
                setTransferType("bank");
                handleNextStep();
              }}
              className="w-full p-6 rounded-2xl border-2 border-transparent bg-card hover:border-primary/50 transition-all text-left flex items-center gap-4 group shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-secondary/80 transition-colors">
                <Building2 className="text-muted-foreground" size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">External Transfer</p>
                <p className="text-sm text-muted-foreground">
                  To other Nigerian banks
                </p>
              </div>
              <ArrowRight
                className="text-muted-foreground group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </button>
          </div>
        )}

        {/* Step 2: Recipient Details */}
        {step === "recipient" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Recipient Details</h2>
                <span className="text-xs px-2 py-1 bg-muted rounded-full font-medium uppercase tracking-wider">
                  {transferType === "internal" ? "Internal" : "External"}
                </span>
              </div>

              {transferType === "bank" && (
                <div className="space-y-2">
                  <Label>Select Bank</Label>
                  <Popover
                    open={openBankSelect}
                    onOpenChange={setOpenBankSelect}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between h-12 font-normal"
                      >
                        {bankCode
                          ? banks.find((b) => b.bank_code === bankCode)
                            ?.bank_name
                          : "Select a bank"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                      align="start"
                    >
                      <BankList
                        banks={banks}
                        loading={loadingBanks}
                        selectedCode={bankCode}
                        onSelect={(code) => {
                          setBankCode(code);
                          setOpenBankSelect(false);
                          setAccountName("");
                          if (accountNumber.length === 10)
                            lookupAccountName(accountNumber, code);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="space-y-2">
                <Label>Account Number</Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="0000000000"
                    value={accountNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setAccountNumber(val);
                      setAccountName("");
                      if (val.length === 10) lookupAccountName(val, bankCode);
                    }}
                    className="h-12 text-lg font-mono tracking-widest"
                  />
                  {lookingUp && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2
                        size={20}
                        className="animate-spin text-primary"
                      />
                    </div>
                  )}
                </div>
              </div>

              {accountName && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 animate-in zoom-in-95">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <Check size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                      Verified Account Name
                    </p>
                    <p className="font-bold text-emerald-900 text-lg">
                      {accountName}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              className="w-full h-14 text-lg"
              disabled={!isRecipientValid}
              onClick={handleNextStep}
              variant="gradient"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 3: Amount & Details */}
        {step === "amount" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Transfer Details</h2>

              {/* Source Wallet Carousel */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-widest">
                  Send From
                </Label>
                {isLoadingWallet ? (
                  <Skeleton className="h-24 w-full rounded-2xl" />
                ) : (
                  <div className="relative group">
                    <Carousel setApi={setCarouselApi} className="w-full">
                      <CarouselContent>
                        {wallets.map((w) => (
                          <CarouselItem key={w.id} className="basis-[82%]">
                            <div
                              className={cn(
                                "p-4 rounded-2xl border-2 transition-all duration-300",
                                activeWallet?.id === w.id
                                  ? "bg-primary/5 border-primary"
                                  : "bg-card border-transparent shadow-sm",
                              )}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-bold">
                                  {w.name}
                                </span>
                                <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">
                                  {w.currency}
                                </span>
                              </div>
                              <p className="text-2xl font-black">
                                {formatCurrency(
                                  parseFloat(w.balance),
                                  w.currency,
                                )}
                              </p>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-widest">
                  Amount to Send
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">
                    ₦
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-16 pl-10 text-3xl font-black focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-widest">
                  Narration (Optional)
                </Label>
                <Input
                  placeholder="What's this for?"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-muted/50 space-y-3 mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-bold text-right truncate ml-4">
                    {accountName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bank</span>
                  <span className="font-medium">
                    {transferType === "internal"
                      ? brand.brandName
                      : banks.find((b) => b.bank_code === bankCode)?.bank_name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="pt-3 border-t flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-black text-primary">
                    {formatCurrency(parseFloat(amount || "0"))}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-14 text-lg shadow-lg shadow-primary/20"
              onClick={() => {
                const amt = parseFloat(amount);
                if (isNaN(amt) || amt <= 0)
                  return toast.error("Please enter a valid amount");
                if (amt > parseFloat(activeWallet?.balance || "0"))
                  return toast.error("Insufficient balance");
                setVerifyOpen(true);
              }}
              variant="gradient"
            >
              Send Money
            </Button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <div className="text-center py-8 animate-in zoom-in-95 fade-in duration-500">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
              <CheckCircle
                size={48}
                className="text-emerald-600 relative z-10"
              />
            </div>
            <h2 className="text-3xl font-black mb-2">Transfer Sent!</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Your transaction is being processed
            </p>

            <div className="bg-card rounded-2xl p-6 shadow-sm mb-8 space-y-4">
              <div className="flex justify-between border-b pb-4">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-black text-xl text-primary">
                  {formatCurrency(parseFloat(amount))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recipient</span>
                <span className="font-bold text-right">{accountName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono text-xs">
                  {transactionDetails?.reference || "---"}
                </span>
              </div>
            </div>

            <Button
              className="w-full h-12"
              onClick={() => navigate("/account/dashboard")}
              variant="outline"
            >
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>

      <EnterPinDialog
        open={verifyOpen}
        onOpenChange={setVerifyOpen}
        onSuccess={executeTransfer}
        loading={loading}
      />
    </AppLayout>
  );
};

export default Send;
