export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ActionCategory =
  | "SECURITY"
  | "FINANCIAL"
  | "PROFILE"
  | "SYSTEM"
  | "AUTHENTICATION";

// Platform-wide audit log types (matches backend AuditLog model)
export type AuditActionCategory =
  | "PLATFORM"
  | "ORGANISATION"
  | "CUSTOMER"
  | "SECURITY"
  | "FINANCIAL"
  | "COMPLIANCE"
  | "ADMINISTRATIVE";

export type AuditStatus = "SUCCESS" | "FAILED" | "PENDING" | "BLOCKED";
export type ActorLevel =
  | "PLATFORM_USER"
  | "ORGANISATION_USER"
  | "CUSTOMER"
  | "SYSTEM";

export interface IAuditLog {
  id: string;
  actor_level: ActorLevel;
  actor_id: string;
  actor_role: string;
  actor_organisation_id: string | null;
  actor_ip: string | null;
  actor_user_agent: string | null;
  service_name: string;
  action: string;
  action_category: AuditActionCategory;
  target_type: string | null;
  target_id: string | null;
  status: AuditStatus;
  risk_level: RiskLevel;
  before_state: unknown;
  after_state: unknown;
  metadata: unknown;
  error_message: string | null;
  request_id: string | null;
  hash_signature: string | null;
  created_at: string;
}

export interface IGetAuditLogsFilters {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  actorId?: string;
  actorLevel?: ActorLevel;
  actorOrganisationId?: string;
  serviceName?: string;
  action?: string;
  actionCategory?: AuditActionCategory;
  targetType?: string;
  targetId?: string;
  status?: AuditStatus;
  riskLevel?: RiskLevel;
  startDate?: string;
  endDate?: string;
}

export interface IAuditLogsResponse {
  data: IAuditLog[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ICustomerActivityLog {
  id: string;
  customer_id: string;
  action: string;
  action_category: ActionCategory;
  description: string;
  actor_id: string;
  actor_type: string;
  actor_role: string;
  actor_ip: string;
  risk_level: RiskLevel;
  before_state: any | null;
  after_state: any | null;
  metadata: any | null;
  user_agent: string | null;
  created_at: string;
}

export interface IGetCustomerActivityFilters {
  page?: number;
  limit?: number;
  actionCategory?: ActionCategory;
  riskLevel?: RiskLevel;
  startDate?: string;
  endDate?: string;
}

export interface ICustomerActivityResponse {
  status: string;
  data: ICustomerActivityLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
