import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import type { AccountConfig, FeedbackItem, AccountType, Currency, SigningRule } from "@/types/onboarding";
import { ACCOUNT_TYPE_LABELS, SIGNING_RULE_LABELS } from "@/types/onboarding";

interface Props {
  data: AccountConfig | null;
  signatoryCount: number;
  feedback: FeedbackItem[];
  onSave: (data: AccountConfig) => void;
  onBack: () => void;
}

const defaultConfig: AccountConfig = {
  account_type: "current",
  primary_currency: "NGN",
  additional_currencies: [],
  daily_transaction_limit: 10000000,
  per_transaction_limit: 5000000,
  required_signatories: 1,
  signing_rule: "any_one",
};

const currencies: Currency[] = ["NGN", "USD", "GBP", "EUR"];

export default function StepAccountConfig({ data, signatoryCount, feedback, onSave, onBack }: Props) {
  const [form, setForm] = useState<AccountConfig>(data ?? defaultConfig);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (form.per_transaction_limit > form.daily_transaction_limit) {
      errs.per_transaction_limit = "Cannot exceed daily limit";
    }
    if (form.signing_rule === "custom" && !form.custom_signing_rule_description) {
      errs.custom_signing_rule_description = "Describe the custom signing rule";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  const toggleCurrency = (cur: Currency) => {
    setForm((f) => ({
      ...f,
      additional_currencies: f.additional_currencies.includes(cur)
        ? f.additional_currencies.filter((c) => c !== cur)
        : [...f.additional_currencies, cur],
    }));
  };

  const formatNaira = (val: number) =>
    `₦${val.toLocaleString()}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Configuration</CardTitle>
        <CardDescription>Step 4 of 5 — Configure your corporate account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Account Type *</Label>
              <Select
                value={form.account_type}
                onValueChange={(v) => {
                  const at = v as AccountType;
                  setForm((f) => ({
                    ...f,
                    account_type: at,
                    primary_currency: at === "domiciliary" ? "USD" : f.primary_currency,
                  }));
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ACCOUNT_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Primary Currency *</Label>
              <Select value={form.primary_currency} onValueChange={(v) => setForm((f) => ({ ...f, primary_currency: v as Currency }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Additional Currencies</Label>
            <div className="flex gap-4">
              {currencies
                .filter((c) => c !== form.primary_currency)
                .map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={form.additional_currencies.includes(c)}
                      onCheckedChange={() => toggleCurrency(c)}
                    />
                    {c}
                  </label>
                ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daily_limit">Daily Transaction Limit *</Label>
              <Input
                id="daily_limit"
                type="number"
                value={form.daily_transaction_limit}
                onChange={(e) => setForm((f) => ({ ...f, daily_transaction_limit: Number(e.target.value) }))}
                min={0}
                max={50000000000}
                step={1000}
              />
              <p className="text-xs text-muted-foreground">{formatNaira(form.daily_transaction_limit)}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="per_txn_limit">Per Transaction Limit *</Label>
              <Input
                id="per_txn_limit"
                type="number"
                value={form.per_transaction_limit}
                onChange={(e) => setForm((f) => ({ ...f, per_transaction_limit: Number(e.target.value) }))}
                min={0}
                step={1000}
              />
              {errors.per_transaction_limit && <p className="text-xs text-destructive">{errors.per_transaction_limit}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="req_sig">Required Signatories *</Label>
              <Input
                id="req_sig"
                type="number"
                value={form.required_signatories}
                onChange={(e) => setForm((f) => ({ ...f, required_signatories: Number(e.target.value) }))}
                min={1}
                max={5}
              />
              {signatoryCount > 0 && (
                <p className="text-xs text-muted-foreground">{signatoryCount} signator{signatoryCount > 1 ? "ies" : "y"} available from Step 3</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Signing Rule *</Label>
              <Select value={form.signing_rule} onValueChange={(v) => setForm((f) => ({ ...f, signing_rule: v as SigningRule }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(SIGNING_RULE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.signing_rule === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="custom_rule">Custom Signing Rule Description *</Label>
              <Input
                id="custom_rule"
                value={form.custom_signing_rule_description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, custom_signing_rule_description: e.target.value }))}
              />
              {errors.custom_signing_rule_description && (
                <p className="text-xs text-destructive">{errors.custom_signing_rule_description}</p>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="approval_threshold">Approval Threshold (₦)</Label>
              <Input
                id="approval_threshold"
                type="number"
                value={form.approval_threshold ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, approval_threshold: e.target.value ? Number(e.target.value) : undefined }))}
                min={0}
              />
              <p className="text-xs text-muted-foreground">Transactions above this amount require additional approval</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sms_phone">SMS Alert Phone</Label>
              <Input id="sms_phone" value={form.sms_alert_phone ?? ""} onChange={(e) => setForm((f) => ({ ...f, sms_alert_phone: e.target.value }))} placeholder="+234..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_alert">Email Alert Address</Label>
              <Input id="email_alert" type="email" value={form.email_alert_address ?? ""} onChange={(e) => setForm((f) => ({ ...f, email_alert_address: e.target.value }))} />
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" type="button" onClick={onBack}>Back</Button>
            <Button type="submit">Save & Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
