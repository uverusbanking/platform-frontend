import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { toast } from "sonner";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { EnterPinDialog } from "@/components/TransactionPinDialog";
import { useUserProfile } from "@/hooks/queries/useUser";
import { useWallet } from "@/hooks/useWallet";
import { usePinStatus } from "@/hooks/queries/useSecurity";
import {
  useInitiateTransfer,
  useResolveAccount,
} from "@/hooks/mutations/useTransferMutations";
import { TransferService } from "@/services/transfer.service";
import { useBanks } from "@/hooks/queries/useTransfers";
import { BankListResponseDto } from "@/types";
import { BrandConfigService } from "@shared/core";

// Isolated BankList component to handle virtualization correctly within Popover
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
  const {} = useInitiateTransfer();
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

const internalTransferEnabled = false;

const Send = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: banksResponse, isLoading: loadingBanks } = useBanks();

  const banks = banksResponse?.data || [];

  const {
    data: pinStatus,
    isPending: pinStatusLoading,
    refetch,
  } = usePinStatus();
  const [verifyOpen, setVerifyOpen] = useState(false);
  const { data: profile } = useUserProfile();
  const { wallet, isLoadingWallet } = useWallet();
  const brand = BrandConfigService.getConfigSync("personal");

  // Calculate available balance safely with memoization
  const availableBalance = useMemo(() => {
    const balance = parseFloat(wallet?.balance || profile?.balance || "0");
    return isNaN(balance) ? 0 : balance;
  }, [wallet?.balance, profile?.balance]);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [transferType, setTransferType] = useState<"internal" | "bank">("bank");

  // Form state
  const [amount, setAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [narration, setNarration] = useState("");

  // Error states - centralized
  const [errors, setErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(true);

  // Helper function to add error
  const addError = (error: string) => {
    setErrors((prev) => {
      if (!prev.includes(error)) {
        return [...prev, error];
      }
      return prev;
    });
    setIsFormValid(false);
  };

  // Helper function to clear errors
  const clearErrors = () => {
    setErrors([]);
    setIsFormValid(true);
  };

  // Helper function to remove specific error
  const removeError = (error: string) => {
    setErrors((prev) => {
      const filtered = prev.filter((e) => !e.includes(error.split(" ")[0])); // Remove errors that start with the same word
      if (filtered.length === 0) {
        setIsFormValid(true);
      }
      return filtered;
    });
  };

  // Centralized Error Display Component
  const ErrorDisplay = () => {
    if (errors.length === 0) return null;

    return (
      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-destructive text-sm"
            >
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const { mutateAsync: resolveAccount, isPending: resolveAccountLoading } =
    useResolveAccount();

  // Transaction details for success page
  const [transactionDetails, setTransactionDetails] = useState<any>(null);

  // Bank selection state
  const [openBankSelect, setOpenBankSelect] = useState(false);

  // Account lookup state
  const [lookingUp, setLookingUp] = useState(false);

  const lookupAccountName = async () => {
    if (accountNumber.length !== 10 || !bankCode) return;

    setLookingUp(true);
    setAccountName("");
    removeError("Account");

    resolveAccount(
      { bankCode, accountNumber },
      {
        onSuccess: (data) => {
          setAccountName(data.accountName);
          removeError("Account");
          toast.success("Account verified");
        },
        onError: (error) => {
          const errorMessage = error.message || "Could not verify account";
          setAccountName("");
          addError(`Account verification failed: ${errorMessage}`);
          toast.error(errorMessage);
        },
        onSettled: () => {
          setLookingUp(false);
        },
      },
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    const validationErrors: string[] = [];
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      validationErrors.push("Please enter a valid amount");
    } else if (amountNum > availableBalance) {
      validationErrors.push("Insufficient balance for this transaction");
    }

    if (transferType === "internal" && !recipientEmail) {
      validationErrors.push(
        `Recipient email is required for ${brand.shortBrandName} Transfer`,
      );
    }

    if (
      transferType === "bank" &&
      (!bankCode || !accountNumber || !accountName)
    ) {
      validationErrors.push(
        "Please complete all bank details (bank, account number, and verify account)",
      );
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsFormValid(false);
      // Still show toast for immediate feedback
      toast.error(
        `${validationErrors.length} error(s) found. Please review and correct.`,
      );
      return;
    }

    setStep("confirm");
  };

  const handleConfirm = () => {
    if (!pinStatus?.data?.pin_set) {
      const errorMessage =
        "Please set up a transaction PIN in your dashboard settings to continue";
      addError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    clearErrors();
    setVerifyOpen(true);
  };

  const executeTransfer = async (pin: string) => {
    if (!profile || !user) return;

    setLoading(true);

    try {
      const amountNum = parseFloat(amount);

      // Only process bank transfers through API (internal transfers not supported yet)
      if (transferType === "bank") {
        const bankName =
          banks.find((b) => b.bank_code === bankCode)?.bank_name || "";

        const result = await TransferService.initiateTransfer({
          amount: amountNum,
          bankCode: bankCode,
          bankName: bankName,
          accountNumber: accountNumber,
          accountName: accountName,
          narrative: narration || `Transfer to ${accountName}`,
          pin: pin,
        });

        if (result.status === "success" || result.status === "successful") {
          // Store transaction details for success page
          setTransactionDetails(result);

          setStep("success");
          setVerifyOpen(false);
          toast.success("Transfer successful!");
        } else {
          const errorMessage = result.message || "Transfer failed";
          addError(`Transfer failed: ${errorMessage}`);
          toast.error(errorMessage);
        }
      } else {
        // Internal transfer not implemented yet
        const errorMessage =
          "Internal transfers are not yet supported. Please use bank transfer.";
        addError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err: any) {
      console.error("Transfer error:", err);
      const errorMessage = err.message || "An error occurred during transfer";
      addError(`Transfer error: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fee = 0; // Temporarily removed
  const totalAmount = parseFloat(amount || "0") + fee;

  return (
    <AppLayout showHeader={false}>
      {/* Header */}
      <PageHeader
        title="Send Money"
        onBack={() => (step === "form" ? navigate(-1) : setStep("form"))}
      />

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-lg">
        {step === "form" && (
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">
                Transfer Details
              </CardTitle>
              <CardDescription className="text-sm">
                Available: {formatCurrency(availableBalance)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorDisplay />

              <Tabs
                value={transferType}
                onValueChange={(v) => {
                  setTransferType(v as "internal" | "bank");
                  clearErrors();
                }}
              >
                {internalTransferEnabled && (
                  <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-10 sm:h-9">
                    <TabsTrigger
                      value="internal"
                      className="gap-1.5 text-xs sm:text-sm"
                    >
                      <User size={14} />
                      {brand.shortBrandName} Transfer
                    </TabsTrigger>
                    <TabsTrigger
                      value="bank"
                      className="gap-1.5 text-xs sm:text-sm"
                    >
                      <Building2 size={14} />
                      Bank Account
                    </TabsTrigger>
                  </TabsList>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm">
                      Amount (₦)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (!isFormValid) {
                          removeError("amount");
                          removeError("Insufficient");
                        }
                      }}
                      className={cn(
                        "text-xl sm:text-2xl h-12 sm:h-14",
                        !isFormValid &&
                          errors.some(
                            (e) =>
                              e.toLowerCase().includes("amount") ||
                              e.toLowerCase().includes("insufficient"),
                          ) &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                      required
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[500, 1000, 2000, 5000, 9999, 10000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAmount(amt.toString())}
                          className="px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                        >
                          {formatCurrency(amt, "NGN", 0)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {internalTransferEnabled && (
                    <TabsContent value="internal" className="mt-0 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm">
                          Recipient Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          inputMode="email"
                          placeholder="recipient@email.com"
                          value={recipientEmail}
                          onChange={(e) => {
                            setRecipientEmail(e.target.value);
                            if (!isFormValid) {
                              removeError("email");
                              removeError("Recipient");
                            }
                          }}
                          className={cn(
                            "h-11 sm:h-10",
                            !isFormValid &&
                              errors.some(
                                (e) =>
                                  e.toLowerCase().includes("email") ||
                                  e.toLowerCase().includes("recipient"),
                              ) &&
                              "border-destructive focus-visible:ring-destructive",
                          )}
                        />
                      </div>
                    </TabsContent>
                  )}

                  <TabsContent value="bank" className="mt-0 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Select Bank</Label>
                      <Popover
                        open={openBankSelect}
                        onOpenChange={setOpenBankSelect}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openBankSelect}
                            className={cn(
                              "w-full justify-between h-11 sm:h-10 font-normal",
                              !isFormValid &&
                                errors.some((e) =>
                                  e.toLowerCase().includes("bank"),
                                ) &&
                                "border-destructive",
                            )}
                          >
                            {bankCode
                              ? banks.find(
                                  (bank) => bank.bank_code === bankCode,
                                )?.bank_name
                              : loadingBanks
                                ? "Loading banks..."
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
                              if (!isFormValid) {
                                removeError("bank");
                                removeError("complete");
                              }
                              lookupAccountName().then();
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber" className="text-sm">
                        Account Number
                      </Label>
                      <Input
                        id="accountNumber"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="0000000000"
                        value={accountNumber}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          setAccountNumber(value);
                          setAccountName("");
                          if (!isFormValid) {
                            removeError("bank");
                            removeError("complete");
                            removeError("Account");
                          }
                          if (value.length === 10) {
                            lookupAccountName().then();
                          }
                        }}
                        onBlur={lookupAccountName}
                        className={cn(
                          "h-11 sm:h-10",
                          !isFormValid &&
                            errors.some(
                              (e) =>
                                e.toLowerCase().includes("bank") ||
                                e.toLowerCase().includes("account"),
                            ) &&
                            "border-destructive focus-visible:ring-destructive",
                        )}
                      />
                    </div>

                    {lookingUp && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm">Looking up account...</span>
                      </div>
                    )}

                    {accountName && (
                      <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Account Name
                        </p>
                        <p className="font-semibold text-success text-sm sm:text-base">
                          {accountName}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <div className="space-y-2">
                    <Label htmlFor="narration" className="text-sm">
                      Narration (Optional)
                    </Label>
                    <Input
                      id="narration"
                      type="text"
                      placeholder="What's this for?"
                      value={narration}
                      onChange={(e) => setNarration(e.target.value)}
                      className="h-11 sm:h-10"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 sm:h-11 text-sm sm:text-base"
                    variant="gradient"
                    size="lg"
                  >
                    Continue
                  </Button>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {step === "confirm" && (
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">
                Confirm Transfer
              </CardTitle>
              <CardDescription className="text-sm">
                Review the details below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ErrorDisplay />

              <div className="p-3 sm:p-4 rounded-xl bg-muted space-y-2.5 sm:space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Recipient</span>
                  <span className="font-medium truncate ml-4 text-right">
                    {transferType === "internal" ? recipientEmail : accountName}
                  </span>
                </div>
                {transferType === "bank" && (
                  <>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-muted-foreground">Bank</span>
                      <span className="font-medium truncate ml-4 text-right">
                        {banks.find((b) => b.bank_code === bankCode)?.bank_name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-muted-foreground">Account</span>
                      <span className="font-medium font-mono">
                        {accountNumber}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    {formatCurrency(parseFloat(amount))}
                  </span>
                </div>
                {/* <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-medium">{formatCurrency(fee)}</span>
                </div> */}
                <div className="border-t border-border pt-2.5 sm:pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-base sm:text-lg">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 sm:h-10"
                  onClick={() => {
                    setStep("form");
                    clearErrors();
                  }}
                  disabled={loading}
                >
                  Go Back
                </Button>
                <Button
                  variant="gradient"
                  className="flex-1 h-11 sm:h-10"
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Send Money"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "success" && (
          <Card>
            <CardContent className="py-8 sm:py-10">
              <div className="text-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-success sm:hidden" />
                  <CheckCircle
                    size={40}
                    className="text-success hidden sm:block"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Transfer Successful!
                </h2>
                <p className="text-2xl sm:text-3xl font-bold text-success mb-1">
                  {formatCurrency(parseFloat(amount))}
                </p>
                <p className="text-sm text-muted-foreground">
                  sent to{" "}
                  {transferType === "bank" ? accountName : recipientEmail}
                </p>
              </div>

              {/* Transaction Details */}
              <div className="space-y-3 mb-6 p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono font-medium text-right break-all">
                    {transactionDetails?.reference ||
                      transactionDetails?.id ||
                      "N/A"}
                  </span>
                </div>

                {transactionDetails?.metadata?.destination && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Destination</span>
                    <span className="font-medium text-right">
                      {transactionDetails.metadata.destination}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">
                    {transactionDetails?.metadata?.status ||
                      transactionDetails?.status ||
                      "Pending"}
                  </span>
                </div>

                {transactionDetails?.created_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">
                      {new Date(transactionDetails.created_at).toLocaleString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                )}

                {narration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Narration</span>
                    <span className="font-medium text-right max-w-[60%]">
                      {narration}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  variant="gradient"
                  className="w-full h-11 sm:h-10"
                  onClick={() => navigate("/account/dashboard")}
                >
                  Back to Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11 sm:h-10"
                  onClick={() => {
                    setStep("form");
                    setAmount("");
                    setRecipientEmail("");
                    setAccountNumber("");
                    setAccountName("");
                    setNarration("");
                    setTransactionDetails(null);
                    clearErrors();
                  }}
                >
                  Send Another
                </Button>
              </div>
            </CardContent>
          </Card>
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
