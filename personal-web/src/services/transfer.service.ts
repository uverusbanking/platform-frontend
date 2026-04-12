import { api } from "@/lib/api";
import type {
  BankListInterface,
  ResolveAccountDto,
  ResolveAccountResponseDto,
  InitiateTransferDto,
  TransferResponseDto,
  TransactionsResponseDto,
  SingleTransactionResponseDto,
  ApiResponse,
} from "@/types";

export const TransferService = {
  getBanks: () => api.get<BankListInterface>("/api/v1/transfers/banks"),

  resolveAccount: (data: ResolveAccountDto) =>
    api.post<ApiResponse<ResolveAccountResponseDto>>(
      "/api/v1/transfers/resolve-account",
      data,
    ),

  initiateTransfer: (data: InitiateTransferDto) =>
    api.post<ApiResponse<TransferResponseDto>>(
      "/api/v1/transfers/initiate",
      data,
    ),

  getTransactions: (page: number = 1, limit: number = 20) =>
    api.get<TransactionsResponseDto>("/api/v1/transactions", {
      query: { page, limit },
    }),

  getTransactionDetails: (transactionId: string) =>
    api.get<SingleTransactionResponseDto>(
      `/api/v1/transactions/${transactionId}`,
    ),
};
