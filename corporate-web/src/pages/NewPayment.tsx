import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { submitPayment } from "@/services/paymentStore";

const sourceAccounts: Record<string, { label: string; balance: number }> = {
  operating: { label: "Operating Account", balance: 12_450_000 },
  collections: { label: "Collections Account", balance: 8_320_000 },
  payroll: { label: "Payroll Account", balance: 3_150_000 },
};

const steps = [
  { id: 1, label: "Recipient information" },
  { id: 2, label: "Payment information" },
  { id: 3, label: "Payment approval" },
];

const banks = [
  "Access Bank",
  "First Bank of Nigeria",
  "Guaranty Trust Bank",
  "United Bank for Africa",
  "Zenith Bank",
  "Stanbic IBTC",
  "Fidelity Bank",
  "Union Bank",
  "Wema Bank",
  "Sterling Bank",
];

const recipientTags = [
  "Vendor",
  "Contractor",
  "Employee",
  "Partner",
  "Utility",
];

export default function NewPayment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [recipientType, setRecipientType] = useState<"single" | "multiple">(
    "single",
  );

  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [recipientTag, setRecipientTag] = useState("");
  const [amount, setAmount] = useState("");

  const [sourceAccount, setSourceAccount] = useState("");
  const [memo, setMemo] = useState("");
  const [paymentDate, setPaymentDate] = useState("immediate");

  const canContinueStep1 =
    recipientType === "single"
      ? accountNumber.trim().length >= 10 && bankName && amount
      : true;

  const canContinueStep2 = sourceAccount && memo.trim().length > 0;
  const selectedAcct = sourceAccount ? sourceAccounts[sourceAccount] : null;
  const paymentAmount = Number(amount) || 0;
  const insufficientBalance =
    selectedAcct && paymentAmount > 0 && paymentAmount > selectedAcct.balance;

  const handleContinue = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const acctLabel =
      sourceAccount === "operating"
        ? "Operating Account"
        : sourceAccount === "collections"
          ? "Collections Account"
          : "Payroll Account";
    const result = await submitPayment({
      accountNumber,
      bankName,
      recipientTag,
      amount: paymentAmount,
      sourceAccount,
      sourceAccountLabel: acctLabel,
      memo,
      schedule: paymentDate as "immediate" | "scheduled" | "recurring",
      submittedBy: {
        id: user?.id ?? "u-unknown",
        name: user?.full_name ?? "Unknown",
        role: (user?.role as "initiator" | "owner") ?? "initiator",
      },
    });
    setSubmitting(false);
    if (result.success) {
      toast.success("Payment submitted for approval");
      navigate("/payments");
    } else {
      toast.error(result.error ?? "Failed to submit payment");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          className="flex items-center gap-1.5 text-sm font-medium mb-3 transition-opacity hover:opacity-70"
          style={{ color: "rgb(var(--foreground-subtle))" }}
          onClick={() => navigate("/payments")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </button>
        <p className="eyebrow mb-1">Payments</p>
        <h1 className="display">New payment</h1>
        <p
          className="text-sm mt-1"
          style={{ color: "rgb(var(--foreground-subtle))" }}
        >
          Create a one-time, recurring or scheduled payment
        </p>
      </div>

      {/* Mobile step indicator */}
      <div className="flex sm:hidden items-center gap-2 pt-1">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className="h-7 w-7 rounded-pill flex items-center justify-center text-xs font-bold"
              style={{
                background:
                  step.id <= currentStep
                    ? "rgb(var(--brand-primary))"
                    : "rgb(var(--surface))",
                color:
                  step.id <= currentStep
                    ? "#fff"
                    : "rgb(var(--foreground-subtle))",
              }}
            >
              {step.id < currentStep ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                step.id
              )}
            </div>
            {step.id < steps.length && (
              <div
                className="w-6 h-0.5"
                style={{
                  background:
                    step.id < currentStep
                      ? "rgb(var(--brand-primary))"
                      : "rgb(var(--border))",
                }}
              />
            )}
          </div>
        ))}
        <span
          className="ml-2 text-sm font-semibold"
          style={{ color: "rgb(var(--foreground))" }}
        >
          {steps[currentStep - 1].label}
        </span>
      </div>

      {/* 2-col layout */}
      <div className="flex gap-8 xl:gap-12 items-start">
        {/* Left: stepper + form */}
        <div className="flex-1 min-w-0 flex gap-8 lg:gap-12">
          {/* Stepper sidebar — desktop */}
          <div className="hidden sm:block w-[180px] shrink-0 pt-1">
            <div className="space-y-0">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-0.5 shrink-0"
                      style={{
                        height: idx === 0 ? 0 : 20,
                        background:
                          step.id <= currentStep
                            ? "rgb(var(--brand-primary))"
                            : "rgb(var(--border))",
                      }}
                    />
                    <div
                      className="h-7 w-7 rounded-pill flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background:
                          step.id < currentStep
                            ? "rgb(var(--mint) / 0.4)"
                            : step.id === currentStep
                              ? "rgb(var(--brand-primary))"
                              : "rgb(var(--surface))",
                        color:
                          step.id < currentStep
                            ? "rgb(var(--mint-deep))"
                            : step.id === currentStep
                              ? "#fff"
                              : "rgb(var(--foreground-subtle))",
                      }}
                    >
                      {step.id < currentStep ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div
                      className="w-0.5 flex-1"
                      style={{
                        minHeight: 20,
                        background:
                          step.id < currentStep
                            ? "rgb(var(--brand-primary))"
                            : "rgb(var(--border))",
                        display: idx === steps.length - 1 ? "none" : undefined,
                      }}
                    />
                  </div>
                  <div className="pb-6 pt-1">
                    <span
                      className="text-sm"
                      style={{
                        color:
                          step.id === currentStep
                            ? "rgb(var(--foreground))"
                            : "rgb(var(--foreground-subtle))",
                        fontWeight: step.id === currentStep ? 600 : 400,
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form area */}
          <div className="flex-1 max-w-[520px]">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label
                    className="text-sm font-semibold mb-2 block"
                    style={{ color: "rgb(var(--foreground))" }}
                  >
                    Recipients
                  </Label>
                  <div
                    className="mt-2 grid grid-cols-2 gap-0 rounded-xl p-1"
                    style={{ background: "rgb(var(--surface))" }}
                  >
                    <button
                      onClick={() => setRecipientType("single")}
                      className="rounded-xl py-2.5 text-sm font-medium transition-colors"
                      style={{
                        background:
                          recipientType === "single"
                            ? "rgb(var(--surface-highest))"
                            : "transparent",
                        color:
                          recipientType === "single"
                            ? "rgb(var(--foreground))"
                            : "rgb(var(--foreground-subtle))",
                        boxShadow:
                          recipientType === "single"
                            ? "0 1px 3px rgba(0,0,0,0.08)"
                            : undefined,
                      }}
                    >
                      Single recipient
                    </button>
                    <button
                      onClick={() => setRecipientType("multiple")}
                      className="rounded-xl py-2.5 text-sm font-medium transition-colors"
                      style={{
                        background:
                          recipientType === "multiple"
                            ? "rgb(var(--surface-highest))"
                            : "transparent",
                        color:
                          recipientType === "multiple"
                            ? "rgb(var(--foreground))"
                            : "rgb(var(--foreground-subtle))",
                        boxShadow:
                          recipientType === "multiple"
                            ? "0 1px 3px rgba(0,0,0,0.08)"
                            : undefined,
                      }}
                    >
                      Multiple recipients
                    </button>
                  </div>
                </div>

                {recipientType === "single" ? (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label
                          className="text-sm font-semibold"
                          style={{ color: "rgb(var(--foreground))" }}
                        >
                          Account number
                        </Label>
                        <button
                          className="text-xs font-semibold"
                          style={{ color: "rgb(var(--brand-primary))" }}
                        >
                          Select recipient
                        </button>
                      </div>
                      <Input
                        placeholder="Enter account number"
                        value={accountNumber}
                        onChange={(e) =>
                          setAccountNumber(
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                        maxLength={10}
                      />
                    </div>
                    <div>
                      <Label
                        className="text-sm font-semibold mb-2 block"
                        style={{ color: "rgb(var(--foreground))" }}
                      >
                        Bank name
                      </Label>
                      <Select value={bankName} onValueChange={setBankName}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((b) => (
                            <SelectItem key={b} value={b}>
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        className="text-sm font-semibold mb-2 block"
                        style={{ color: "rgb(var(--foreground))" }}
                      >
                        Recipient tag
                      </Label>
                      <Select
                        value={recipientTag}
                        onValueChange={setRecipientTag}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {recipientTags.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        className="text-sm font-semibold mb-2 block"
                        style={{ color: "rgb(var(--foreground))" }}
                      >
                        Amount
                      </Label>
                      <div className="relative">
                        <span
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                          style={{ color: "rgb(var(--foreground-subtle))" }}
                        >
                          ₦
                        </span>
                        <Input
                          className="pl-7"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) =>
                            setAmount(e.target.value.replace(/[^0-9.]/g, ""))
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <button
                      className="w-full h-12 rounded-xl text-sm font-semibold border-2 border-dashed transition-colors"
                      style={{
                        borderColor: "rgb(var(--brand-primary) / 0.3)",
                        color: "rgb(var(--brand-primary))",
                      }}
                    >
                      Select recipients
                    </button>
                    <button
                      className="w-full h-12 rounded-xl text-sm font-semibold border-2 border-dashed transition-colors"
                      style={{
                        borderColor: "rgb(var(--brand-primary) / 0.3)",
                        color: "rgb(var(--brand-primary))",
                      }}
                    >
                      Import from CSV
                    </button>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleContinue}
                    disabled={!canContinueStep1}
                    className="btn-pill btn-primary px-8 w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label
                    className="text-sm font-semibold mb-2 block"
                    style={{ color: "rgb(var(--foreground))" }}
                  >
                    Source account
                  </Label>
                  <Select
                    value={sourceAccount}
                    onValueChange={setSourceAccount}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source account" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(sourceAccounts).map(([key, acct]) => (
                        <SelectItem key={key} value={key}>
                          {acct.label} — ₦{" "}
                          {acct.balance.toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedAcct && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "rgb(var(--foreground-subtle))" }}
                    >
                      Available: ₦{" "}
                      {selectedAcct.balance.toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  )}
                  {insufficientBalance && (
                    <div
                      className="flex items-center gap-1.5 mt-2 p-2.5 rounded-xl"
                      style={{
                        background: "rgb(var(--destructive) / 0.08)",
                        border: "1px solid rgb(var(--destructive) / 0.2)",
                      }}
                    >
                      <AlertCircle
                        className="h-3.5 w-3.5 shrink-0"
                        style={{ color: "rgb(var(--destructive))" }}
                      />
                      <p
                        className="text-xs font-medium"
                        style={{ color: "rgb(var(--destructive))" }}
                      >
                        Insufficient balance. Amount (₦{" "}
                        {paymentAmount.toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                        })}
                        ) exceeds available funds.
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <Label
                    className="text-sm font-semibold mb-2 block"
                    style={{ color: "rgb(var(--foreground))" }}
                  >
                    Payment memo
                  </Label>
                  <Textarea
                    placeholder="Describe the purpose of this payment"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    maxLength={200}
                    rows={3}
                  />
                  <p
                    className="text-xs mt-1"
                    style={{ color: "rgb(var(--foreground-subtle))" }}
                  >
                    {memo.length}/200
                  </p>
                </div>
                <div>
                  <Label
                    className="text-sm font-semibold mb-2 block"
                    style={{ color: "rgb(var(--foreground))" }}
                  >
                    Payment schedule
                  </Label>
                  <Select value={paymentDate} onValueChange={setPaymentDate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">
                        Send immediately
                      </SelectItem>
                      <SelectItem value="scheduled">
                        Schedule for later
                      </SelectItem>
                      <SelectItem value="recurring">
                        Set up recurring
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-2">
                  <button
                    onClick={handleBack}
                    className="btn-pill btn-outline w-full sm:w-auto"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={!canContinueStep2 || !!insufficientBalance}
                    className="btn-pill btn-primary px-8 w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <p className="eyebrow">Review payment details</p>
                {/* Dark ink review card */}
                <div
                  className="rounded-2xl p-5 relative overflow-hidden"
                  style={{ background: "rgb(var(--foreground))" }}
                >
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgb(var(--brand-primary) / 0.2) 0%, transparent 70%)",
                      transform: "translate(20%, -30%)",
                    }}
                  />
                  <p
                    className="text-xs mb-1"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Payment amount
                  </p>
                  <p
                    className="text-3xl font-bold num mb-4"
                    style={{ color: "#fff", fontFamily: "Manrope, sans-serif" }}
                  >
                    {amount
                      ? `₦ ${Number(amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
                      : "₦ —"}
                  </p>
                  <div
                    className="space-y-2.5 pt-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    {[
                      {
                        label: "Recipient",
                        value: accountNumber || "Multiple recipients",
                      },
                      bankName && { label: "Bank", value: bankName },
                      recipientTag && { label: "Tag", value: recipientTag },
                      {
                        label: "Source account",
                        value:
                          sourceAccount === "operating"
                            ? "Operating Account"
                            : sourceAccount === "collections"
                              ? "Collections Account"
                              : "Payroll Account",
                      },
                      { label: "Memo", value: memo },
                      {
                        label: "Schedule",
                        value:
                          paymentDate === "immediate"
                            ? "Immediately"
                            : paymentDate === "scheduled"
                              ? "Scheduled"
                              : "Recurring",
                      },
                    ]
                      .filter(Boolean)
                      .map(
                        (row) =>
                          row && (
                            <div
                              key={row.label}
                              className="flex justify-between text-sm gap-4"
                            >
                              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                                {row.label}
                              </span>
                              <span
                                className="text-right font-medium"
                                style={{ color: "rgba(255,255,255,0.9)" }}
                              >
                                {row.value}
                              </span>
                            </div>
                          ),
                      )}
                  </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-2">
                  <button
                    onClick={handleBack}
                    className="btn-pill btn-outline w-full sm:w-auto"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-pill btn-primary px-8 w-full sm:w-auto disabled:opacity-40"
                  >
                    {submitting ? "Submitting…" : "Submit for approval"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar: paying-from card */}
        {(currentStep === 2 || currentStep === 3) && selectedAcct && (
          <div className="hidden xl:block w-[260px] shrink-0">
            <div
              className="rounded-2xl p-5 shadow-card"
              style={{ background: "rgb(var(--foreground))" }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgb(var(--brand-primary) / 0.2) 0%, transparent 70%)",
                  transform: "translate(30%, -30%)",
                }}
              />
              <p
                className="text-xs mb-3"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Paying from
              </p>
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "#fff" }}
              >
                {selectedAcct.label}
              </p>
              <p
                className="text-lg font-bold num"
                style={{ color: "#fff", fontFamily: "Manrope, sans-serif" }}
              >
                ₦{" "}
                {selectedAcct.balance.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
              </p>
              {paymentAmount > 0 && (
                <div
                  className="mt-4 pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>
                      Payment amount
                    </span>
                    <span style={{ color: "#fff" }}>
                      ₦{" "}
                      {paymentAmount.toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>
                      After payment
                    </span>
                    <span
                      style={{
                        color: insufficientBalance
                          ? "rgb(var(--destructive))"
                          : "rgb(var(--mint))",
                      }}
                    >
                      ₦{" "}
                      {Math.max(
                        0,
                        selectedAcct.balance - paymentAmount,
                      ).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
