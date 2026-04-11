import { api } from "@/lib/api";
import type {
  WalletBalanceResponseDto,
  VirtualAccountResponseDto,
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
  getWallet: () => api.get<WalletDto>("/api/v1/wallets/me"),

  getVirtualAccount: () =>
    api.get<{ status: string; data: VirtualAccountResponseDto | null }>(
      "/api/v1/wallets/virtual-account",
    ),
};
