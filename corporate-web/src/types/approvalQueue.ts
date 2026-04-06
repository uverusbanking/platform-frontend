import type { CorporateRole } from "./roles";
import type { TransactionCategory } from "./approvals";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "escalated";

export interface ApprovalRequest {
  id: string;
  type: TransactionCategory;
  title: string;
  description: string;
  amount: number | null;
  currency: string;
  initiator: { id: string; name: string; role: CorporateRole };
  currentStep: number;
  totalSteps: number;
  status: ApprovalStatus;
  priority: "normal" | "high" | "critical";
  createdAt: string;
  dueBy: string | null;
  approvalHistory: ApprovalAction[];
  /** Payment ID for navigating to payment detail (DB-backed items only) */
  paymentId?: string;
}

export interface ApprovalAction {
  id: string;
  actorName: string;
  actorRole: CorporateRole;
  action: "approved" | "rejected" | "commented" | "escalated";
  comment: string;
  timestamp: string;
  stepNumber: number;
}
