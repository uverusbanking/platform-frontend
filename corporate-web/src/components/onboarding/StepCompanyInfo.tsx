import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ArrowRight, Lock } from "lucide-react";
import type { CompanyInfo, FeedbackItem, Industry, BusinessType } from "@/types/onboarding";
import { INDUSTRY_LABELS, BUSINESS_TYPE_LABELS, NIGERIAN_STATES } from "@/types/onboarding";

interface Props {
  data: CompanyInfo | null;
  feedback: FeedbackItem[];
  onSave: (data: CompanyInfo) => void;
}

const defaultData: CompanyInfo = {
  company_name: "", rc_number: "", tin: "", date_of_incorporation: "",
  industry: "technology", business_type: "limited_liability",
  registered_address: "", city: "", state: "", country: "Nigeria",
  phone_number: "", email: "",
};

const inputClass = "h-12 bg-surface-low border-0 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 transition-all duration-150";
const labelClass = "text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase";
const selectTriggerClass = "h-12 bg-surface-low border-0 rounded-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:ring-offset-0";

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 pt-6 pb-2">
      <div className="flex-1 h-px bg-surface-high" />
      <span className="text-[11px] font-bold tracking-[0.08em] text-primary uppercase" style={{ fontFamily: 'Manrope, sans-serif' }}>
        {title}
      </span>
    </div>
  );
}

export default function StepCompanyInfo({ data, feedback, onSave }: Props) {
  const [form, setForm] = useState<CompanyInfo>(data ?? defaultData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof CompanyInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const selectUpdate = (field: keyof CompanyInfo) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const feedbackFor = (field: string) => feedback.find((f) => f.target_id === field);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (form.company_name.length < 2) errs.company_name = "Company name is required";
    if (!/^[A-Za-z0-9]{6,10}$/.test(form.rc_number)) errs.rc_number = "RC Number must be 6-10 alphanumeric characters";
    if (!/^[0-9]{10,12}$/.test(form.tin)) errs.tin = "TIN must be 10-12 digits";
    if (!form.date_of_incorporation) errs.date_of_incorporation = "Date is required";
    if (!form.registered_address || form.registered_address.length < 5) errs.registered_address = "Address is required (min 5 chars)";
    if (!form.city) errs.city = "City is required";
    if (!form.state) errs.state = "State is required";
    if (!form.phone_number) errs.phone_number = "Phone number is required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  const FieldFeedback = ({ field }: { field: string }) => {
    const fb = feedbackFor(field);
    if (!fb) return null;
    return (
      <div className="flex items-start gap-1.5 mt-1">
        <AlertCircle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
        <span className="text-xs text-destructive">{fb.comment}</span>
      </div>
    );
  };

  const FieldError = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return <p className="text-xs text-destructive mt-1">{errors[field]}</p>;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      {/* Legal Identity section */}
      <SectionDivider title="Legal Identity" />

      <div className="space-y-5 pt-4">
        <div className="space-y-2">
          <Label htmlFor="company_name" className={labelClass}>Company Name</Label>
          <Input id="company_name" value={form.company_name} onChange={update("company_name")} placeholder="Legal name as registered with CAC" className={inputClass} />
          <FieldError field="company_name" />
          <FieldFeedback field="company_name" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rc_number" className={labelClass}>RC Number</Label>
            <Input id="rc_number" value={form.rc_number} onChange={update("rc_number")} placeholder="RC1234567" className={inputClass} />
            <FieldError field="rc_number" />
            <FieldFeedback field="rc_number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tin" className={labelClass}>TIN</Label>
            <Input id="tin" value={form.tin} onChange={update("tin")} placeholder="Tax Identification Number" className={inputClass} />
            <FieldError field="tin" />
            <FieldFeedback field="tin" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date_of_incorporation" className={labelClass}>Date of Incorporation</Label>
            <Input id="date_of_incorporation" type="date" value={form.date_of_incorporation} onChange={update("date_of_incorporation")} max={new Date().toISOString().split("T")[0]} className={inputClass} />
            <FieldError field="date_of_incorporation" />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Business Type</Label>
            <Select value={form.business_type} onValueChange={selectUpdate("business_type")}>
              <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(BUSINESS_TYPE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Industry & Sector */}
      <SectionDivider title="Industry & Sector" />

      <div className="pt-4">
        <div className="space-y-2">
          <Label className={labelClass}>Industry/Sector</Label>
          <Select value={form.industry} onValueChange={selectUpdate("industry")}>
            <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(INDUSTRY_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Registered Address */}
      <SectionDivider title="Registered Address" />

      <div className="space-y-5 pt-4">
        <div className="space-y-2">
          <Label htmlFor="registered_address" className={labelClass}>Street Address</Label>
          <Input id="registered_address" value={form.registered_address} onChange={update("registered_address")} placeholder="Full registered physical address" className={inputClass} />
          <FieldError field="registered_address" />
          <FieldFeedback field="registered_address" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className={labelClass}>City</Label>
            <Input id="city" value={form.city} onChange={update("city")} placeholder="Lagos" className={inputClass} />
            <FieldError field="city" />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>State</Label>
            <Select value={form.state} onValueChange={selectUpdate("state")}>
              <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {NIGERIAN_STATES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError field="state" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country" className={labelClass}>Country</Label>
            <Input id="country" value={form.country} onChange={update("country")} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className={labelClass}>Corporate Email</Label>
            <Input id="email" type="email" value={form.email} onChange={update("email")} placeholder="contact@company.com" className={inputClass} />
            <FieldError field="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number" className={labelClass}>Phone Number</Label>
            <Input id="phone_number" value={form.phone_number} onChange={update("phone_number")} placeholder="+234" className={inputClass} />
            <FieldError field="phone_number" />
          </div>
        </div>
      </div>

      {/* Submit area */}
      <div className="flex items-center justify-end gap-4 pt-10">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          All data is encrypted via 256-bit SSL
        </div>
        <Button
          type="submit"
          className="h-11 px-8 rounded-sm text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-none transition-all duration-150 gap-2"
        >
          Next Stage <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
