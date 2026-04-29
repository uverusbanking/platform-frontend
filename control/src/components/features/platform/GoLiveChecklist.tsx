import { CheckCircle2, Circle, Rocket, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useGetOrgGoLiveChecklist,
  useUpdateOrganisationStatus,
} from "@/hooks/queries/useOrganisationQueries";
import type { IGoLiveChecklistItem } from "@/hooks/endpoints/useOrganisation";

interface GoLiveChecklistProps {
  organisationId: string;
  currentStatus: string;
}

function ChecklistRow({ item }: { item: IGoLiveChecklistItem }) {
  const isComplete = item.status === "complete";
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0">
      <div className="mt-0.5 shrink-0">
        {isComplete ? (
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
        ) : (
          <Circle className="w-4.5 h-4.5 text-muted-foreground/40" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-tight ${isComplete ? "text-muted-foreground line-through" : "text-foreground"}`}
        >
          {item.label}
        </p>
        {item.detail && (
          <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
        )}
      </div>
    </div>
  );
}

export function GoLiveChecklist({
  organisationId,
  currentStatus,
}: GoLiveChecklistProps) {
  const { data, isLoading } = useGetOrgGoLiveChecklist(organisationId);
  const { mutate: updateStatus, isPending } =
    useUpdateOrganisationStatus(organisationId);

  const checklist = data?.data;
  const isAlreadyActive = currentStatus === "ACTIVE";
  const pendingItems =
    checklist?.items.filter((i) => i.status === "pending") ?? [];
  const completedCount = (checklist?.items.length ?? 0) - pendingItems.length;

  const handleActivate = () => {
    updateStatus("ACTIVE", {
      onSuccess: () => toast.success("Organisation activated successfully"),
      onError: () => toast.error("Failed to activate organisation"),
    });
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!checklist) return null;

  return (
    <Card className={`border-border/50 ${isAlreadyActive ? "opacity-60" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Rocket className="w-4.5 h-4.5 text-primary" />
            <CardTitle className="text-base font-semibold">
              Go-Live Readiness
            </CardTitle>
          </div>
          {isAlreadyActive ? (
            <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20 text-xs font-semibold">
              Live
            </Badge>
          ) : checklist.overall_ready ? (
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
              Ready to activate
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-amber-600 border-amber-500/30 bg-amber-500/10 text-xs font-semibold"
            >
              {pendingItems.length} item
              {pendingItems.length !== 1 ? "s" : ""} remaining
            </Badge>
          )}
        </div>
        {!isAlreadyActive && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${Math.round((completedCount / checklist.items.length) * 100)}%`,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium shrink-0">
              {completedCount}/{checklist.items.length}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {isAlreadyActive ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            This organisation is live and accepting customers.
          </div>
        ) : (
          <>
            <div className="mb-4">
              {checklist.items.map((item) => (
                <ChecklistRow key={item.key} item={item} />
              ))}
            </div>

            {checklist.overall_ready ? (
              <Button
                className="w-full rounded-xl shadow-sm"
                onClick={handleActivate}
                disabled={isPending}
              >
                <Rocket className="w-4 h-4 mr-2" />
                {isPending ? "Activating…" : "Activate Organisation"}
              </Button>
            ) : (
              <div className="flex items-start gap-2 rounded-lg bg-amber-500/8 border border-amber-500/20 p-3 text-xs text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                Complete all items above before activating this organisation.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
