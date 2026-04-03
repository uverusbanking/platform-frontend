import {
  IRegisterNewCustomerPayload,
  IVerifyNewCustomerRegistrationPayload,
  IVerifyNewCustomerRegistrationResponse,
} from "@/types/customer.types";
import apiClient from "@/lib/axios";

export const verifyNewCustomerRegistration = async (
  payload: IVerifyNewCustomerRegistrationPayload,
): Promise<IVerifyNewCustomerRegistrationResponse> => {
  const response = await apiClient.post(
    "/company/verify-new-customer-registration",
    payload,
  );
  return response.data.data;
};

export const registerNewCustomer = async (
  payload: IRegisterNewCustomerPayload,
): Promise<unknown> => {
  const response = await apiClient.post(
    "/company/register-new-customer",
    payload,
  );
  return response.data.data;
};
