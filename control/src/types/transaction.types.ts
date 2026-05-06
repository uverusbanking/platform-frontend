export interface ITransaction {
  id: string;
  reference: string;
  type: "CREDIT" | "DEBIT";
  amount: string;
  description: string;
  status: "SUCCESSFUL" | "FAILED" | "PENDING" | "COMPLETED";
  currency: string;
  customer_id?: string;
  wallet_id?: string;
  createdAt?: string;
  date?: string;
  ledgerEntries?: Array<{
    id: string;
    type: "CREDIT" | "DEBIT";
    amount: string;
    balanceBefore?: string;
    balanceAfter?: string;
    description?: string;
    createdAt?: string;
    wallet: {
      id: string;
      accountNumber: string;
      accountName: string;
      bankName?: string;
      bankCode?: string;
    };
  }>;
  metadata?: any;
  recipient?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string;
  };
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
