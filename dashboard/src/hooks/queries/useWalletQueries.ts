import { useQuery } from "@tanstack/react-query";
import { IGetWalletsParams } from "@/types/wallet.types";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { getWallets, getHeldTransactions } from "../endpoints/useWallet";

export const useGetWallets = (params: IGetWalletsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WALLETS, params],
    queryFn: () => getWallets(params),
    enabled: !!params.customer_id,
  });
};

export const useGetHeldTransactions = (
  walletId: string,
  page: number = 1,
  limit: number = 10,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.HELD_TRANSACTIONS, walletId, page, limit],
    queryFn: () => getHeldTransactions(walletId, page, limit),
    enabled: !!walletId,
  });
};
