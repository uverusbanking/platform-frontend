import { useQuery } from "@tanstack/react-query";
import { IGetWalletsParams } from "@/types/wallet.types";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { getWallets } from "../endpoints/useWallet";

export const useGetWallets = (params: IGetWalletsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WALLETS, params],
    queryFn: () => getWallets(params),
    enabled: !!params.customer_id,
  });
};
