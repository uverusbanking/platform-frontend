import { supabase } from "@/integrations/supabase/client";
import type { ApprovalRequest } from "@/types/approvalQueue";

export interface SubmittedPayment {
  id: string;
  accountNumber: string;
  bankName: string;
  recipientTag: string | null;
  amount: number;
  sourceAccount: string;
  sourceAccountLabel: string | null;
  memo: string | null;
  schedule: "immediate" | "scheduled" | "recurring";
  submittedBy: { id: string; name: string; role: string };
  submittedAt: string;
  status: string;
  currency: string;
  approvalHistory: ApprovalRequest["approvalHistory"];
  batchId?: string;
  mandateId?: string;
}

export interface PaymentBatch {
  id: string;
  name: string;
  totalRecipients: number;
  totalAmount: number;
  status: string;
  createdBy: string;
  createdAt: string;
}

export interface PaymentMandate {
  id: string;
  recipient: string;
  description: string;
  frequency: string;
  amount: number;
  status: string;
  nextPayment: string | null;
  createdAt: string;
}

/** Insert a payment row + an approval_request row in one go */
export async function submitPayment(input: {
  accountNumber: string;
  bankName: string;
  recipientTag: string;
  amount: number;
  sourceAccount: string;
  sourceAccountLabel: string;
  memo: string;
  schedule: "immediate" | "scheduled" | "recurring";
  submittedBy: { id: string; name: string; role: string };
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await res.json();
    if (!data.success) {
      return { success: false, error: data.error };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unknown error occurred",
    };
  }
}

/** Fetch all payments with their approval request + actions */
export async function getPaymentsWithApprovals(): Promise<SubmittedPayment[]> {
  try {
    const res = await fetch("/api/payments");
    const { data } = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch payments:", err);
    return [];
  }
}

export async function getPaymentBatches(): Promise<PaymentBatch[]> {
  try {
    const res = await fetch("/api/batches");
    const { data } = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch batches:", err);
    return [];
  }
}

export async function getPaymentMandates(): Promise<PaymentMandate[]> {
  try {
    const res = await fetch("/api/mandates");
    const { data } = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch mandates:", err);
    return [];
  }
}

/** Convert DB payments to ApprovalRequest format for the approval queue */
export async function getSubmittedAsApprovalRequests(): Promise<
  ApprovalRequest[]
> {
  try {
    const res = await fetch("/api/approval-requests");
    const { data } = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch approval requests:", err);
    return [];
  }
}

/** Approve or reject: insert an approval_action + update the approval_request status */
export async function updatePaymentApproval(
  approvalRequestId: string,
  action: "approved" | "rejected",
  actorId: string,
  actorName: string,
  actorRole: string,
  comment: string,
) {
  try {
    const res = await fetch("/api/approval-actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approvalRequestId,
        action,
        actorId,
        actorName,
        actorRole,
        comment,
      }),
    });
    const data = await res.json();
    if (!data.success) {
      return { success: false, error: data.error };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unknown error occurred",
    };
  }
}
