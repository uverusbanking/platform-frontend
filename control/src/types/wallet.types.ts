export interface IWallet {
  id: string;
  customer_id: string;
  account_number: string;
  balance: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface IGetWalletsParams {
  customer_id?: string;
  environment?: "LIVE" | "SANDBOX";
}
