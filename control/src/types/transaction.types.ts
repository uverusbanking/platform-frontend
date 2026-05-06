export interface ITransaction {
  id: string;
  reference: string;
  type: "CREDIT" | "DEBIT";
  amount: string;
  description: string;
  status: "SUCCESSFUL" | "FAILED" | "PENDING";
  currency: string;
  customer_id: string;
  wallet_id?: string;
  createdAt: string;
}

export interface ITransactionMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface IGetTransactionsResponse {
  status: string;
  meta: ITransactionMeta;
  data: ITransaction[];
}

export interface IGetPlatformTransactionFilters {
  type?: "CREDIT" | "DEBIT";
  status?: "SUCCESSFUL" | "FAILED" | "PENDING";
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}
