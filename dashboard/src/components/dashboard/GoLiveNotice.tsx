import { CheckCircle2, Circle, Rocket, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetGoLiveChecklist } from "@/hooks/queries/useOrganisationQueries";
import type { IGoLiveChecklistItem } from "@/hooks/endpoints/useOrganisation";

const ITEM_LINKS: Record<string, string> = {
  documents_approved: "/account/settings/documents",
  brand_config: "/account/settings/brand",
  email_domain: "/account/settings/brand",
  personal_app_domain: "/account/settings/brand",
  payment_provider: "/account/settings",
  webhook_url: "/account/settings",
  owner_active: "/account/settings",
  wallet_active: "/account/settings",
  kyb_approved: "/account/settings",
  directors_verified: "/account/settings",
};

function ChecklistRow({ item }: { item: IGoLiveChecklistItem }) {
  const isComplete = item.status === "complete";
  const link = ITEM_LINKS[item.key];

  const content = (
    <div
      className={`flex items-start gap-2.5 py-2 border-b border-border/30 last:border-0 ${!isComplete && link ? "group" : ""}`}
    >
      <div className="mt-0.5 shrink-0">
        {isComplete ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <Circle className="w-4 h-4 text-muted-foreground/30" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-tight transition-colors ${
            isComplete
              ? "text-muted-foreground/60 line-through"
              : "text-foreground font-medium group-hover:text-primary"
          }`}
        >
          {item.label}
        </p>
        {item.detail && !isComplete && (
          <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
        )}
      </div>
    </div>
  );

  if (!isComplete && link) {
    return <Link to={link}>{content}</Link>;
  }
  return content;
}

export function GoLiveNotice() {
  const { data, isLoading } = useGetGoLiveChecklist();
  const checklist = data?.data;

  if (isLoading) {
    return (
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-56" />
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-x-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full mb-1" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!checklist || checklist.overall_ready) return null;

  const pendingItems = checklist.items.filter((i) => i.status === "pending");
  const completedCount = checklist.items.length - pendingItems.length;

  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
            <CardTitle className="text-base font-semibold text-foreground">
              Your organisation is not yet live
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-amber-600 border-amber-500/40 bg-amber-500/10 text-xs font-semibold shrink-0"
          >
            {pendingItems.length} remaining
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Complete the items below to unlock full access. Your platform admin
          will activate the account once all requirements are met.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${Math.round((completedCount / checklist.items.length) * 100)}%`,
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium shrink-0">
            {completedCount}/{checklist.items.length} complete
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid sm:grid-cols-2 gap-x-8">
          <div>
            {checklist.items
              .slice(0, Math.ceil(checklist.items.length / 2))
              .map((item) => (
                <ChecklistRow key={item.key} item={item} />
              ))}
          </div>
          <div>
            {checklist.items
              .slice(Math.ceil(checklist.items.length / 2))
              .map((item) => (
                <ChecklistRow key={item.key} item={item} />
              ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
          <Rocket className="w-3.5 h-3.5" />
          Pending items link to the relevant settings page.
        </div>
      </CardContent>
    </Card>
  );
}
