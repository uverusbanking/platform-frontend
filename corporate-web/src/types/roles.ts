export type CorporateRole = "owner" | "initiator" | "authorizer" | "viewer";

export interface RoleDefinition {
  id: CorporateRole;
  label: string;
  description: string;
  color: string;
  permissions: Permission[];
}

export type PermissionCategory =
  | "accounts"
  | "transactions"
  | "approvals"
  | "users"
  | "settings"
  | "reports";

export interface Permission {
  category: PermissionCategory;
  actions: PermissionAction[];
}

export interface PermissionAction {
  id: string;
  label: string;
  allowed: boolean;
}

export const PERMISSION_CATEGORIES: { id: PermissionCategory; label: string }[] = [
  { id: "accounts", label: "Accounts" },
  { id: "transactions", label: "Transactions" },
  { id: "approvals", label: "Approvals" },
  { id: "users", label: "User Management" },
  { id: "settings", label: "Settings" },
  { id: "reports", label: "Reports & Audit" },
];

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: "owner",
    label: "Owner",
    description: "Full access to all features. Subject to approval rules for high-value transactions.",
    color: "bg-primary/10 text-primary",
    permissions: [
      {
        category: "accounts",
        actions: [
          { id: "acc_view", label: "View accounts", allowed: true },
          { id: "acc_create", label: "Create accounts", allowed: true },
          { id: "acc_edit", label: "Edit accounts", allowed: true },
          { id: "acc_close", label: "Close accounts", allowed: true },
        ],
      },
      {
        category: "transactions",
        actions: [
          { id: "tx_view", label: "View transactions", allowed: true },
          { id: "tx_initiate", label: "Initiate transfers", allowed: true },
          { id: "tx_approve", label: "Approve transfers", allowed: true },
          { id: "tx_bulk", label: "Bulk payments", allowed: true },
        ],
      },
      {
        category: "approvals",
        actions: [
          { id: "apr_view", label: "View approval queue", allowed: true },
          { id: "apr_approve", label: "Approve / reject", allowed: true },
          { id: "apr_config", label: "Configure workflows", allowed: true },
          { id: "apr_override", label: "Override escalations", allowed: true },
        ],
      },
      {
        category: "users",
        actions: [
          { id: "usr_view", label: "View users", allowed: true },
          { id: "usr_invite", label: "Invite users", allowed: true },
          { id: "usr_roles", label: "Assign roles", allowed: true },
          { id: "usr_remove", label: "Remove users", allowed: true },
        ],
      },
      {
        category: "settings",
        actions: [
          { id: "set_general", label: "General settings", allowed: true },
          { id: "set_security", label: "Security policies", allowed: true },
          { id: "set_api", label: "API keys", allowed: true },
          { id: "set_billing", label: "Billing", allowed: true },
        ],
      },
      {
        category: "reports",
        actions: [
          { id: "rpt_view", label: "View reports", allowed: true },
          { id: "rpt_export", label: "Export data", allowed: true },
          { id: "rpt_audit", label: "Audit trail", allowed: true },
          { id: "rpt_schedule", label: "Schedule reports", allowed: true },
        ],
      },
    ],
  },
  {
    id: "initiator",
    label: "Initiator",
    description: "Can create and submit transactions and requests for approval. Cannot approve own submissions.",
    color: "bg-warning/10 text-warning",
    permissions: [
      {
        category: "accounts",
        actions: [
          { id: "acc_view", label: "View accounts", allowed: true },
          { id: "acc_create", label: "Create accounts", allowed: false },
          { id: "acc_edit", label: "Edit accounts", allowed: false },
          { id: "acc_close", label: "Close accounts", allowed: false },
        ],
      },
      {
        category: "transactions",
        actions: [
          { id: "tx_view", label: "View transactions", allowed: true },
          { id: "tx_initiate", label: "Initiate transfers", allowed: true },
          { id: "tx_approve", label: "Approve transfers", allowed: false },
          { id: "tx_bulk", label: "Bulk payments", allowed: true },
        ],
      },
      {
        category: "approvals",
        actions: [
          { id: "apr_view", label: "View approval queue", allowed: true },
          { id: "apr_approve", label: "Approve / reject", allowed: false },
          { id: "apr_config", label: "Configure workflows", allowed: false },
          { id: "apr_override", label: "Override escalations", allowed: false },
        ],
      },
      {
        category: "users",
        actions: [
          { id: "usr_view", label: "View users", allowed: true },
          { id: "usr_invite", label: "Invite users", allowed: false },
          { id: "usr_roles", label: "Assign roles", allowed: false },
          { id: "usr_remove", label: "Remove users", allowed: false },
        ],
      },
      {
        category: "settings",
        actions: [
          { id: "set_general", label: "General settings", allowed: false },
          { id: "set_security", label: "Security policies", allowed: false },
          { id: "set_api", label: "API keys", allowed: false },
          { id: "set_billing", label: "Billing", allowed: false },
        ],
      },
      {
        category: "reports",
        actions: [
          { id: "rpt_view", label: "View reports", allowed: true },
          { id: "rpt_export", label: "Export data", allowed: true },
          { id: "rpt_audit", label: "Audit trail", allowed: false },
          { id: "rpt_schedule", label: "Schedule reports", allowed: false },
        ],
      },
    ],
  },
  {
    id: "authorizer",
    label: "Authorizer",
    description: "Reviews and approves or rejects submissions. Cannot initiate transactions.",
    color: "bg-success/10 text-success",
    permissions: [
      {
        category: "accounts",
        actions: [
          { id: "acc_view", label: "View accounts", allowed: true },
          { id: "acc_create", label: "Create accounts", allowed: false },
          { id: "acc_edit", label: "Edit accounts", allowed: false },
          { id: "acc_close", label: "Close accounts", allowed: false },
        ],
      },
      {
        category: "transactions",
        actions: [
          { id: "tx_view", label: "View transactions", allowed: true },
          { id: "tx_initiate", label: "Initiate transfers", allowed: false },
          { id: "tx_approve", label: "Approve transfers", allowed: true },
          { id: "tx_bulk", label: "Bulk payments", allowed: false },
        ],
      },
      {
        category: "approvals",
        actions: [
          { id: "apr_view", label: "View approval queue", allowed: true },
          { id: "apr_approve", label: "Approve / reject", allowed: true },
          { id: "apr_config", label: "Configure workflows", allowed: false },
          { id: "apr_override", label: "Override escalations", allowed: false },
        ],
      },
      {
        category: "users",
        actions: [
          { id: "usr_view", label: "View users", allowed: true },
          { id: "usr_invite", label: "Invite users", allowed: false },
          { id: "usr_roles", label: "Assign roles", allowed: false },
          { id: "usr_remove", label: "Remove users", allowed: false },
        ],
      },
      {
        category: "settings",
        actions: [
          { id: "set_general", label: "General settings", allowed: false },
          { id: "set_security", label: "Security policies", allowed: false },
          { id: "set_api", label: "API keys", allowed: false },
          { id: "set_billing", label: "Billing", allowed: false },
        ],
      },
      {
        category: "reports",
        actions: [
          { id: "rpt_view", label: "View reports", allowed: true },
          { id: "rpt_export", label: "Export data", allowed: true },
          { id: "rpt_audit", label: "Audit trail", allowed: true },
          { id: "rpt_schedule", label: "Schedule reports", allowed: false },
        ],
      },
    ],
  },
  {
    id: "viewer",
    label: "Viewer / Auditor",
    description: "Read-only access to all data for monitoring and compliance purposes.",
    color: "bg-muted text-muted-foreground",
    permissions: [
      {
        category: "accounts",
        actions: [
          { id: "acc_view", label: "View accounts", allowed: true },
          { id: "acc_create", label: "Create accounts", allowed: false },
          { id: "acc_edit", label: "Edit accounts", allowed: false },
          { id: "acc_close", label: "Close accounts", allowed: false },
        ],
      },
      {
        category: "transactions",
        actions: [
          { id: "tx_view", label: "View transactions", allowed: true },
          { id: "tx_initiate", label: "Initiate transfers", allowed: false },
          { id: "tx_approve", label: "Approve transfers", allowed: false },
          { id: "tx_bulk", label: "Bulk payments", allowed: false },
        ],
      },
      {
        category: "approvals",
        actions: [
          { id: "apr_view", label: "View approval queue", allowed: true },
          { id: "apr_approve", label: "Approve / reject", allowed: false },
          { id: "apr_config", label: "Configure workflows", allowed: false },
          { id: "apr_override", label: "Override escalations", allowed: false },
        ],
      },
      {
        category: "users",
        actions: [
          { id: "usr_view", label: "View users", allowed: true },
          { id: "usr_invite", label: "Invite users", allowed: false },
          { id: "usr_roles", label: "Assign roles", allowed: false },
          { id: "usr_remove", label: "Remove users", allowed: false },
        ],
      },
      {
        category: "settings",
        actions: [
          { id: "set_general", label: "General settings", allowed: false },
          { id: "set_security", label: "Security policies", allowed: false },
          { id: "set_api", label: "API keys", allowed: false },
          { id: "set_billing", label: "Billing", allowed: false },
        ],
      },
      {
        category: "reports",
        actions: [
          { id: "rpt_view", label: "View reports", allowed: true },
          { id: "rpt_export", label: "Export data", allowed: true },
          { id: "rpt_audit", label: "Audit trail", allowed: true },
          { id: "rpt_schedule", label: "Schedule reports", allowed: false },
        ],
      },
    ],
  },
];
