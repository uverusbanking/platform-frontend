import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/currency";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import Select from "react-select";
import PageHeader from "@/components/PageHeader";
import { AppLayout } from "@/components/AppLayout";
import {
  Loader2,
  User,
  Building2,
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
  Sparkles,
  Search,
  Send as SendIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EnterPinDialog } from "@/components/TransactionPinDialog";
import { useUserProfile } from "@/hooks/queries/useUser";
import { useWallet } from "@/hooks/useWallet";
import { usePinStatus } from "@/hooks/queries/useSecurity";
import { useResolveAccount } from "@/hooks/mutations/useTransferMutations";
import { TransferService } from "@/services/transfer.service";
import {
  useBanks,
  useRecentBeneficiaries,
  useSavedBeneficiaries,
} from "@/hooks/queries/useTransfers";
import { BankListResponseDto, BeneficiaryDto } from "@/types";
import { BrandConfigService } from "@shared/core";

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

  // Beneficiary state & hooks
  const [beneficiarySearch, setBeneficiarySearch] = useState("");
  const { data: recentBeneficiaries } = useRecentBeneficiaries({
    limit: 6,
    page: 1,
  });
  const { data: savedBeneficiaries, isLoading: loadingSaved } =
    useSavedBeneficiaries({
      search: beneficiarySearch,
      page: 1,
      limit: 20,
    });

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

  const selectBeneficiary = (b: BeneficiaryDto) => {
    setAccountNumber(b.account_number);
    setBankCode(b.bank_code);
    setAccountName(b.account_name);
    setTransferType(b.bank_code === "000017" ? "internal" : "bank");
    toast.success(`Selected ${b.account_name}`);
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
        <div className="space-y-5">
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
            <>
              <div
                className="rounded-2xl p-6 shadow-card space-y-5"
                style={{
                  background: "rgb(var(--surface-highest))",
                  border: "1px solid rgb(var(--surface-high))",
                }}
              >
                <div>
                  <h2 className="font-bold text-[22px] tracking-tight mb-1">
                    Enter Manually
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
                    <Select
                      isLoading={loadingBanks}
                      options={banks.map((b) => ({
                        value: b.bank_code,
                        label: b.bank_name,
                      }))}
                      value={
                        bankCode
                          ? {
                              value: bankCode,
                              label:
                                banks.find((b) => b.bank_code === bankCode)
                                  ?.bank_name || "",
                            }
                          : null
                      }
                      onChange={(option) => {
                        if (option) {
                          setBankCode(option.value);
                          setAccountName("");
                          if (accountNumber.length === 10)
                            lookupAccountName(accountNumber, option.value);
                        }
                      }}
                      placeholder="Select a bank"
                      isSearchable
                      classNames={{
                        control: ({ isFocused }) =>
                          cn(
                            "flex h-12 w-full rounded-xl border bg-background px-3 py-1 text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                            isFocused
                              ? "ring-2 ring-primary ring-offset-2 border-primary"
                              : "border-border",
                          ),
                        menu: () =>
                          "mt-2 rounded-xl border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 z-50",
                        option: ({ isFocused, isSelected }) =>
                          cn(
                            "relative flex w-full cursor-default select-none items-center rounded-lg py-2.5 px-3 text-sm outline-none transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : isFocused
                                ? "bg-accent text-accent-foreground"
                                : "text-foreground",
                          ),
                        noOptionsMessage: () =>
                          "py-6 text-center text-sm text-muted-foreground",
                        loadingIndicator: () => "text-primary",
                        placeholder: () => "text-muted-foreground",
                        singleValue: () => "text-foreground",
                        input: () => "text-foreground",
                      }}
                      unstyled
                    />
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

              {/* Beneficiary Suggestions */}
              <div
                className="rounded-2xl p-6 shadow-card space-y-4"
                style={{
                  background: "rgb(var(--surface-highest))",
                  border: "1px solid rgb(var(--surface-high))",
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg tracking-tight">
                    Suggested Beneficiaries
                  </h3>
                  <div className="relative w-40 sm:w-64">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle"
                    />
                    <input
                      type="text"
                      placeholder="Search saved..."
                      className="w-full h-9 pl-9 pr-3 rounded-pill bg-surface border-none text-xs focus:ring-1 focus:ring-foreground outline-none"
                      value={beneficiarySearch}
                      onChange={(e) => setBeneficiarySearch(e.target.value)}
                    />
                  </div>
                </div>

                {beneficiarySearch ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                    {loadingSaved ? (
                      [1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-xl" />
                      ))
                    ) : savedBeneficiaries?.data.length === 0 ? (
                      <p className="text-center py-6 text-sm text-foreground-subtle">
                        No beneficiaries found for "{beneficiarySearch}"
                      </p>
                    ) : (
                      savedBeneficiaries?.data.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => selectBeneficiary(b)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors text-left border border-transparent hover:border-surface-high"
                        >
                          <div className="w-10 h-10 rounded-pill bg-foreground text-surface-highest flex items-center justify-center font-bold text-xs shrink-0">
                            {b.account_name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">
                              {b.account_name}
                            </p>
                            <p className="text-[11px] text-foreground-subtle truncate">
                              {b.bank_name} • {b.account_number}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                    {recentBeneficiaries?.data.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => selectBeneficiary(b)}
                        className="flex flex-col items-center gap-2 group shrink-0"
                      >
                        <div className="w-14 h-14 rounded-pill bg-surface flex items-center justify-center font-bold text-lg text-foreground transition-all group-hover:scale-105 group-active:scale-95 border border-transparent group-hover:border-foreground/10 shadow-sm relative overflow-hidden">
                          {b.account_name.charAt(0)}
                          <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[11px] font-semibold text-foreground-subtle group-hover:text-foreground truncate w-16 text-center">
                          {b.account_name.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                    {recentBeneficiaries?.data.length === 0 && (
                      <p className="text-xs text-foreground-subtle italic py-2">
                        No recent beneficiaries yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
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

              <div className="flex flex-col gap-2 pt-4">
                <button
                  onClick={() => navigate("/account/dashboard")}
                  className="w-full py-3 rounded-pill font-bold text-sm bg-foreground text-surface-highest transition-opacity hover:opacity-90"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Info column ── */}
        <div className="space-y-5">
          <div
            className="rounded-2xl p-6 shadow-card"
            style={{
              background: "rgb(var(--surface-highest))",
              border: "1px solid rgb(var(--surface-high))",
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgb(var(--surface))" }}
              >
                <Shield size={20} className="text-brand-primary" />
              </div>
              <p className="font-bold text-lg">Safe & Secure</p>
            </div>
            <ul className="space-y-3">
              {[
                {
                  icon: <Zap size={14} />,
                  text: "Instant settlement to all banks",
                },
                {
                  icon: <Sparkles size={14} />,
                  text: "Zero fees on all internal transfers",
                },
                {
                  icon: <AlertCircle size={14} />,
                  text: "CBN insured and regulated",
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span
                    className="mt-0.5 shrink-0"
                    style={{ color: "rgb(var(--brand-primary))" }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-foreground-subtle">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
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
