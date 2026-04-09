import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import {
  IVerifyAccountPayload,
  IVerifyAccountResponse,
  ITransferPayload,
} from "@/types/transfer.type";

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

export const verifyAccount = async (
  payload: IVerifyAccountPayload,
): Promise<IApiResponse<IVerifyAccountResponse>> => {
  const response = await apiClient.post(
    `/customers/organisation/verify-account`,
    payload,
  );
  return response.data;
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
