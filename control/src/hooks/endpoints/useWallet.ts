import { IApiResponse, TError } from "@/types/apiResponse.type";
import apiClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  IGetWalletsParams,
  IWallet,
  IFreezeWalletPayload,
  IUnfreezeWalletPayload,
} from "@/types/wallet.types";

const getWallets = async (
  params: IGetWalletsParams,
): Promise<IApiResponse<IWallet[]>> => {
  const response = await apiClient.get("/wallets", { params });
  return response.data;
};

// query is not supposed to be here
export const useGetWallets = (params: IGetWalletsParams) => {
  return useQuery<IApiResponse<IWallet[]>, TError>({
    queryKey: [QUERY_KEYS.WALLET.GET_ALL, params],
    queryFn: () => getWallets(params),
  });
};

export const getPlatformCustomerWallets = async (
  customerId: string,
): Promise<IWallet[]> => {
  const response = await apiClient.get(
    `/platform/wallets/customers/${customerId}`,
  );
  // If the endpoint returns a customer object with a wallets array, return that array
  if (response.data.data?.wallets) {
    return response.data.data.wallets;
  }
  // Otherwise assume it's directly returning an array
  return response.data.data || [];
};

export const freezeWallet = async (
  id: string,
  payload: IFreezeWalletPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(`/wallets/${id}/freeze`, payload);
  return response.data;
};

export const unfreezeWallet = async (
  id: string,
  payload: IUnfreezeWalletPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(`/wallets/${id}/unfreeze`, payload);
  return response.data;
};

export const useGetPlatformCustomerWallets = (customerId: string) => {
  return useQuery<IWallet[], TError>({
    queryKey: [QUERY_KEYS.WALLET.CUSTOMER_WALLETS, customerId],
    queryFn: () => getPlatformCustomerWallets(customerId),
    enabled: !!customerId,
  });
};
