import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNow, isPast } from "date-fns";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  Search,
  Filter,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  ArrowLeftRight,
  Layers,
  Briefcase,
  Users,
  Send,
  FileText,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type {
  ApprovalRequest,
  ApprovalAction,
  ApprovalStatus,
} from "@/types/approvalQueue";
import type { CorporateRole } from "@/types/roles";
import type { TransactionCategory } from "@/types/approvals";
import { MOCK_APPROVAL_QUEUE } from "@/services/approvalQueueData";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSubmittedAsApprovalRequests,
  updatePaymentApproval,
} from "@/services/paymentStore";

const categoryIcons: Record<TransactionCategory, React.ElementType> = {
  transfers: ArrowLeftRight,
  bulk_payments: Layers,
  payroll: Briefcase,
  account_management: Filter,
  user_management: Users,
};

const categoryLabels: Record<TransactionCategory, string> = {
  transfers: "Transfer",
  bulk_payments: "Bulk Payment",
  payroll: "Payroll",
  account_management: "Account",
  user_management: "User Mgmt",
};

const statusConfig: Record<
  ApprovalStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/20",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  escalated: {
    label: "Escalated",
    icon: AlertTriangle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const priorityConfig: Record<string, string> = {
  normal: "bg-muted text-muted-foreground",
  high: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
};

function formatNaira(amount: number) {
  return "₦" + amount.toLocaleString("en-NG");
}

export default function ApprovalQueue() {
  const { toast } = useToast();
  const { can } = usePermissions();
  const { user } = useAuth();
  const navigate = useNavigate();
  const canApprove = can("apr_approve");

  // Load DB approvals + merge with mock data
  const [queue, setQueue] = useState<ApprovalRequest[]>([
    ...MOCK_APPROVAL_QUEUE,
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fromDb = await getSubmittedAsApprovalRequests();
      if (!cancelled) {
        setQueue([...fromDb, ...MOCK_APPROVAL_QUEUE]);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedItem, setSelectedItem] = useState<ApprovalRequest | null>(
    null,
  );
  const [actionModal, setActionModal] = useState<{
    item: ApprovalRequest;
    action: "approve" | "reject";
  } | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingItems = useMemo(
    () =>
      queue.filter((i) => i.status === "pending" || i.status === "escalated"),
    [queue],
  );
  const historyItems = useMemo(
    () =>
      queue.filter((i) => i.status === "approved" || i.status === "rejected"),
    [queue],
  );

  const filterItems = (items: ApprovalRequest[]) => {
    let filtered = items;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.initiator.name.toLowerCase().includes(q),
      );
    }
    if (typeFilter !== "all")
      filtered = filtered.filter((i) => i.type === typeFilter);
    return filtered;
  };

  const handleAction = async (action: "approve" | "reject") => {
    if (!actionModal) return;
    setIsSubmitting(true);
    const actorId = user?.id ?? "u-unknown";
    const actorName = user?.full_name ?? "Unknown";
    const actorRole = user?.role ?? "authorizer";
    const finalComment =
      comment || (action === "approve" ? "Approved" : "Rejected");
    const newAction: ApprovalAction = {
      id: `ah-${Date.now()}`,
      actorName,
      actorRole: actorRole as CorporateRole,
      action: action === "approve" ? "approved" : "rejected",
      comment: finalComment,
      timestamp: new Date().toISOString(),
      stepNumber: actionModal.item.currentStep,
    };

    // Persist to DB if it's a real approval request (UUID format), otherwise just update UI for mock
    const isMock = actionModal.item.id.startsWith("aq-");
    if (!isMock) {
      const result = await updatePaymentApproval(
        actionModal.item.id,
        action === "approve" ? "approved" : "rejected",
        actorId,
        actorName,
        actorRole,
        finalComment,
      );

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Database update failed",
          description: result.error ?? "Please try again later.",
        });
        setIsSubmitting(false);
        return;
      }
    }

    setQueue((prev) =>
      prev.map((item) =>
        item.id === actionModal.item.id
          ? {
              ...item,
              status: action === "approve" ? "approved" : "rejected",
              approvalHistory: [...item.approvalHistory, newAction],
            }
          : item,
      ),
    );
    if (selectedItem?.id === actionModal.item.id) {
      setSelectedItem((prev) =>
        prev
          ? {
              ...prev,
              status: action === "approve" ? "approved" : "rejected",
              approvalHistory: [...prev.approvalHistory, newAction],
            }
          : null,
      );
    }
    toast({
      title: action === "approve" ? "Request approved" : "Request rejected",
      description: actionModal.item.title,
    });
    setActionModal(null);
    setComment("");
    setIsSubmitting(false);
  };

  const pendingCount = pendingItems.length;
  const escalatedCount = pendingItems.filter(
    (i) => i.status === "escalated",
  ).length;
  const totalValue = pendingItems.reduce((s, i) => s + (i.amount ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Pending
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {pendingCount}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Escalated
                </p>
                <p className="text-2xl font-bold text-destructive mt-1">
                  {escalatedCount}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Total Value
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {formatNaira(totalValue)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Resolved
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {historyItems.length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="transfers">Transfers</SelectItem>
            <SelectItem value="bulk_payments">Bulk Payments</SelectItem>
            <SelectItem value="payroll">Payroll</SelectItem>
            <SelectItem value="user_management">User Management</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending" className="gap-1.5">
            Pending{" "}
            <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">
              {pendingItems.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            History{" "}
            <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">
              {historyItems.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {filterItems(pendingItems).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No pending approvals
              </CardContent>
            </Card>
          ) : (
            filterItems(pendingItems).map((item) => (
              <ApprovalCard
                key={item.id}
                item={item}
                onSelect={setSelectedItem}
                onAction={(a) => setActionModal({ item, action: a })}
                showActions={canApprove}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          {/* Mobile cards */}
          <div className="block sm:hidden space-y-3">
            {filterItems(historyItems).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No history
                </CardContent>
              </Card>
            ) : (
              filterItems(historyItems).map((item) => {
                const St = statusConfig[item.status];
                const lastAction =
                  item.approvalHistory[item.approvalHistory.length - 1];
                return (
                  <Card
                    key={item.id}
                    className="p-4 space-y-2 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          by {item.initiator.name}
                        </p>
                      </div>
                      <Badge
                        className={St.className + " text-[10px] h-5 shrink-0"}
                      >
                        <St.icon className="h-3 w-3 mr-0.5" />
                        {St.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {lastAction
                          ? format(
                              new Date(lastAction.timestamp),
                              "dd MMM yyyy",
                            )
                          : "—"}
                      </span>
                      <span className="font-medium text-foreground">
                        {item.amount ? formatNaira(item.amount) : "—"}
                      </span>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
          {/* Desktop table */}
          <Card className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Resolved</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterItems(historyItems).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No history
                    </TableCell>
                  </TableRow>
                ) : (
                  filterItems(historyItems).map((item) => {
                    const St = statusConfig[item.status];
                    const lastAction =
                      item.approvalHistory[item.approvalHistory.length - 1];
                    return (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <TableCell>
                          <div className="font-medium text-sm">
                            {item.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            by {item.initiator.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[item.type]}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.amount ? formatNaira(item.amount) : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge className={St.className}>
                            <St.icon className="h-3 w-3 mr-1" />
                            {St.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {lastAction
                            ? format(
                                new Date(lastAction.timestamp),
                                "dd MMM yyyy",
                              )
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Sheet */}
      <Dialog
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      >
        {selectedItem && (
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">
                {selectedItem.title}
              </DialogTitle>
              <DialogDescription>{selectedItem.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Amount</span>
                  <p className="font-semibold">
                    {selectedItem.amount
                      ? formatNaira(selectedItem.amount)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type</span>
                  <p>
                    <Badge variant="outline">
                      {categoryLabels[selectedItem.type]}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Initiated by</span>
                  <p className="font-medium">{selectedItem.initiator.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p>
                    <Badge
                      className={statusConfig[selectedItem.status].className}
                    >
                      {statusConfig[selectedItem.status].label}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Step</span>
                  <p className="font-medium">
                    {selectedItem.currentStep} of {selectedItem.totalSteps}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Created</span>
                  <p className="text-xs">
                    {format(
                      new Date(selectedItem.createdAt),
                      "dd MMM yyyy, HH:mm",
                    )}
                  </p>
                </div>
              </div>

              {selectedItem.paymentId && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedItem(null);
                    navigate(`/payments/${selectedItem.paymentId}`);
                  }}
                >
                  <FileText className="h-4 w-4 mr-1.5" /> View Full Payment
                  Details
                </Button>
              )}

              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-3">Approval History</h4>
                {selectedItem.approvalHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No actions yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedItem.approvalHistory.map((a) => (
                      <div key={a.id} className="flex gap-3">
                        <div className="mt-0.5">
                          {a.action === "approved" && (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          )}
                          {a.action === "rejected" && (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                          {a.action === "escalated" && (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                          {a.action === "commented" && (
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {a.actorName}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] h-4 px-1"
                            >
                              {a.actorRole}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {format(new Date(a.timestamp), "dd MMM, HH:mm")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {a.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {canApprove &&
                (selectedItem.status === "pending" ||
                  selectedItem.status === "escalated") && (
                  <>
                    <Separator />
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => {
                          setActionModal({
                            item: selectedItem,
                            action: "approve",
                          });
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          setActionModal({
                            item: selectedItem,
                            action: "reject",
                          });
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </>
                )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Approve/Reject Modal */}
      <Dialog
        open={!!actionModal}
        onOpenChange={(open) => {
          if (!open) {
            setActionModal(null);
            setComment("");
          }
        }}
      >
        {actionModal && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {actionModal.action === "approve"
                  ? "Approve Request"
                  : "Reject Request"}
              </DialogTitle>
              <DialogDescription>{actionModal.item.title}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {actionModal.item.amount && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-bold">
                    {formatNaira(actionModal.item.amount)}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Comment{" "}
                  {actionModal.action === "reject" && (
                    <span className="text-destructive">*</span>
                  )}
                </label>
                <Textarea
                  placeholder={
                    actionModal.action === "approve"
                      ? "Optional comment..."
                      : "Reason for rejection (required)..."
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setActionModal(null);
                  setComment("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant={
                  actionModal.action === "approve" ? "default" : "destructive"
                }
                disabled={
                  (actionModal.action === "reject" && !comment.trim()) ||
                  isSubmitting
                }
                onClick={() => handleAction(actionModal.action)}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-1" />
                )}
                {actionModal.action === "approve"
                  ? isSubmitting
                    ? "Approving..."
                    : "Confirm Approval"
                  : isSubmitting
                    ? "Rejecting..."
                    : "Confirm Rejection"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

/* ─── Pending Card ─── */
function ApprovalCard({
  item,
  onSelect,
  onAction,
  showActions = true,
}: {
  item: ApprovalRequest;
  onSelect: (i: ApprovalRequest) => void;
  onAction: (a: "approve" | "reject") => void;
  showActions?: boolean;
}) {
  const Icon = categoryIcons[item.type];
  const st = statusConfig[item.status];
  const overdue = item.dueBy && isPast(new Date(item.dueBy));

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(item)}
    >
      <CardContent className="py-4 px-4 sm:px-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {item.title}
              </h3>
              <Badge className={st.className + " text-[10px] h-5"}>
                <st.icon className="h-3 w-3 mr-0.5" />
                {st.label}
              </Badge>
              {item.priority !== "normal" && (
                <Badge
                  className={priorityConfig[item.priority] + " text-[10px] h-5"}
                >
                  {item.priority}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {item.description}
            </p>
            <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
              <span>
                by{" "}
                <span className="font-medium text-foreground">
                  {item.initiator.name}
                </span>
              </span>
              {item.amount && (
                <span className="font-semibold text-foreground">
                  {formatNaira(item.amount)}
                </span>
              )}
              <span>
                Step {item.currentStep}/{item.totalSteps}
              </span>
              {item.dueBy && (
                <span className={overdue ? "text-destructive font-medium" : ""}>
                  {overdue
                    ? "Overdue"
                    : `Due ${formatDistanceToNow(new Date(item.dueBy), { addSuffix: true })}`}
                </span>
              )}
            </div>
            {/* Mobile action buttons */}
            {showActions && (
              <div
                className="flex gap-2 mt-3 sm:hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  className="h-8 text-xs flex-1"
                  onClick={() => onAction("approve")}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs flex-1"
                  onClick={() => onAction("reject")}
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                </Button>
              </div>
            )}
          </div>
          {/* Desktop action buttons */}
          {showActions && (
            <div
              className="hidden sm:flex gap-2 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="sm"
                className="h-8 text-xs"
                onClick={() => onAction("approve")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={() => onAction("reject")}
              >
                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
