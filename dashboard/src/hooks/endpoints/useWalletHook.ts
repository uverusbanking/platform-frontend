import { IApiResponse, TError } from "@/types/apiResponseType";
import {
  getWallets,
  IWallet,
  IGetWalletsParams,
} from "@/services/walletService";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";

export { type IWallet, type IGetWalletsParams };

export const useGetWallets = (params: IGetWalletsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WALLETS, params],
    queryFn: () => getWallets(params),
    enabled: !!params.customer_id,
  });
};
