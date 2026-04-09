import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import { IGetWalletsParams, IWallet } from "@/types/wallet.types";

export const getWallets = async (
  params: IGetWalletsParams,
): Promise<IApiResponse<IWallet>> => {
  const response = await apiClient.get("/wallets/organisation", { params });
  return response.data;
};
