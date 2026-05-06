export interface IWallet {
  id: string;
  name: string;
  customer_id: string;
  environment: "LIVE" | "SANDBOX";
  account_type: string;
  currency: string;
  account_number: string;
  account_name: string;
  bank_name: string;
  bank_logo: string | null;
  bank_code: string;
  balance: string;
  hold_balance: string;
  status: string;
  is_transfer_frozen: boolean;
  is_funding_frozen: boolean;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  metadata?: Record<string, unknown>;
}

export interface IGetWalletsParams {
  customer_id?: string;
  environment?: "LIVE" | "SANDBOX";
}
export interface ICustomerWithWallets {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  organisation?: {
    id: string;
    organisation_name: string;
  };
  wallets: IWallet[];
}

export interface IGetCustomersWalletsResponse {
  data: ICustomerWithWallets[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IGetPlatformCustomerWalletsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  organisation_id?: string;
}
