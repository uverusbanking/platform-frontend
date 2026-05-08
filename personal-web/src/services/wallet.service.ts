import { api } from "@/lib/api";
import type {
  ApiResponse,
  WalletBalanceResponseDto,
  VirtualAccountResponseDto,
  CreateWalletDto,
} from "@/types";

export interface WalletDto {
  id: string;
  customer_id: string;
  balance: string;
  name: string;
  account_number: string;
  bank_name: string;
  account_name: string;
  status: string;
  currency: string;
}

export const WalletService = {
  getWallet: () => api.get<ApiResponse<WalletDto[]>>("/api/v1/wallets"),

  getVirtualAccount: () =>
    api.get<{ status: string; data: VirtualAccountResponseDto | null }>(
      "/api/v1/wallets/virtual-account",
    ),

  createWallet: (data: CreateWalletDto) =>
    api.post<ApiResponse<WalletDto>>("/api/v1/wallets/create", data),
};
