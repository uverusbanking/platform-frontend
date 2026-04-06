import type { CorporateRole } from "./roles";

export type ApprovalFlowType = "sequential" | "parallel" | "any_one";
export type TransactionCategory = "transfers" | "bulk_payments" | "payroll" | "account_management" | "user_management";
export type EscalationAction = "notify_owner" | "auto_approve" | "auto_reject" | "reassign";

export interface ApprovalStep {
  id: string;
  order: number;
  role: CorporateRole;
  label: string;
  required: boolean;
}

export interface ApprovalThreshold {
  id: string;
  label: string;
  category: TransactionCategory;
  minAmount: number;
  maxAmount: number | null; // null = unlimited
  currency: string;
  requiredApprovers: number;
  flowType: ApprovalFlowType;
  steps: ApprovalStep[];
  enabled: boolean;
}

export interface EscalationRule {
  id: string;
  label: string;
  triggerHours: number;
  action: EscalationAction;
  notifyRoles: CorporateRole[];
  enabled: boolean;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  category: TransactionCategory;
  description: string;
  flowType: ApprovalFlowType;
  thresholds: ApprovalThreshold[];
  escalationRules: EscalationRule[];
  isDefault: boolean;
  enabled: boolean;
}

export const TRANSACTION_CATEGORIES: { id: TransactionCategory; label: string; icon: string }[] = [
  { id: "transfers", label: "Transfers", icon: "ArrowLeftRight" },
  { id: "bulk_payments", label: "Bulk Payments", icon: "Layers" },
  { id: "payroll", label: "Payroll", icon: "Briefcase" },
  { id: "account_management", label: "Account Management", icon: "Settings" },
  { id: "user_management", label: "User Management", icon: "Users" },
];

export const FLOW_TYPE_LABELS: Record<ApprovalFlowType, { label: string; description: string }> = {
  sequential: { label: "Sequential", description: "Each approver must act in order" },
  parallel: { label: "Parallel", description: "All approvers can act simultaneously, all must approve" },
  any_one: { label: "Any One", description: "Any single authorized approver can approve" },
};

export const ESCALATION_ACTIONS: Record<EscalationAction, string> = {
  notify_owner: "Notify Owner",
  auto_approve: "Auto-approve",
  auto_reject: "Auto-reject",
  reassign: "Reassign to next approver",
};

// Mock data
export const MOCK_WORKFLOWS: ApprovalWorkflow[] = [
  {
    id: "wf-1",
    name: "Standard Transfer Approval",
    category: "transfers",
    description: "Default approval flow for fund transfers",
    flowType: "sequential",
    isDefault: true,
    enabled: true,
    thresholds: [
      {
        id: "th-1",
        label: "Low Value",
        category: "transfers",
        minAmount: 0,
        maxAmount: 1_000_000,
        currency: "NGN",
        requiredApprovers: 1,
        flowType: "any_one",
        enabled: true,
        steps: [
          { id: "s-1", order: 1, role: "authorizer", label: "Any Authorizer", required: true },
        ],
      },
      {
        id: "th-2",
        label: "Medium Value",
        category: "transfers",
        minAmount: 1_000_000,
        maxAmount: 10_000_000,
        currency: "NGN",
        requiredApprovers: 2,
        flowType: "sequential",
        enabled: true,
        steps: [
          { id: "s-2", order: 1, role: "authorizer", label: "Primary Authorizer", required: true },
          { id: "s-3", order: 2, role: "owner", label: "Owner Approval", required: true },
        ],
      },
      {
        id: "th-3",
        label: "High Value",
        category: "transfers",
        minAmount: 10_000_000,
        maxAmount: null,
        currency: "NGN",
        requiredApprovers: 3,
        flowType: "sequential",
        enabled: true,
        steps: [
          { id: "s-4", order: 1, role: "authorizer", label: "Primary Authorizer", required: true },
          { id: "s-5", order: 2, role: "authorizer", label: "Secondary Authorizer", required: true },
          { id: "s-6", order: 3, role: "owner", label: "Owner Final Approval", required: true },
        ],
      },
    ],
    escalationRules: [
      { id: "esc-1", label: "Pending too long", triggerHours: 24, action: "notify_owner", notifyRoles: ["owner"], enabled: true },
      { id: "esc-2", label: "Critical escalation", triggerHours: 48, action: "reassign", notifyRoles: ["owner"], enabled: true },
    ],
  },
  {
    id: "wf-2",
    name: "Bulk Payment Approval",
    category: "bulk_payments",
    description: "Approval flow for batch and bulk payment processing",
    flowType: "sequential",
    isDefault: true,
    enabled: true,
    thresholds: [
      {
        id: "th-4",
        label: "Standard Batch",
        category: "bulk_payments",
        minAmount: 0,
        maxAmount: 5_000_000,
        currency: "NGN",
        requiredApprovers: 2,
        flowType: "sequential",
        enabled: true,
        steps: [
          { id: "s-7", order: 1, role: "authorizer", label: "Authorizer Review", required: true },
          { id: "s-8", order: 2, role: "owner", label: "Owner Approval", required: true },
        ],
      },
      {
        id: "th-5",
        label: "Large Batch",
        category: "bulk_payments",
        minAmount: 5_000_000,
        maxAmount: null,
        currency: "NGN",
        requiredApprovers: 3,
        flowType: "sequential",
        enabled: true,
        steps: [
          { id: "s-9", order: 1, role: "authorizer", label: "Primary Authorizer", required: true },
          { id: "s-10", order: 2, role: "authorizer", label: "Secondary Authorizer", required: true },
          { id: "s-11", order: 3, role: "owner", label: "Owner Final Approval", required: true },
        ],
      },
    ],
    escalationRules: [
      { id: "esc-3", label: "Batch timeout", triggerHours: 12, action: "notify_owner", notifyRoles: ["owner"], enabled: true },
    ],
  },
  {
    id: "wf-3",
    name: "Payroll Approval",
    category: "payroll",
    description: "Approval flow for payroll disbursements",
    flowType: "parallel",
    isDefault: true,
    enabled: true,
    thresholds: [
      {
        id: "th-6",
        label: "All Payroll",
        category: "payroll",
        minAmount: 0,
        maxAmount: null,
        currency: "NGN",
        requiredApprovers: 2,
        flowType: "parallel",
        enabled: true,
        steps: [
          { id: "s-12", order: 1, role: "authorizer", label: "HR Authorizer", required: true },
          { id: "s-13", order: 1, role: "owner", label: "Owner Approval", required: true },
        ],
      },
    ],
    escalationRules: [
      { id: "esc-4", label: "Payroll deadline", triggerHours: 6, action: "notify_owner", notifyRoles: ["owner", "authorizer"], enabled: true },
    ],
  },
  {
    id: "wf-4",
    name: "Account Management",
    category: "account_management",
    description: "Approval for account creation, modification, and closure",
    flowType: "sequential",
    isDefault: true,
    enabled: false,
    thresholds: [],
    escalationRules: [],
  },
  {
    id: "wf-5",
    name: "User Management",
    category: "user_management",
    description: "Approval for user invitations and role changes",
    flowType: "any_one",
    isDefault: true,
    enabled: true,
    thresholds: [
      {
        id: "th-7",
        label: "All User Actions",
        category: "user_management",
        minAmount: 0,
        maxAmount: null,
        currency: "NGN",
        requiredApprovers: 1,
        flowType: "any_one",
        enabled: true,
        steps: [
          { id: "s-14", order: 1, role: "owner", label: "Owner Approval", required: true },
        ],
      },
    ],
    escalationRules: [],
  },
];
