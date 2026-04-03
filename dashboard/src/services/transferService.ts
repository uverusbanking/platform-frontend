import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";

export type IBanks = {
  bank_name: string;
  bank_code: string;
  logo: string;
};

export const getBanks = async (
  organisation_id: string,
): Promise<IApiResponse<IBanks[]>> => {
  const response = await apiClient.get("/customers/organisation/banks", {
    params: { organisation_id },
  });
  return response.data;
};

export type IVerifyAccountPayload = {
  bank_code: string;
  account_number: string;
};

export type IVerifyAccountResponse = {
  accountNumber: string;
  accountName: string;
};

export const verifyAccount = async (
  payload: IVerifyAccountPayload,
): Promise<IApiResponse<IVerifyAccountResponse>> => {
  const response = await apiClient.post(
    `/customers/organisation/verify-account`,
    payload,
  );
  return response.data;
};

export type ITransferPayload = {
  customer_id: string;
  bank_code: string;
  account_number: string;
  bank_name: string;
  amount: number;
  currency: string;
  narration: string;
  meta_data?: { sender_name: string; sender_address: string }[];
};

export const initiateTransfer = async (
  payload: ITransferPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    `/customers/organisation/transfer`,
    payload,
  );
  return response.data;
};
