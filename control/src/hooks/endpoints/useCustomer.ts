import { IApiResponse } from "@/types/apiResponse.type";
import { ICustomer } from "@/types/customer.types";
import apiClient from "@/lib/axios";
import {
  IFreezeCustomerPayload,
  IGetCustomersParams,
  ICustomerStats,
} from "@/types/customer.types";

export const freezeCustomer = async (
  id: string,
  payload: IFreezeCustomerPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    `/customers/platform/${id}/freeze`,
    payload,
  );
  return response.data;
};

export const unfreezeCustomer = async (
  id: string,
  payload: { justification: string },
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    `/customers/platform/${id}/unfreeze`,
    payload,
  );
  return response.data;
};

export const getCustomerStats = async (): Promise<
  IApiResponse<ICustomerStats>
> => {
  const response = await apiClient.get("/customers/platform/stats");
  return response.data;
};

export const getCustomers = async (
  params: IGetCustomersParams,
): Promise<IApiResponse<ICustomer[]>> => {
  const response = await apiClient.get("/customers/platform", { params });
  return response.data;
};

export const getCustomer = async (
  id: string,
): Promise<IApiResponse<ICustomer>> => {
  const response = await apiClient.get(`/customers/platform/${id}`);
  return response.data;
};
