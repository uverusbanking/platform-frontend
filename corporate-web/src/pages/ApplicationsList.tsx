import { useNavigate } from "react-router-dom";
import { getApplicationSummaries } from "@/services/mockData";
import { ArrowRight, FilePlus2 } from "lucide-react";
import { STATUS_LABELS, type ApplicationStatus } from "@/types/onboarding";
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

export default function ApplicationsList() {
  const navigate = useNavigate();
  const applications = getApplicationSummaries();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Corporate Onboarding</p>
          <h1 className="display">My Applications</h1>
          <p
            className="text-sm mt-1"
            style={{ color: "rgb(var(--foreground-subtle))" }}
          >
            {applications.length} application
            {applications.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/onboarding/new")}
          className="btn-pill btn-primary gap-1.5 text-sm"
        >
          <FilePlus2 className="h-4 w-4" /> New Application
        </button>
      </div>

      <div className="space-y-3">
        {applications.map((app) => {
          const s = statusStyles[app.status];
          return (
            <div
              key={app.id}
              className="rounded-2xl p-4 shadow-card cursor-pointer transition-colors"
              style={{ background: "rgb(var(--surface-highest))" }}
              onClick={() =>
                navigate(
                  app.status === "draft"
                    ? `/onboarding/${app.id}`
                    : `/applications/${app.id}`,
                )
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgb(var(--surface-high))")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "rgb(var(--surface-highest))")
              }
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "rgb(var(--foreground))" }}
                    >
                      {app.company_name}
                    </p>
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-pill"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {STATUS_LABELS[app.status]}
                    </span>
                    {app.risk_classification && (
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-pill"
                        style={{
                          background:
                            app.risk_classification === "high"
                              ? "rgb(var(--destructive) / 0.1)"
                              : app.risk_classification === "medium"
                                ? "rgb(var(--lemon) / 0.3)"
                                : "rgb(var(--mint) / 0.3)",
                          color:
                            app.risk_classification === "high"
                              ? "rgb(var(--destructive))"
                              : app.risk_classification === "medium"
                                ? "#7a6200"
                                : "rgb(var(--mint-deep))",
                        }}
                      >
                        {app.risk_classification} risk
                      </span>
                    )}
                    {app.feedback_count > 0 && (
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-pill"
                        style={{
                          background: "rgb(var(--destructive) / 0.1)",
                          color: "rgb(var(--destructive))",
                        }}
                      >
                        {app.feedback_count} issue
                        {app.feedback_count > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div
                    className="flex items-center gap-4 mt-1.5 text-xs"
                    style={{ color: "rgb(var(--foreground-subtle))" }}
                  >
                    <span>Step {app.current_step}/5</span>
                    <span>
                      Directors: {app.director_verification_summary.verified}/
                      {app.director_verification_summary.total} verified
                    </span>
                    <span>
                      Updated{" "}
                      {formatDistanceToNow(new Date(app.updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 ml-3"
                  style={{ color: "rgb(var(--foreground-subtle))" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
