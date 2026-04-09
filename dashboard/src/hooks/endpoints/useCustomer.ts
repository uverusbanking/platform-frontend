import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import { IUser } from "@/types/user.types";
import { ICustomer, IRegisterNewCustomerPayload } from "@/types/customer.types";
import {
  ICreateCustomerPayload,
  IGetCustomersParams,
  IGetCustomersResponse,
  IFreezeCustomerPayload,
} from "@/types/customer.types";

export const createCustomer = async (
  payload: ICreateCustomerPayload,
): Promise<IApiResponse<IUser>> => {
  const response = await apiClient.post("/customers/organisation", payload);
  return response.data;
};

export const getCustomers = async (
  params: IGetCustomersParams,
): Promise<IGetCustomersResponse> => {
  const response = await apiClient.get("/customers/organisation", { params });
  return response.data;
};

export const getCustomer = async (
  id: string,
): Promise<IApiResponse<ICustomer>> => {
  const response = await apiClient.get(`/customers/organisation/${id}`);
  return response.data;
};

export const freezeCustomer = async (
  id: string,
  payload: IFreezeCustomerPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    `/customers/organisation/${id}/freeze`,
    payload,
  );
  return response.data;
};

export const unfreezeCustomer = async (
  id: string,
  payload: { justification: string },
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    `/customers/organisation/${id}/unfreeze`,
    payload,
  );
  return response.data;
};

export const registerNewCustomer = async (
  payload: IRegisterNewCustomerPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    "/company/register-new-customer",
    payload,
  );
  return response.data;
};
