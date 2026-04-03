import { IApiResponse } from "@/types/apiResponse.type";
import apiClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { IGetWalletsParams, IWallet } from "@/types/wallet.types";

const getWallets = async (
  params: IGetWalletsParams,
): Promise<IApiResponse<IWallet[]>> => {
  const response = await apiClient.get("/wallets", { params });
  return response.data;
};

// query is not supposed to be here
export const useGetWallets = (params: IGetWalletsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WALLET.GET_ALL, params],
    queryFn: () => getWallets(params),
    // Platform users might want to fetch all wallets without a specific customer_id
    // enabled: !!params.customer_id,
  });
};
