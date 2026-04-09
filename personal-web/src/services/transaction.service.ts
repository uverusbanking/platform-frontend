import { api } from "@/lib/api";
import type {
  TransactionsResponseDto,
  SingleTransactionResponseDto,
} from "@/types";

export const TransactionService = {
  getTransactions: ({ page, limit }: { page: number; limit: number }) =>
    api.get<TransactionsResponseDto>("/api/v1/transactions/organisation", {
      query: { page, limit },
    }),

  getTransactionDetails: (id: string) =>
    api.get<SingleTransactionResponseDto>(`/api/v1/transactions/organisation`, {
      query: { transactionId: id },
    }),
};
