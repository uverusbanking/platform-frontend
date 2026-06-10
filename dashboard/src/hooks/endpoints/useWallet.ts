import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import {
  IGetWalletsParams,
  IWallet,
  IGetHeldTransactionsResponse,
} from "@/types/wallet.types";
import {
  IAdjustmentResult,
  IExternalDebitPayload,
  IExternalCreditPayload,
  IFeeAdjustmentPayload,
  IManualCorrectionPayload,
  IReversalPayload,
  IListAdjustmentsResponse,
  AdjustmentType,
} from "@/types/adjustment.types";

export const getWallets = async (
  params: IGetWalletsParams,
): Promise<IApiResponse<IWallet[]>> => {
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

export const adjustExternalDebit = async (
  walletId: string,
  payload: IExternalDebitPayload,
): Promise<IAdjustmentResult> => {
  const response = await apiClient.post(
    `/platform/wallets/${walletId}/adjustments/external-debit`,
    payload,
  );
  return response.data;
};

export const adjustExternalCredit = async (
  walletId: string,
  payload: IExternalCreditPayload,
): Promise<IAdjustmentResult> => {
  const response = await apiClient.post(
    `/platform/wallets/${walletId}/adjustments/external-credit`,
    payload,
  );
  return response.data;
};

export const collectFee = async (
  walletId: string,
  payload: IFeeAdjustmentPayload,
): Promise<IAdjustmentResult> => {
  const response = await apiClient.post(
    `/platform/wallets/${walletId}/adjustments/fee`,
    payload,
  );
  return response.data;
};

export const manualCorrection = async (
  walletId: string,
  payload: IManualCorrectionPayload,
): Promise<IAdjustmentResult> => {
  const response = await apiClient.post(
    `/platform/wallets/${walletId}/adjustments/correction`,
    payload,
  );
  return response.data;
};

export const reverseTransaction = async (
  walletId: string,
  payload: IReversalPayload,
): Promise<IAdjustmentResult> => {
  const response = await apiClient.post(
    `/platform/wallets/${walletId}/adjustments/reversal`,
    payload,
  );
  return response.data;
};

export const getAdjustments = async (
  walletId: string,
  params?: { page?: number; limit?: number; adjustment_type?: AdjustmentType },
): Promise<IListAdjustmentsResponse> => {
  const response = await apiClient.get(
    `/platform/wallets/${walletId}/adjustments`,
    { params },
  );
  return response.data;
};
