export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ActionCategory = 'SECURITY' | 'FINANCIAL' | 'PROFILE' | 'SYSTEM' | 'AUTHENTICATION';

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
