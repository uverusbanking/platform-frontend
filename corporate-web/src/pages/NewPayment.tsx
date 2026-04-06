import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertCircle } from "lucide-react";
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
  "Access Bank", "First Bank of Nigeria", "Guaranty Trust Bank",
  "United Bank for Africa", "Zenith Bank", "Stanbic IBTC",
  "Fidelity Bank", "Union Bank", "Wema Bank", "Sterling Bank",
];

const recipientTags = ["Vendor", "Contractor", "Employee", "Partner", "Utility"];

export default function NewPayment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [recipientType, setRecipientType] = useState<"single" | "multiple">("single");

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
  const insufficientBalance = selectedAcct && paymentAmount > 0 && paymentAmount > selectedAcct.balance;

  const handleContinue = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const acctLabel = sourceAccount === "operating" ? "Operating Account" : sourceAccount === "collections" ? "Collections Account" : "Payroll Account";
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
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 -ml-2 text-muted-foreground"
          onClick={() => navigate("/payments")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Payments
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
          New payment
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a one-time, recurring or scheduled payment
        </p>
      </div>

      <div className="border-t" />

      {/* Mobile step indicator */}
      <div className="flex sm:hidden items-center gap-2 pt-2">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-2">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${
              step.id === currentStep
                ? "bg-primary text-primary-foreground"
                : step.id < currentStep
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            }`}>
              {step.id}
            </div>
            {step.id < steps.length && (
              <div className={`w-6 h-0.5 ${step.id < currentStep ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
        <span className="ml-2 text-sm font-medium text-foreground">{steps[currentStep - 1].label}</span>
      </div>

      {/* Layout: stepper + form */}
      <div className="flex gap-8 lg:gap-16 pt-2 sm:pt-4">
        {/* Left stepper - hidden on mobile */}
        <div className="hidden sm:block w-[180px] lg:w-[200px] shrink-0">
          <div className="space-y-0">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-0">
                <div className="flex flex-col items-center">
                  <div className={`w-0.5 ${step.id === 1 ? "h-0" : "h-4"} ${step.id <= currentStep ? "bg-primary" : "bg-border"}`} />
                  <div className={`w-0.5 ${step.id === steps.length ? "h-0" : "h-4"} ${step.id < currentStep ? "bg-primary" : "bg-border"}`} />
                </div>
                <div className="pl-3 pb-6">
                  <span className={`text-sm ${
                    step.id === currentStep
                      ? "font-semibold text-foreground"
                      : step.id < currentStep
                      ? "text-muted-foreground"
                      : "text-muted-foreground/60"
                  }`}>
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form area */}
        <div className="flex-1 max-w-[520px]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-semibold">Recipients</Label>
                <div className="mt-2 grid grid-cols-2 gap-0 rounded-lg bg-muted p-1">
                  <button
                    onClick={() => setRecipientType("single")}
                    className={`rounded-md py-2.5 text-sm font-medium transition-colors ${
                      recipientType === "single"
                        ? "bg-background shadow-sm border border-border text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Single recipient
                  </button>
                  <button
                    onClick={() => setRecipientType("multiple")}
                    className={`rounded-md py-2.5 text-sm font-medium transition-colors ${
                      recipientType === "multiple"
                        ? "bg-background shadow-sm border border-border text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Multiple recipients
                  </button>
                </div>
              </div>

              {recipientType === "single" ? (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-semibold">Account number</Label>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">Select recipient</Button>
                    </div>
                    <Input
                      placeholder="Enter account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Bank name</Label>
                    <Select value={bankName} onValueChange={setBankName}>
                      <SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger>
                      <SelectContent>
                        {banks.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Recipient tag</Label>
                    <Select value={recipientTag} onValueChange={setRecipientTag}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {recipientTags.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₦</span>
                      <Input className="pl-7" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <Button variant="outline" className="w-full h-12 text-primary border-primary/30 hover:bg-primary/5">Select recipients</Button>
                  <Button variant="outline" className="w-full h-12 text-primary border-primary/30 hover:bg-primary/5">Import from CSV</Button>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button onClick={handleContinue} disabled={!canContinueStep1} className="px-8 w-full sm:w-auto">Continue</Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Source account</Label>
                <Select value={sourceAccount} onValueChange={setSourceAccount}>
                  <SelectTrigger><SelectValue placeholder="Select source account" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(sourceAccounts).map(([key, acct]) => (
                      <SelectItem key={key} value={key}>
                        {acct.label} — ₦ {acct.balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedAcct && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Available balance: ₦ {selectedAcct.balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </p>
                )}
                {insufficientBalance && (
                  <div className="flex items-center gap-1.5 mt-2 p-2 rounded-md bg-destructive/10 border border-destructive/20">
                    <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                    <p className="text-xs text-destructive font-medium">
                      Insufficient balance. Payment amount (₦ {paymentAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}) exceeds available funds.
                    </p>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">Payment memo</Label>
                <Textarea placeholder="Describe the purpose of this payment" value={memo} onChange={(e) => setMemo(e.target.value)} maxLength={200} rows={3} />
                <p className="text-xs text-muted-foreground mt-1">{memo.length}/200</p>
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">Payment schedule</Label>
                <Select value={paymentDate} onValueChange={setPaymentDate}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Send immediately</SelectItem>
                    <SelectItem value="scheduled">Schedule for later</SelectItem>
                    <SelectItem value="recurring">Set up recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
                <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">Back</Button>
                <Button onClick={handleContinue} disabled={!canContinueStep2 || !!insufficientBalance} className="px-8 w-full sm:w-auto">Continue</Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold">Review payment details</h3>
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recipient</span>
                  <span className="font-medium text-right">{accountNumber || "Multiple recipients"}</span>
                </div>
                {bankName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bank</span>
                    <span>{bankName}</span>
                  </div>
                )}
                {recipientTag && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tag</span>
                    <span>{recipientTag}</span>
                  </div>
                )}
                {amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold">₦ {Number(amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-sm">
                  <span className="text-muted-foreground">Source account</span>
                  <span className="text-right">{sourceAccount === "operating" ? "Operating Account" : sourceAccount === "collections" ? "Collections Account" : "Payroll Account"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Memo</span>
                  <span className="text-right max-w-[60%]">{memo}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Schedule</span>
                  <span>{paymentDate === "immediate" ? "Immediately" : paymentDate === "scheduled" ? "Scheduled" : "Recurring"}</span>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
                <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">Back</Button>
                <Button onClick={handleSubmit} disabled={submitting} className="px-8 w-full sm:w-auto">
                  {submitting ? "Submitting…" : "Submit for approval"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
