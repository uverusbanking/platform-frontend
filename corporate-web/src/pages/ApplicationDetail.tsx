import { useParams, useNavigate } from "react-router-dom";
import { getApplicationById } from "@/services/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, AlertCircle, CheckCircle2, Clock, Building2, FileText, Users, Settings,
} from "lucide-react";
import {
  STATUS_LABELS, INDUSTRY_LABELS, BUSINESS_TYPE_LABELS, DOCUMENT_TYPE_LABELS,
  DIRECTOR_ROLE_LABELS, ACCOUNT_TYPE_LABELS, SIGNING_RULE_LABELS,
  type ApplicationStatus,
} from "@/types/onboarding";
import { formatDistanceToNow } from "date-fns";

const statusColor: Record<ApplicationStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-warning/10 text-warning border-warning/20",
  under_review: "bg-primary/10 text-primary border-primary/20",
  approved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  returned_for_correction: "bg-warning/10 text-warning border-warning/20",
};

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = getApplicationById(id ?? "");

  if (!app) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Application not found.</p>
        <Button variant="link" onClick={() => navigate("/dashboard")}>Return to dashboard</Button>
      </div>
    );
  }

  const ci = app.company_info;
  const ac = app.account_config;
  const formatNaira = (v?: number) => v != null ? `₦${v.toLocaleString()}` : "—";

  const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value ?? "—"}</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{ci?.company_name ?? "Untitled"}</h2>
            <Badge variant="outline" className={statusColor[app.status]}>{STATUS_LABELS[app.status]}</Badge>
            {app.risk_score && (
              <Badge className={
                app.risk_score.classification === "high" ? "bg-destructive text-destructive-foreground" :
                app.risk_score.classification === "medium" ? "bg-warning text-warning-foreground" :
                "bg-success text-success-foreground"
              }>
                {app.risk_score.classification} risk
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Created {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
            {app.submitted_at && ` · Submitted ${formatDistanceToNow(new Date(app.submitted_at), { addSuffix: true })}`}
          </p>
        </div>
        {(app.status === "draft" || app.status === "returned_for_correction") && (
          <Button onClick={() => navigate(`/onboarding/${app.id}`)}>Continue Editing</Button>
        )}
      </div>

      {/* Step completion */}
      <Card>
        <CardContent className="pt-5">
          <h3 className="font-semibold mb-3">Step Completion</h3>
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: "Company Info", done: app.steps_completed.company_info, icon: Building2 },
              { label: "Documents", done: app.steps_completed.documents, icon: FileText },
              { label: "Directors", done: app.steps_completed.directors, icon: Users },
              { label: "Account Config", done: app.steps_completed.account_config, icon: Settings },
              { label: "Review", done: app.steps_completed.review, icon: CheckCircle2 },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 text-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${s.done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      {app.feedback.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Feedback ({app.feedback.filter((f) => !f.resolved).length} items)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {app.feedback.map((fb) => (
              <div key={fb.id} className="flex items-start gap-2 p-3 bg-destructive/5 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{fb.target_label}</p>
                  <p className="text-xs text-muted-foreground">{fb.comment}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">— {fb.created_by}</p>
                </div>
                <Badge variant="outline" className="ml-auto shrink-0 text-xs">{fb.severity === "required_fix" ? "Required Fix" : "Advisory"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Company Info */}
      {ci && (
        <Card>
          <CardHeader><CardTitle className="text-base">Company Information</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Company Name" value={ci.company_name} />
              <Field label="RC Number" value={ci.rc_number} />
              <Field label="TIN" value={ci.tin} />
              <Field label="Incorporation" value={ci.date_of_incorporation} />
              <Field label="Industry" value={INDUSTRY_LABELS[ci.industry]} />
              <Field label="Business Type" value={BUSINESS_TYPE_LABELS[ci.business_type]} />
              <Field label="Address" value={`${ci.registered_address}, ${ci.city}, ${ci.state}`} />
              <Field label="Phone" value={ci.phone_number} />
              <Field label="Email" value={ci.email} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Directors */}
      {app.directors.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Directors & Signatories</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {app.directors.map((dir) => (
                <div key={dir.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{dir.full_name}</p>
                    <p className="text-xs text-muted-foreground">{DIRECTOR_ROLE_LABELS[dir.role]} · {dir.email}</p>
                  </div>
                  <Badge variant="outline" className={
                    dir.verification_status === "verified" ? "bg-success/10 text-success border-success/20" :
                    "bg-muted text-muted-foreground"
                  }>
                    {dir.verification_status.replace(/_/g, " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Config */}
      {ac && (
        <Card>
          <CardHeader><CardTitle className="text-base">Account Configuration</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Account Type" value={ACCOUNT_TYPE_LABELS[ac.account_type]} />
              <Field label="Currency" value={ac.primary_currency} />
              <Field label="Daily Limit" value={formatNaira(ac.daily_transaction_limit)} />
              <Field label="Per Txn Limit" value={formatNaira(ac.per_transaction_limit)} />
              <Field label="Signing Rule" value={SIGNING_RULE_LABELS[ac.signing_rule]} />
              <Field label="Required Signatories" value={ac.required_signatories} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader><CardTitle className="text-base">Activity Timeline</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {app.timeline.map((event) => (
              <div key={event.id} className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-sm">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
