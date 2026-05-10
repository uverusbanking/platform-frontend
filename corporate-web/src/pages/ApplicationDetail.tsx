import { useParams, useNavigate } from "react-router-dom";
import { getApplicationById } from "@/services/mockData";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  Users,
  Settings,
} from "lucide-react";
import {
  STATUS_LABELS,
  INDUSTRY_LABELS,
  BUSINESS_TYPE_LABELS,
  DIRECTOR_ROLE_LABELS,
  ACCOUNT_TYPE_LABELS,
  SIGNING_RULE_LABELS,
  type ApplicationStatus,
} from "@/types/onboarding";
import { formatDistanceToNow } from "date-fns";

const statusStyles: Record<ApplicationStatus, { bg: string; color: string }> = {
  draft: { bg: "rgb(var(--surface))", color: "rgb(var(--foreground-subtle))" },
  submitted: { bg: "rgb(var(--lemon) / 0.3)", color: "#7a6200" },
  under_review: { bg: "rgb(var(--soft))", color: "rgb(var(--brand-primary))" },
  approved: { bg: "rgb(var(--mint) / 0.3)", color: "rgb(var(--mint-deep))" },
  rejected: {
    bg: "rgb(var(--destructive) / 0.1)",
    color: "rgb(var(--destructive))",
  },
  returned_for_correction: { bg: "rgb(var(--lemon) / 0.3)", color: "#7a6200" },
};

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = getApplicationById(id ?? "");

  if (!app) {
    return (
      <div className="text-center py-20">
        <p style={{ color: "rgb(var(--foreground-subtle))" }}>
          Application not found.
        </p>
        <button
          className="btn-pill btn-outline mt-4 text-sm"
          onClick={() => navigate("/dashboard")}
        >
          Return to dashboard
        </button>
      </div>
    );
  }

  const ci = app.company_info;
  const ac = app.account_config;
  const ss = statusStyles[app.status];
  const formatNaira = (v?: number) =>
    v != null ? `₦${v.toLocaleString()}` : "—";

  const Field = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number | null;
  }) => (
    <div>
      <p
        className="text-xs eyebrow mb-0.5"
        style={{ color: "rgb(var(--foreground-subtle))" }}
      >
        {label}
      </p>
      <p
        className="text-sm font-medium"
        style={{ color: "rgb(var(--foreground))" }}
      >
        {value ?? "—"}
      </p>
    </div>
  );

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div
      className="rounded-2xl p-5 shadow-card space-y-4"
      style={{ background: "rgb(var(--surface-highest))" }}
    >
      <h3
        className="text-sm font-bold"
        style={{
          fontFamily: "Manrope, sans-serif",
          color: "rgb(var(--foreground))",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="h-9 w-9 flex items-center justify-center rounded-pill hover:bg-surface transition-colors"
        >
          <ArrowLeft
            className="h-4 w-4"
            style={{ color: "rgb(var(--foreground))" }}
          />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "rgb(var(--foreground))",
              }}
            >
              {ci?.company_name ?? "Untitled"}
            </h2>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-pill"
              style={{ background: ss.bg, color: ss.color }}
            >
              {STATUS_LABELS[app.status]}
            </span>
            {app.risk_score && (
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-pill"
                style={{
                  background:
                    app.risk_score.classification === "high"
                      ? "rgb(var(--destructive) / 0.1)"
                      : app.risk_score.classification === "medium"
                        ? "rgb(var(--lemon) / 0.3)"
                        : "rgb(var(--mint) / 0.3)",
                  color:
                    app.risk_score.classification === "high"
                      ? "rgb(var(--destructive))"
                      : app.risk_score.classification === "medium"
                        ? "#7a6200"
                        : "rgb(var(--mint-deep))",
                }}
              >
                {app.risk_score.classification} risk
              </span>
            )}
          </div>
          <p
            className="text-sm mt-0.5"
            style={{ color: "rgb(var(--foreground-subtle))" }}
          >
            Created{" "}
            {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
            {app.submitted_at &&
              ` · Submitted ${formatDistanceToNow(new Date(app.submitted_at), { addSuffix: true })}`}
          </p>
        </div>
        {(app.status === "draft" ||
          app.status === "returned_for_correction") && (
          <button
            className="btn-pill btn-primary text-sm"
            onClick={() => navigate(`/onboarding/${app.id}`)}
          >
            Continue Editing
          </button>
        )}
      </div>

      {/* Step completion */}
      <Section title="Step Completion">
        <div className="grid grid-cols-5 gap-2">
          {[
            {
              label: "Company Info",
              done: app.steps_completed.company_info,
              icon: Building2,
            },
            {
              label: "Documents",
              done: app.steps_completed.documents,
              icon: FileText,
            },
            {
              label: "Directors",
              done: app.steps_completed.directors,
              icon: Users,
            },
            {
              label: "Account Config",
              done: app.steps_completed.account_config,
              icon: Settings,
            },
            {
              label: "Review",
              done: app.steps_completed.review,
              icon: CheckCircle2,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <div
                className="h-9 w-9 rounded-pill flex items-center justify-center"
                style={{
                  background: s.done
                    ? "rgb(var(--mint) / 0.3)"
                    : "rgb(var(--surface))",
                  color: s.done
                    ? "rgb(var(--mint-deep))"
                    : "rgb(var(--foreground-subtle))",
                }}
              >
                <s.icon className="h-4 w-4" />
              </div>
              <span
                className="text-xs"
                style={{ color: "rgb(var(--foreground-subtle))" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Feedback */}
      {app.feedback.length > 0 && (
        <div
          className="rounded-2xl p-5 shadow-card space-y-3"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--destructive) / 0.2)",
          }}
        >
          <h3
            className="text-sm font-bold flex items-center gap-2"
            style={{ color: "rgb(var(--destructive))" }}
          >
            <AlertCircle className="h-4 w-4" />
            Feedback ({app.feedback.filter((f) => !f.resolved).length} items)
          </h3>
          <div className="space-y-2">
            {app.feedback.map((fb) => (
              <div
                key={fb.id}
                className="flex items-start gap-2 p-3 rounded-xl"
                style={{ background: "rgb(var(--destructive) / 0.05)" }}
              >
                <AlertCircle
                  className="h-4 w-4 mt-0.5 shrink-0"
                  style={{ color: "rgb(var(--destructive))" }}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "rgb(var(--foreground))" }}
                  >
                    {fb.target_label}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgb(var(--foreground-subtle))" }}
                  >
                    {fb.comment}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgb(var(--foreground-subtle))" }}
                  >
                    — {fb.created_by}
                  </p>
                </div>
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-pill shrink-0"
                  style={{
                    background: "rgb(var(--destructive) / 0.1)",
                    color: "rgb(var(--destructive))",
                  }}
                >
                  {fb.severity === "required_fix" ? "Required Fix" : "Advisory"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company Info */}
      {ci && (
        <Section title="Company Information">
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Company Name" value={ci.company_name} />
            <Field label="RC Number" value={ci.rc_number} />
            <Field label="TIN" value={ci.tin} />
            <Field label="Incorporation" value={ci.date_of_incorporation} />
            <Field label="Industry" value={INDUSTRY_LABELS[ci.industry]} />
            <Field
              label="Business Type"
              value={BUSINESS_TYPE_LABELS[ci.business_type]}
            />
            <Field
              label="Address"
              value={`${ci.registered_address}, ${ci.city}, ${ci.state}`}
            />
            <Field label="Phone" value={ci.phone_number} />
            <Field label="Email" value={ci.email} />
          </div>
        </Section>
      )}

      {/* Directors */}
      {app.directors.length > 0 && (
        <Section title="Directors & Signatories">
          <div className="space-y-3">
            {app.directors.map((dir, i) => (
              <div
                key={dir.id}
                className="flex items-center justify-between pb-3"
                style={{
                  borderBottom:
                    i < app.directors.length - 1
                      ? "1px solid rgb(var(--border))"
                      : "none",
                }}
              >
                <div>
                  <p
                    className="font-medium text-sm"
                    style={{ color: "rgb(var(--foreground))" }}
                  >
                    {dir.full_name}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgb(var(--foreground-subtle))" }}
                  >
                    {DIRECTOR_ROLE_LABELS[dir.role]} · {dir.email}
                  </p>
                </div>
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-pill"
                  style={
                    dir.verification_status === "verified"
                      ? {
                          background: "rgb(var(--mint) / 0.3)",
                          color: "rgb(var(--mint-deep))",
                        }
                      : {
                          background: "rgb(var(--surface))",
                          color: "rgb(var(--foreground-subtle))",
                        }
                  }
                >
                  {dir.verification_status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Account Config */}
      {ac && (
        <Section title="Account Configuration">
          <div className="grid md:grid-cols-3 gap-4">
            <Field
              label="Account Type"
              value={ACCOUNT_TYPE_LABELS[ac.account_type]}
            />
            <Field label="Currency" value={ac.primary_currency} />
            <Field
              label="Daily Limit"
              value={formatNaira(ac.daily_transaction_limit)}
            />
            <Field
              label="Per Txn Limit"
              value={formatNaira(ac.per_transaction_limit)}
            />
            <Field
              label="Signing Rule"
              value={SIGNING_RULE_LABELS[ac.signing_rule]}
            />
            <Field
              label="Required Signatories"
              value={ac.required_signatories}
            />
          </div>
        </Section>
      )}

      {/* Timeline */}
      <Section title="Activity Timeline">
        <div className="space-y-3">
          {app.timeline.map((event) => (
            <div key={event.id} className="flex items-start gap-3">
              <div
                className="h-2 w-2 rounded-full mt-2 shrink-0"
                style={{ background: "rgb(var(--brand-primary))" }}
              />
              <div>
                <p
                  className="text-sm"
                  style={{ color: "rgb(var(--foreground))" }}
                >
                  {event.description}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "rgb(var(--foreground-subtle))" }}
                >
                  {formatDistanceToNow(new Date(event.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
