import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import { IApiKey, ICreateApiKeyPayload } from "@/types/apiKeys.types";

export const getApiKeys = async (): Promise<IApiResponse<IApiKey[]>> => {
  const response = await apiClient.get("/api-keys");
  return response.data;
};

export const createApiKey = async (
  payload: ICreateApiKeyPayload,
): Promise<IApiResponse<IApiKey>> => {
  const response = await apiClient.post("/api-keys", payload);
  return response.data;
};

export const deleteApiKey = async (
  id: string,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.delete(`/api-keys/${id}`);
  return response.data;
};
