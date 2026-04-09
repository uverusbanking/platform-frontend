import { api } from "@/lib/api";
import type {
  BankListResponseDto,
  ResolveAccountDto,
  ResolveAccountResponseDto,
  InitiateTransferDto,
  TransferResponseDto,
  TransactionResponseDto,
  BankListInterface,
} from "@/types";

export const TransferService = {
  getBanks: () => api.get<BankListInterface>("/api/v1/payment/banks"),

  resolveAccount: (data: ResolveAccountDto) =>
    api.post<ResolveAccountResponseDto>(
      "/api/v1/payment/validate-bank-account",
      data,
    ),

  initiateTransfer: (data: InitiateTransferDto) =>
    api.post<TransferResponseDto>("/api/v1/payment/transfer", data),

  getTransactions: (page: number = 1, limit: number = 20) =>
    api.get<TransactionResponseDto[]>("/api/v1/payment/transactions", {
      query: { page, limit },
    }),

  getTransactionDetails: (transactionId: string) =>
    api.get<TransactionResponseDto>(
      `/api/v1/payment/transactions/${transactionId}`,
    ),
};
