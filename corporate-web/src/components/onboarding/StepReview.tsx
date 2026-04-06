import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Pencil, AlertCircle, ShieldCheck } from "lucide-react";
import type { Application } from "@/types/onboarding";
import {
  INDUSTRY_LABELS,
  BUSINESS_TYPE_LABELS,
  DOCUMENT_TYPE_LABELS,
  DIRECTOR_ROLE_LABELS,
  ID_TYPE_LABELS,
  ACCOUNT_TYPE_LABELS,
  SIGNING_RULE_LABELS,
} from "@/types/onboarding";

interface Props {
  application: Application;
  onSubmit: () => void;
  onBack: () => void;
  onEditStep: (step: number) => void;
}

export default function StepReview({ application, onSubmit, onBack, onEditStep }: Props) {
  const [accepted, setAccepted] = useState(false);
  const ci = application.company_info;
  const ac = application.account_config;
  const risk = application.risk_score;

  const SectionHeader = ({ title, step }: { title: string; step: number }) => (
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-base">{title}</h3>
      <Button size="sm" variant="ghost" onClick={() => onEditStep(step)} className="gap-1.5 text-xs">
        <Pencil className="h-3.5 w-3.5" /> Edit
      </Button>
    </div>
  );

  const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value ?? "—"}</p>
    </div>
  );

  const formatNaira = (val?: number) => val != null ? `₦${val.toLocaleString()}` : "—";

  return (
    <div className="space-y-4">
      {/* Company Info */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeader title="Company Information" step={1} />
          {ci ? (
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Company Name" value={ci.company_name} />
              <Field label="RC Number" value={ci.rc_number} />
              <Field label="TIN" value={ci.tin} />
              <Field label="Date of Incorporation" value={ci.date_of_incorporation} />
              <Field label="Industry" value={INDUSTRY_LABELS[ci.industry]} />
              <Field label="Business Type" value={BUSINESS_TYPE_LABELS[ci.business_type]} />
              <Field label="Address" value={ci.registered_address} />
              <Field label="City" value={ci.city} />
              <Field label="State" value={ci.state} />
              <Field label="Phone" value={ci.phone_number} />
              <Field label="Email" value={ci.email} />
              <Field label="Website" value={ci.website} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not completed</p>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeader title="KYC Documents" step={2} />
          <div className="space-y-2">
            {application.documents.map((doc) => (
              <div key={doc.document_type} className="flex items-center justify-between text-sm">
                <span>{DOCUMENT_TYPE_LABELS[doc.document_type]}{doc.required && " *"}</span>
                <Badge
                  variant="outline"
                  className={
                    doc.status === "verified" ? "bg-success/10 text-success border-success/20" :
                    doc.status === "uploaded" ? "bg-primary/10 text-primary border-primary/20" :
                    doc.status === "rejected" ? "bg-destructive/10 text-destructive border-destructive/20" :
                    "bg-muted text-muted-foreground"
                  }
                >
                  {doc.status === "not_uploaded" ? "Missing" : doc.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Directors */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeader title="Directors & Signatories" step={3} />
          {application.directors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No directors added</p>
          ) : (
            <div className="space-y-3">
              {application.directors.map((dir) => (
                <div key={dir.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{dir.full_name}</p>
                    <p className="text-xs text-muted-foreground">{DIRECTOR_ROLE_LABELS[dir.role]} · {dir.email}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      dir.verification_status === "verified" ? "bg-success/10 text-success border-success/20" :
                      dir.verification_status === "failed" || dir.verification_status === "expired" ? "bg-destructive/10 text-destructive border-destructive/20" :
                      "bg-primary/10 text-primary border-primary/20"
                    }
                  >
                    {dir.verification_status.replace(/_/g, " ")}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Config */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeader title="Account Configuration" step={4} />
          {ac ? (
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Account Type" value={ACCOUNT_TYPE_LABELS[ac.account_type]} />
              <Field label="Primary Currency" value={ac.primary_currency} />
              <Field label="Additional Currencies" value={ac.additional_currencies.join(", ") || "None"} />
              <Field label="Daily Limit" value={formatNaira(ac.daily_transaction_limit)} />
              <Field label="Per Transaction Limit" value={formatNaira(ac.per_transaction_limit)} />
              <Field label="Required Signatories" value={ac.required_signatories} />
              <Field label="Signing Rule" value={SIGNING_RULE_LABELS[ac.signing_rule]} />
              <Field label="Approval Threshold" value={formatNaira(ac.approval_threshold)} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not completed</p>
          )}
        </CardContent>
      </Card>

      {/* Risk Score */}
      {risk && (
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="font-semibold text-base">Risk Classification</h3>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Badge
                className={
                  risk.classification === "high" ? "bg-destructive text-destructive-foreground" :
                  risk.classification === "medium" ? "bg-warning text-warning-foreground" :
                  "bg-success text-success-foreground"
                }
              >
                {risk.classification.toUpperCase()} RISK
              </Badge>
              <span className="text-sm text-muted-foreground">Score: {risk.total_score}</span>
            </div>
            <div className="space-y-1">
              {risk.breakdown.map((b) => (
                <div key={b.criteria} className="flex items-center justify-between text-sm">
                  <span className={b.triggered ? "text-foreground" : "text-muted-foreground"}>{b.criteria}</span>
                  <span className={b.triggered ? "font-medium" : "text-muted-foreground"}>+{b.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback */}
      {application.feedback.length > 0 && (
        <Card className="border-destructive/30">
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-base text-destructive">Items Requiring Attention</h3>
            </div>
            <div className="space-y-2">
              {application.feedback.filter((f) => !f.resolved).map((fb) => (
                <div key={fb.id} className="flex items-start gap-2 p-2 bg-destructive/5 rounded">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{fb.target_label}</p>
                    <p className="text-xs text-muted-foreground">{fb.comment}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">— {fb.created_by}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Declaration */}
      <div className="flex items-start gap-3 p-4 border rounded-lg bg-card">
        <Checkbox
          id="declaration"
          checked={accepted}
          onCheckedChange={(checked) => setAccepted(checked === true)}
        />
        <label htmlFor="declaration" className="text-sm leading-relaxed cursor-pointer">
          I confirm that the information provided is accurate and complete. I understand that any false or misleading information may result in the rejection of this application.
        </label>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <div className="flex gap-2">
          <Button variant="outline">Save as Draft</Button>
          <Button onClick={onSubmit} disabled={!accepted}>Submit for Review</Button>
        </div>
      </div>
    </div>
  );
}
