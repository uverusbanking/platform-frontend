import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft, CheckCircle2, XCircle, AlertTriangle, MessageSquare,
  Clock, Landmark, ArrowUpRight, FileText, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

const statusStyles: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
  processing: { label: "Processing", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive border-destructive/20" },
  escalated: { label: "Escalated", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const txStatusStyles: Record<string, { label: string; className: string }> = {
  processing: { label: "Processing", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const fmt = (n: number) =>
  "₦ " + n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface PaymentDetail {
  id: string;
  account_number: string;
  bank_name: string;
  recipient_tag: string | null;
  amount: number;
  currency: string;
  source_account: string;
  source_account_label: string | null;
  memo: string | null;
  schedule: string;
  submitted_by_name: string;
  submitted_by_role: string;
  status: string;
  created_at: string;
  updated_at: string;
  batch_id: string | null;
  mandate_id: string | null;
}

interface BatchDetail {
  id: string;
  name: string;
  status: string;
}

interface MandateDetail {
  id: string;
  recipient: string;
  description: string | null;
  frequency: string;
  status: string;
}

interface ApprovalRequestDetail {
  id: string;
  status: string;
  priority: string;
  current_step: number;
  total_steps: number;
  due_by: string | null;
  created_at: string;
}

interface ApprovalActionDetail {
  id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  comment: string | null;
  step_number: number;
  created_at: string;
}

interface TransactionDetail {
  id: string;
  amount: number;
  currency: string;
  counterparty: string;
  source_account: string;
  direction: string;
  status: string;
  memo: string | null;
  created_at: string;
  completed_at: string | null;
}

export default function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [batch, setBatch] = useState<BatchDetail | null>(null);
  const [mandate, setMandate] = useState<MandateDetail | null>(null);
  const [approvalRequest, setApprovalRequest] = useState<ApprovalRequestDetail | null>(null);
  const [approvalActions, setApprovalActions] = useState<ApprovalActionDetail[]>([]);
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/payments/${id}`);
        if (!res.ok) {
          if (!cancelled) setLoading(false);
          return;
        }

        const json = await res.json();
        if (cancelled) return;

        setPayment(json.data as any);
        if (json.batch) setBatch(json.batch as any);
        if (json.mandate) setMandate(json.mandate as any);
        if (json.approvalRequest) setApprovalRequest(json.approvalRequest as ApprovalRequestDetail);
        if (json.approvalActions) setApprovalActions(json.approvalActions as ApprovalActionDetail[]);
        if (json.transaction) setTransaction(json.transaction as TransactionDetail);

      } catch (error) {
        console.error("Failed to fetch payment details:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" onClick={() => navigate("/payments")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Payments
        </Button>
        <p className="text-center py-12 text-muted-foreground">Payment not found.</p>
      </div>
    );
  }

  const ps = statusStyles[payment.status] ?? statusStyles.pending;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground" onClick={() => navigate("/payments")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Payments
        </Button>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
            Payment Details
          </h1>
          <Badge className={ps.className}>{ps.label}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Created {format(new Date(payment.created_at), "dd MMM yyyy, HH:mm")}
        </p>
      </div>

      {/* Payment Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <DetailRow label="Recipient Account" value={payment.account_number} />
            <DetailRow label="Bank" value={payment.bank_name} />
            <DetailRow label="Amount" value={fmt(Number(payment.amount))} bold />
            <DetailRow label="Currency" value={payment.currency} />
            <DetailRow label="Source Account" value={payment.source_account_label ?? payment.source_account} />
            <DetailRow label="Schedule" value={payment.schedule === "immediate" ? "Immediate" : payment.schedule === "scheduled" ? "Scheduled" : "Recurring"} />
            {mandate && <DetailRow label="Frequency" value={mandate.frequency} />}
            {batch && <DetailRow label="Associated Batch" value={batch.name} />}
            {payment.recipient_tag && <DetailRow label="Recipient Tag" value={payment.recipient_tag} />}
            {payment.memo && <DetailRow label="Memo" value={payment.memo} />}
            <DetailRow label="Submitted By" value={`${payment.submitted_by_name} (${payment.submitted_by_role})`} />
          </div>
        </CardContent>
      </Card>

      {/* Approval Request */}
      {approvalRequest && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Approval Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Status</span>
                <p className="mt-0.5">
                  <Badge className={(statusStyles[approvalRequest.status] ?? statusStyles.pending).className}>
                    {(statusStyles[approvalRequest.status] ?? statusStyles.pending).label}
                  </Badge>
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Priority</span>
                <p className="mt-0.5">
                  <Badge variant="outline" className={
                    approvalRequest.priority === "high" ? "text-warning border-warning/30" :
                    approvalRequest.priority === "critical" ? "text-destructive border-destructive/30" :
                    ""
                  }>
                    {approvalRequest.priority}
                  </Badge>
                </p>
              </div>
              <DetailRow label="Progress" value={`Step ${approvalRequest.current_step} of ${approvalRequest.total_steps}`} />
              {approvalRequest.due_by && (
                <DetailRow label="Due By" value={format(new Date(approvalRequest.due_by), "dd MMM yyyy, HH:mm")} />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Trail */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            Approval History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvalActions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No approval actions recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {approvalActions.map((a, idx) => (
                <div key={a.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="mt-0.5">
                      {a.action === "approved" && <CheckCircle2 className="h-5 w-5 text-success" />}
                      {a.action === "rejected" && <XCircle className="h-5 w-5 text-destructive" />}
                      {a.action === "escalated" && <AlertTriangle className="h-5 w-5 text-warning" />}
                      {a.action === "commented" && <MessageSquare className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    {idx < approvalActions.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{a.actor_name}</span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1">{a.actor_role}</Badge>
                      <span className="text-[10px] uppercase font-semibold tracking-wide ml-1">
                        {a.action}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                        {format(new Date(a.created_at), "dd MMM yyyy, HH:mm")}
                      </span>
                    </div>
                    {a.comment && (
                      <p className="text-sm text-muted-foreground mt-1">{a.comment}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">Step {a.step_number}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction */}
      {transaction && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Landmark className="h-4 w-4 text-muted-foreground" />
              Transaction Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <DetailRow label="Transaction ID" value={transaction.id.slice(0, 8) + "…"} />
              <div>
                <span className="text-muted-foreground">Status</span>
                <p className="mt-0.5">
                  <Badge className={(txStatusStyles[transaction.status] ?? txStatusStyles.processing).className}>
                    {(txStatusStyles[transaction.status] ?? txStatusStyles.processing).label}
                  </Badge>
                </p>
              </div>
              <DetailRow label="Amount" value={`${transaction.direction === "credit" ? "+ " : "- "}${fmt(Number(transaction.amount))}`} bold />
              <DetailRow label="Counterparty" value={transaction.counterparty} />
              <DetailRow label="Source Account" value={transaction.source_account} />
              <DetailRow label="Created" value={format(new Date(transaction.created_at), "dd MMM yyyy, HH:mm")} />
              {transaction.completed_at && (
                <DetailRow label="Completed" value={format(new Date(transaction.completed_at), "dd MMM yyyy, HH:mm")} />
              )}
              {transaction.memo && <DetailRow label="Memo" value={transaction.memo} />}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DetailRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}</span>
      <p className={`mt-0.5 ${bold ? "font-semibold" : "font-medium"}`}>{value}</p>
    </div>
  );
}
