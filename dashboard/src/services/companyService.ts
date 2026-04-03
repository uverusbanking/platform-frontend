import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import {
  IApiKey,
  ICreateApiKeyPayload,
  IGenerateApiKeyResponse,
} from "@/types/company.types";
import { IUser } from "@/types/user.types";

// Types for registration
export interface IDirector {
  // Add specific fields if available, otherwise use strict typing or generic
  [key: string]: unknown;
}

export interface ICompanyRegistrationPayload {
  companyName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  tin: string;
  cacNumber: string;
  businessEmail: string;
  businessPhone: string;
  directors: IDirector[];
  documents: Record<string, unknown>;
}

export interface ICheckCompanyExistsPayload {
  cacRegistrationNumber: string;
  tin: string;
  businessEmail: string;
}

export interface ICheckCompanyExistsResponse {
  exists: boolean;
  // Add other fields if returned
}

export interface IAddBrandUserPayload {
  email: string;
  phone_number: string;
  role: string;
  gender: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  password?: string;
}

export interface IGetCompanyUsersParams {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export const getCompanyUsers = async (
  params: IGetCompanyUsersParams,
): Promise<IApiResponse<IUser[]>> => {
  const response = await apiClient.get("/organisation/members", { params });
  return response.data;
};

export const addBrandUser = async (
  payload: IAddBrandUserPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    "/organisation/member/add-new",
    payload,
  );
  return response.data;
};

export const updateBrandUser = async (
  payload: Partial<IAddBrandUserPayload> & { userId: string },
): Promise<IApiResponse<unknown>> => {
  const { userId, ...data } = payload;
  const response = await apiClient.patch(
    `/organisation/members/${userId}`,
    data,
  );
  return response.data;
};

export const deleteBrandUser = async (
  userId: string,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.delete(`/organisation/members/${userId}`);
  return response.data;
};

export const getApiKeys = async (
  environment: "LIVE" | "SANDBOX",
): Promise<IApiResponse<IApiKey[]>> => {
  const response = await apiClient.get(
    `/organisation/api-keys?environment=${environment}`,
  );
  return response.data;
};

export const createApiKey = async (
  payload: ICreateApiKeyPayload,
): Promise<IApiResponse<IGenerateApiKeyResponse>> => {
  const response = await apiClient.post("/organisation/api-keys", payload);
  return response.data;
};

export const deleteApiKey = async (params: {
  id: string;
  environment: "LIVE" | "SANDBOX";
}): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.delete(
    `/organisation/api-keys/${params.id}`,
    {
      params: { environment: params.environment },
    },
  );
  return response.data;
};

export const registerCompany = async (
  payload: ICompanyRegistrationPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post("/organisation/register", payload);
  return response.data;
};

export const checkIfCompanyExists = async (
  payload: ICheckCompanyExistsPayload,
): Promise<IApiResponse<ICheckCompanyExistsResponse>> => {
  const response = await apiClient.post(
    "/organisation/check-if-company-exists",
    payload,
  );
  return response.data;
};
