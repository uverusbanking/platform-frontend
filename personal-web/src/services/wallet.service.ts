import { api } from "@/lib/api";
import type {
  WalletBalanceResponseDto,
  VirtualAccountResponseDto,
} from "@/types";

export const WalletService = {
  getBalance: () => api.get<WalletBalanceResponseDto>("/api/v1/wallets/me"),

  getVirtualAccount: () =>
    api.get<VirtualAccountResponseDto>("/api/v1/wallets/virtual-account"),

  createWallet: () => api.post<void>("/api/v1/wallets/create"),
};
