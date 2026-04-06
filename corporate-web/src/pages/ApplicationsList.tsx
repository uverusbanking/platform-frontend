import { useNavigate } from "react-router-dom";
import { getApplicationSummaries } from "@/services/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, FilePlus2 } from "lucide-react";
import { STATUS_LABELS, type ApplicationStatus } from "@/types/onboarding";
import { formatDistanceToNow } from "date-fns";

const statusColor: Record<ApplicationStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-warning/10 text-warning border-warning/20",
  under_review: "bg-primary/10 text-primary border-primary/20",
  approved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  returned_for_correction: "bg-warning/10 text-warning border-warning/20",
};

export default function ApplicationsList() {
  const navigate = useNavigate();
  const applications = getApplicationSummaries();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Applications</h2>
          <p className="text-sm text-muted-foreground">{applications.length} application{applications.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => navigate("/onboarding/new")} className="gap-2">
          <FilePlus2 className="h-4 w-4" /> New Application
        </Button>
      </div>

      <div className="space-y-3">
        {applications.map((app) => (
          <Card
            key={app.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(app.status === "draft" ? `/onboarding/${app.id}` : `/applications/${app.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{app.company_name}</p>
                    <Badge variant="outline" className={statusColor[app.status]}>{STATUS_LABELS[app.status]}</Badge>
                    {app.risk_classification && (
                      <Badge variant="outline" className={
                        app.risk_classification === "high" ? "border-destructive/30 text-destructive" :
                        app.risk_classification === "medium" ? "border-warning/30 text-warning" :
                        "border-success/30 text-success"
                      }>
                        {app.risk_classification} risk
                      </Badge>
                    )}
                    {app.feedback_count > 0 && (
                      <Badge variant="destructive">{app.feedback_count} issue{app.feedback_count > 1 ? "s" : ""}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                    <span>Step {app.current_step}/5</span>
                    <span>Directors: {app.director_verification_summary.verified}/{app.director_verification_summary.total} verified</span>
                    <span>Updated {formatDistanceToNow(new Date(app.updated_at), { addSuffix: true })}</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
