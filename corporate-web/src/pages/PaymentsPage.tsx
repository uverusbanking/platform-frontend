import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MoreVertical, Plus, Loader2 } from "lucide-react";
import ApprovalQueue from "@/pages/ApprovalQueue";
import BulkCsvUpload from "@/components/payments/BulkCsvUpload";
import { usePermissions } from "@/hooks/usePermissions";
import {
  getPaymentsWithApprovals,
  getPaymentBatches,
  getPaymentMandates,
  SubmittedPayment,
  PaymentBatch,
  PaymentMandate,
} from "@/services/paymentStore";
import { format } from "date-fns";

/* ─── Mock data removed as we now have DB tables ─── */

const statusStyles: Record<string, string> = {
  success: "bg-success/10 text-success border-success/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-warning/10 text-warning border-warning/20",
  pending: "bg-muted text-muted-foreground",
  completed: "bg-success/10 text-success border-success/20",
  processing: "bg-primary/10 text-primary border-primary/20",
  draft: "bg-muted text-muted-foreground",
  active: "bg-success/10 text-success border-success/20",
  paused: "bg-warning/10 text-warning border-warning/20",
  expired: "bg-destructive/10 text-destructive border-destructive/20",
};

const fmt = (n: number) =>
  "₦ " +
  n.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function PaymentsPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const canInitiate = can("tx_initiate");
  const canBulk = can("tx_bulk");

  const [tab, setTab] = useState("payments");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [dbPayments, setDbPayments] = useState<SubmittedPayment[]>([]);
  const [dbBatches, setDbBatches] = useState<PaymentBatch[]>([]);
  const [dbMandates, setDbMandates] = useState<PaymentMandate[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [payments, batches, mandates] = await Promise.all([
        getPaymentsWithApprovals(),
        getPaymentBatches(),
        getPaymentMandates(),
      ]);

      if (!cancelled) {
        setDbPayments(payments);
        setDbBatches(batches);
        setDbMandates(mandates);
        setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const allPayments = useMemo(() => {
    return dbPayments.filter((p) => {
      // Exclude formal batch and recurring mandates from "All Payments"
      // They are shown on their respective tabs.
      if (p.batchId || p.mandateId) return false;

      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.bankName.toLowerCase().includes(q) ||
        p.memo?.toLowerCase().includes(q) ||
        p.accountNumber.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [dbPayments, search, statusFilter]);

  const bulkPayments = useMemo(() => {
    return dbBatches.filter((b) => {
      const q = search.toLowerCase();
      return !search || b.name.toLowerCase().includes(q);
    });
  }, [dbBatches, search]);

  const recurringPayments = useMemo(() => {
    return dbMandates.filter((m) => {
      const q = search.toLowerCase();
      return (
        !search ||
        m.recipient.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q)
      );
    });
  }, [dbMandates, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Finance</p>
          <h1 className="display">Payments</h1>
        </div>
        {canInitiate && (
          <button
            onClick={() => navigate("/payments/new")}
            className="btn-pill btn-primary gap-1.5 w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            New Payment
          </button>
        )}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
          <div
            className="flex gap-1.5 w-max sm:w-auto p-1 rounded-pill"
            style={{ background: "rgb(var(--surface))" }}
          >
            {[
              { value: "payments", label: "All Payments" },
              { value: "bulk", label: "Bulk Payments" },
              { value: "recurring", label: "Recurring" },
              { value: "attention", label: "Needs attention" },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className="px-4 py-2 rounded-pill text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors"
                style={{
                  background:
                    tab === t.value ? "rgb(var(--foreground))" : "transparent",
                  color:
                    tab === t.value ? "#fff" : "rgb(var(--foreground-subtle))",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <TabsContent value="payments" className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[130px] h-9 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 sm:ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex-1 sm:flex-none"
              >
                Apply filters
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs flex-1 sm:flex-none"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="block sm:hidden space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : allPayments.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No payments found
              </p>
            ) : (
              allPayments.map((p) => (
                <Card
                  key={p.id}
                  className="p-4 space-y-2 cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => navigate(`/payments/${p.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{p.bankName}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {p.memo}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(p.submittedAt), "MMM dd, yyyy")}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase ${statusStyles[p.status] || ""}`}
                      >
                        {p.status}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">{fmt(p.amount)}</span>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Desktop table */}
          <Card className="hidden sm:block">
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">
                        Counterparty / Bank
                      </TableHead>
                      <TableHead className="text-xs">Payment memo</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">
                        Amount
                      </TableHead>
                      <TableHead className="w-8" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPayments.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No payments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      allPayments.map((p) => (
                        <TableRow
                          key={p.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => navigate(`/payments/${p.id}`)}
                        >
                          <TableCell className="text-sm whitespace-nowrap">
                            {format(new Date(p.submittedAt), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="font-medium">{p.bankName}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {p.accountNumber}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {p.memo || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-[10px] uppercase ${statusStyles[p.status] || ""}`}
                              >
                                {p.status}
                              </Badge>
                              {p.status === "failed" && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0 text-xs text-primary"
                                >
                                  Retry
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-right font-medium whitespace-nowrap">
                            {fmt(p.amount)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="mt-6 space-y-4">
          {canBulk && <BulkCsvUpload />}
          <p className="text-sm text-muted-foreground">
            {bulkPayments.length} previous batch payments
          </p>
          {/* Mobile cards */}
          <div className="block sm:hidden space-y-3">
            {bulkPayments.map((p) => (
              <Card
                key={p.id}
                className="p-4 space-y-2 cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => {
                  /* Navigation for batch details could go here */
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{p.name}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase ${statusStyles[p.status] || ""}`}
                  >
                    {p.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {format(new Date(p.createdAt), "MMM dd, yyyy")} ·{" "}
                    {p.totalRecipients || 0} recipients
                  </span>
                  <span className="font-medium text-foreground">
                    {fmt(p.totalAmount)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
          <Card className="hidden sm:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Batch name</TableHead>
                    <TableHead className="text-xs">Recipients</TableHead>
                    <TableHead className="text-xs">Created by</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">
                      Total amount
                    </TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bulkPayments.map((p) => (
                    <TableRow
                      key={p.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        /* Navigation for batch details could go here */
                      }}
                    >
                      <TableCell className="text-sm whitespace-nowrap">
                        {format(new Date(p.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {p.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {p.totalRecipients}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {p.createdBy === "00000000-0000-4000-a000-000000000001"
                          ? "Amaka Obi"
                          : "System"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase ${statusStyles[p.status] || ""}`}
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-right font-medium whitespace-nowrap">
                        {fmt(p.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="recurring" className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            {recurringPayments.length} mandates
          </p>
          {/* Mobile cards */}
          <div className="block sm:hidden space-y-3">
            {recurringPayments.map((p) => (
              <Card
                key={p.id}
                className="p-4 space-y-2 cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => navigate(`/payments/${p.id}`)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{p.recipient}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase ${statusStyles[p.status.toLowerCase()] || ""}`}
                  >
                    {p.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{p.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Next:{" "}
                    {p.nextPayment
                      ? format(new Date(p.nextPayment), "MMM dd")
                      : "-"}
                  </span>
                  <span className="font-medium text-foreground">
                    {fmt(p.amount)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
          <Card className="hidden sm:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">
                      Counterparty / Bank
                    </TableHead>
                    <TableHead className="text-xs">Description</TableHead>
                    <TableHead className="text-xs">Frequency</TableHead>
                    <TableHead className="text-xs">Created</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Amount</TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recurringPayments.map((p) => (
                    <TableRow
                      key={p.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        /* Navigation for mandate details could go here */
                      }}
                    >
                      <TableCell className="text-sm font-medium">
                        {p.recipient}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {p.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase"
                        >
                          {p.frequency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {p.nextPayment
                          ? format(new Date(p.nextPayment), "MMM dd, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase ${statusStyles[p.status.toLowerCase()] || ""}`}
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-right font-medium whitespace-nowrap">
                        {fmt(p.amount)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="attention" className="mt-6">
          <ApprovalQueue />
        </TabsContent>
      </Tabs>
    </div>
  );
}
