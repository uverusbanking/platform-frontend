import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import {
  IGetWalletsParams,
  IWallet,
  IGetHeldTransactionsResponse,
} from "@/types/wallet.types";

export const getWallets = async (
  params: IGetWalletsParams,
): Promise<IApiResponse<IWallet>> => {
  const response = await apiClient.get("/wallets/organisation", { params });
  return response.data;
};

export const freezeWallet = async (
  walletId: string,
  payload: { transfer?: boolean; funding?: boolean; reason?: string },
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(`/wallets/${walletId}/freeze`, payload);
  return response.data;
};

export const unfreezeWallet = async (
  walletId: string,
  payload: { transfer?: boolean; funding?: boolean },
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    `/wallets/${walletId}/unfreeze`,
    payload,
  );
  return response.data;
};

export const getHeldTransactions = async (
  walletId: string,
  page: number = 1,
  limit: number = 10,
): Promise<IGetHeldTransactionsResponse> => {
  const response = await apiClient.get(
    `/platform/wallets/${walletId}/held-transactions`,
    { params: { page, limit } },
  );
  return response.data;
};

export const releaseSingleHeldTransaction = async (
  walletId: string,
  transactionId: string,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    `/platform/wallets/${walletId}/held-transactions/${transactionId}/release`,
  );
  return response.data;
};

export const releaseAllHeldTransactions = async (
  walletId: string,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    `/platform/wallets/${walletId}/held-transactions/release-all`,
  );
  return response.data;
};
