import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/currency";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandInput, CommandItem } from "@/components/ui/command";
import { AppLayout } from "@/components/AppLayout";
import {
  Loader2,
  User,
  Building2,
  Check,
  ChevronsUpDown,
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
  Sparkles,
  Send as SendIcon,
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

// Virtualised bank list — logic unchanged
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
            <div className="p-4 text-sm text-center text-foreground-subtle w-full absolute top-0">
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

const STEP_LABELS = ["Type", "Recipient", "Amount", "Sent"];
const STEP_KEYS: WizardStep[] = ["type", "recipient", "amount", "success"];

const Send = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const brand = BrandConfigService.getConfigSync("personal");

  // API hooks — unchanged
  const { data: banksResponse, isLoading: loadingBanks } = useBanks();
  const { data: profile } = useUserProfile();
  const { wallets, wallet: initialWallet, isLoadingWallet } = useWallet();
  const { data: pinStatus } = usePinStatus();
  const { mutateAsync: resolveAccount } = useResolveAccount();

  // Form state — unchanged
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
  const [transactionDetails, setTransactionDetails] = useState<{
    reference?: string;
  } | null>(null);
  const [openBankSelect, setOpenBankSelect] = useState(false);
  const [currentWalletIndex, setCurrentWalletIndex] = useState(0);

  const activeWallet = wallets[currentWalletIndex] || initialWallet;
  const banks = banksResponse?.data || [];
  const stepIndex = STEP_KEYS.indexOf(step);

  const firstName = profile?.firstName || user?.email?.split("@")[0] || "";

  useEffect(() => {
    if (transferType === "internal") setBankCode("000017");
  }, [transferType]);

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
    } catch (error: unknown) {
      toast.error(
        (error as { message?: string })?.message || "Could not verify account",
      );
    } finally {
      setLookingUp(false);
    }
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
      const bankName =
        banks.find((b) => b.bank_code === bankCode)?.bank_name || "";
      const response =
        transferType === "bank"
          ? await TransferService.initiateTransfer({
              destination_bank_code: bankCode,
              destination_account_number: accountNumber,
              bank_name: bankName,
              account_name: accountName,
              amount: amountNum,
              narration: narration || `Transfer to ${accountName}`,
              pin,
              source_wallet_id: activeWallet?.id || "",
            })
          : await TransferService.initiateInternalTransfer({
              recipient_account_number: accountNumber,
              amount: amountNum,
              narration: narration || `Internal transfer to ${accountNumber}`,
              pin,
              source_wallet_id: activeWallet?.id || "",
            });

      if (response.status === "success" || response.status === "successful") {
        setTransactionDetails(response.data);
        setStep("success");
        setVerifyOpen(false);
        toast.success("Transfer successful!");
      } else {
        toast.error(response.message || "Transfer failed");
      }
    } catch (err: unknown) {
      toast.error(
        (err as { message?: string })?.message || "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const isRecipientValid =
    accountNumber.length === 10 && !!accountName && !lookingUp;

  return (
    <AppLayout>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div>
          <p className="eyebrow mb-2">Send money</p>
          <h1 className="display text-[clamp(26px,3.5vw,44px)] m-0 leading-none">
            Move it like{" "}
            <span
              className="serif-italic"
              style={{ color: "rgb(var(--brand-primary))" }}
            >
              now.
            </span>
          </h1>
          <p className="text-foreground-subtle text-sm mt-2">
            Free to {brand.shortBrandName} accounts · ₦25 to other banks ·
            settles in seconds
          </p>
        </div>
        {step !== "type" && step !== "success" && (
          <button
            onClick={handlePrevStep}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill text-sm font-semibold transition-colors shrink-0"
            style={{ background: "rgb(var(--surface))" }}
          >
            <ArrowLeft size={14} />
            Back
          </button>
        )}
      </div>

      {/* ── Progress rail ── */}
      {step !== "success" && (
        <div className="flex items-center gap-3 mb-7">
          {STEP_LABELS.slice(0, 3).map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-pill flex items-center justify-center text-xs font-bold transition-colors",
                    i < stepIndex
                      ? "bg-foreground text-surface-highest"
                      : i === stepIndex
                        ? "bg-foreground text-surface-highest"
                        : "text-foreground-subtle",
                  )}
                  style={
                    i >= stepIndex
                      ? { background: "rgb(var(--surface))" }
                      : undefined
                  }
                >
                  {i < stepIndex ? <Check size={13} /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold hidden sm:inline",
                    i <= stepIndex
                      ? "text-foreground"
                      : "text-foreground-subtle",
                  )}
                >
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className="flex-1 h-[2px] min-w-[28px] rounded-pill transition-colors"
                  style={{
                    background:
                      i < stepIndex
                        ? "rgb(var(--foreground))"
                        : "rgb(var(--surface))",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── 2-col grid ── */}
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] items-start">
        {/* ── Form column ── */}
        <div>
          {/* Step: Type */}
          {step === "type" && (
            <div
              className="rounded-2xl p-6 shadow-card space-y-4"
              style={{
                background: "rgb(var(--surface-highest))",
                border: "1px solid rgb(var(--surface-high))",
              }}
            >
              <div>
                <h2 className="font-bold text-[22px] tracking-tight mb-1">
                  How would you like to send?
                </h2>
                <p className="text-sm text-foreground-subtle">
                  Pick internal for free, or external for any Nigerian bank.
                </p>
              </div>

              {[
                {
                  type: "internal" as const,
                  icon: <User size={20} />,
                  title: "Internal Transfer",
                  sub: `Free · To another ${brand.shortBrandName} account`,
                },
                {
                  type: "bank" as const,
                  icon: <Building2 size={20} />,
                  title: "External Transfer",
                  sub: "₦25 fee · Any Nigerian bank · ~8s",
                },
              ].map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => {
                    setTransferType(opt.type);
                    setStep("recipient");
                  }}
                  className="w-full flex items-center gap-4 p-5 rounded-[18px] text-left transition-colors"
                  style={{ background: "rgb(var(--surface))" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgb(var(--foreground))")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "transparent")
                  }
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgb(var(--surface-high))" }}
                  >
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base">{opt.title}</p>
                    <p className="text-sm text-foreground-subtle mt-0.5">
                      {opt.sub}
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-foreground-subtle shrink-0"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Step: Recipient */}
          {step === "recipient" && (
            <div
              className="rounded-2xl p-6 shadow-card space-y-5"
              style={{
                background: "rgb(var(--surface-highest))",
                border: "1px solid rgb(var(--surface-high))",
              }}
            >
              <div>
                <h2 className="font-bold text-[22px] tracking-tight mb-1">
                  Who's getting paid?
                </h2>
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-semibold"
                  style={{ background: "rgb(var(--surface))" }}
                >
                  {transferType === "internal" ? "Internal" : "External"}{" "}
                  transfer
                </div>
              </div>

              {transferType === "bank" && (
                <div className="space-y-1.5">
                  <Label className="eyebrow">Select Bank</Label>
                  <Popover
                    open={openBankSelect}
                    onOpenChange={setOpenBankSelect}
                  >
                    <PopoverTrigger asChild>
                      <button
                        className="w-full h-12 flex items-center justify-between px-4 rounded-xl border text-sm font-medium text-left transition-colors hover:bg-surface"
                        style={{ borderColor: "rgb(var(--border))" }}
                      >
                        <span
                          className={
                            bankCode
                              ? "text-foreground"
                              : "text-foreground-subtle"
                          }
                        >
                          {bankCode
                            ? banks.find((b) => b.bank_code === bankCode)
                                ?.bank_name
                            : "Select a bank"}
                        </span>
                        <ChevronsUpDown className="h-4 w-4 text-foreground-subtle" />
                      </button>
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

              <div className="space-y-1.5">
                <Label className="eyebrow">Account Number</Label>
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
                        size={18}
                        className="animate-spin text-brand-primary"
                      />
                    </div>
                  )}
                </div>
              </div>

              {accountName && (
                <div
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: "rgb(var(--mint))" }}
                >
                  <div
                    className="w-9 h-9 rounded-pill flex items-center justify-center shrink-0"
                    style={{ background: "rgb(var(--mint-deep))" }}
                  >
                    <Check size={16} className="text-white" />
                  </div>
                  <div>
                    <p
                      className="eyebrow"
                      style={{ color: "rgb(var(--mint-deep))" }}
                    >
                      Verified
                    </p>
                    <p className="font-bold text-foreground">{accountName}</p>
                  </div>
                </div>
              )}

              <button
                disabled={!isRecipientValid}
                onClick={() => setStep("amount")}
                className={cn(
                  "w-full h-13 py-3.5 rounded-pill font-semibold text-base transition-opacity flex items-center justify-center gap-2",
                  "bg-foreground text-surface-highest",
                  !isRecipientValid && "opacity-40 cursor-not-allowed",
                )}
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Step: Amount */}
          {step === "amount" && (
            <div
              className="rounded-2xl p-6 shadow-card space-y-5"
              style={{
                background: "rgb(var(--surface-highest))",
                border: "1px solid rgb(var(--surface-high))",
              }}
            >
              {/* Recipient chip */}
              <div
                className="flex items-center gap-3 p-3.5 rounded-xl"
                style={{ background: "rgb(var(--surface))" }}
              >
                <div
                  className="w-10 h-10 rounded-pill flex items-center justify-center font-bold text-sm text-surface-highest shrink-0"
                  style={{ background: "rgb(var(--foreground))" }}
                >
                  {accountName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{accountName}</p>
                  <p className="text-xs text-foreground-subtle truncate">
                    {transferType === "bank"
                      ? banks.find((b) => b.bank_code === bankCode)?.bank_name
                      : brand.brandName}
                  </p>
                </div>
                <button
                  onClick={() => setStep("recipient")}
                  className="text-xs font-semibold text-foreground-subtle hover:text-foreground transition-colors"
                >
                  Change
                </button>
              </div>

              <h2 className="font-bold text-[22px] tracking-tight">
                How much?
              </h2>

              {/* Large amount input */}
              <div
                className="text-center py-7 border-y"
                style={{ borderColor: "rgb(var(--surface-high))" }}
              >
                <p className="eyebrow mb-3">
                  {activeWallet?.currency ?? "NGN"}
                </p>
                <input
                  className="num w-full text-center bg-transparent border-none outline-none text-[clamp(48px,8vw,72px)] font-bold tracking-tight"
                  style={{
                    color: amount
                      ? "rgb(var(--foreground))"
                      : "rgb(var(--surface-high))",
                    letterSpacing: "-0.045em",
                  }}
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^\d.]/g, ""))
                  }
                />
                <p className="text-sm text-foreground-subtle mt-2">
                  Available:{" "}
                  <span className="num font-semibold text-foreground">
                    {formatCurrency(
                      parseFloat(activeWallet?.balance ?? "0"),
                      activeWallet?.currency ?? "NGN",
                    )}
                  </span>
                </p>
              </div>

              {/* Wallet tabs */}
              {wallets.length > 1 && (
                <div>
                  <p className="eyebrow mb-2">Send from</p>
                  {isLoadingWallet ? (
                    <Skeleton className="h-9 w-full rounded-xl" />
                  ) : (
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
                          {w.currency} ·{" "}
                          {formatCurrency(parseFloat(w.balance), w.currency)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quick amounts */}
              <div className="flex gap-2 flex-wrap">
                {["1000", "5000", "10000", "50000"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(v)}
                    className="px-3 py-1.5 rounded-pill text-xs font-semibold text-foreground-subtle hover:text-foreground transition-colors"
                    style={{ background: "rgb(var(--surface))" }}
                  >
                    +₦{Number(v).toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Narration */}
              <div className="space-y-1.5">
                <Label className="eyebrow">Note (optional)</Label>
                <Input
                  placeholder="What's this for?"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  className="h-11"
                />
              </div>

              <button
                disabled={!amount || parseFloat(amount) <= 0}
                onClick={() => {
                  const amt = parseFloat(amount);
                  if (isNaN(amt) || amt <= 0)
                    return toast.error("Please enter a valid amount");
                  if (amt > parseFloat(activeWallet?.balance || "0"))
                    return toast.error("Insufficient balance");
                  setVerifyOpen(true);
                }}
                className={cn(
                  "w-full py-3.5 rounded-pill font-semibold text-base transition-opacity flex items-center justify-center gap-2",
                  "bg-foreground text-surface-highest",
                  (!amount || parseFloat(amount) <= 0) &&
                    "opacity-40 cursor-not-allowed",
                )}
              >
                <SendIcon size={16} />
                Send money
              </button>
            </div>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <div
              className="rounded-2xl p-8 shadow-card text-center space-y-5"
              style={{
                background: "rgb(var(--surface-highest))",
                border: "1px solid rgb(var(--surface-high))",
              }}
            >
              <div
                className="w-20 h-20 rounded-pill flex items-center justify-center mx-auto"
                style={{ background: "rgb(var(--mint))" }}
              >
                <Check size={36} style={{ color: "rgb(var(--mint-deep))" }} />
              </div>
              <div>
                <h2 className="display text-[40px] leading-none mb-2">Sent.</h2>
                <p className="text-foreground-subtle">
                  <span className="num font-bold text-foreground">
                    {formatCurrency(parseFloat(amount))}
                  </span>{" "}
                  is on its way to {accountName}. They'll see it in seconds.
                </p>
              </div>

              {/* Receipt */}
              <div
                className="rounded-xl p-4 text-left space-y-3"
                style={{ background: "rgb(var(--surface))" }}
              >
                {[
                  { l: "Amount", v: formatCurrency(parseFloat(amount)) },
                  { l: "Recipient", v: accountName },
                  {
                    l: "Bank",
                    v:
                      transferType === "bank"
                        ? banks.find((b) => b.bank_code === bankCode)?.bank_name
                        : brand.brandName,
                  },
                  { l: "Reference", v: transactionDetails?.reference || "—" },
                ].map((row) => (
                  <div key={row.l} className="flex justify-between text-sm">
                    <span className="text-foreground-subtle">{row.l}</span>
                    <span className="font-semibold text-right ml-4 truncate max-w-[60%]">
                      {row.v}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep("type");
                    setAmount("");
                    setAccountNumber("");
                    setAccountName("");
                    setNarration("");
                    setTransactionDetails(null);
                  }}
                  className="flex-1 py-3 rounded-pill text-sm font-semibold transition-colors"
                  style={{ background: "rgb(var(--surface))" }}
                >
                  Send another
                </button>
                <button
                  onClick={() => navigate("/account/dashboard")}
                  className="flex-1 py-3 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity"
                >
                  Back to dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Balance card */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgb(var(--foreground))", color: "#fff" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.14em] mb-1"
              style={{ opacity: 0.55 }}
            >
              Sending from
            </p>
            <p className="num text-3xl font-bold mt-1">
              {formatCurrency(
                parseFloat(activeWallet?.balance ?? "0"),
                activeWallet?.currency ?? "NGN",
              )}
            </p>
            <p className="text-sm mt-1" style={{ opacity: 0.6 }}>
              {activeWallet?.currency ?? "NGN"} wallet ·{" "}
              {activeWallet?.account_number ?? ""}
            </p>
          </div>

          {/* Info card */}
          <div
            className="rounded-2xl p-5 shadow-card"
            style={{
              background: "rgb(var(--surface-highest))",
              border: "1px solid rgb(var(--surface-high))",
            }}
          >
            <p className="eyebrow mb-2">Why {brand.shortBrandName} is faster</p>
            <h3 className="font-bold text-base tracking-tight mb-4">
              Direct rail to NIBSS
            </h3>
            {[
              {
                icon: <Zap size={13} />,
                label: "~8s median to other Nigerian banks",
              },
              {
                icon: <Check size={13} />,
                label: `Free to ${brand.shortBrandName} accounts`,
              },
              {
                icon: <Shield size={13} />,
                label: "PIN-protected every transfer",
              },
            ].map((r) => (
              <div
                key={r.label}
                className="flex items-center gap-3 py-2 text-sm"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgb(var(--surface))" }}
                >
                  {r.icon}
                </div>
                <span>{r.label}</span>
              </div>
            ))}
          </div>

          {/* Tip card */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgb(var(--mint))" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={15} />
              <span className="text-sm font-semibold">Save the ₦25 fee</span>
            </div>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Ask your recipient if they have a {brand.shortBrandName} account —
              internal transfers are always free.
            </p>
          </div>
        </div>
      </div>

      {/* PIN dialog — unchanged */}
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
