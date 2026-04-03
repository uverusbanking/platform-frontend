import { IApiResponse } from "@/types/apiResponse.type";
import {
  IRegisterNewCustomerPayload,
  IVerifyNewCustomerRegistrationPayload,
  IVerifyNewCustomerRegistrationResponse,
} from "@/types/customer.types";
import apiClient from "@/lib/axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { QUERY_KEYS } from "@/lib/queryKeys";

const verifyNewCustomerRegistration = async (
  payload: IVerifyNewCustomerRegistrationPayload,
): Promise<IVerifyNewCustomerRegistrationResponse> => {
  const response = await apiClient.post(
    "/company/verify-new-customer-registration",
    payload,
  );
  return response.data.data;
};

export const useVerifyNewCustomerRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IVerifyNewCustomerRegistrationResponse,
    AxiosError<unknown, IApiResponse<unknown>>,
    IVerifyNewCustomerRegistrationPayload
  >({
    mutationFn: verifyNewCustomerRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AUTH.COMPANY_LOGIN],
      });
      // You might want to show a success toast message here
      // toast.success(data.message || "Profile updated successfully", {description: ""});
    },
  });
};

const registerNewCustomer = async (
  payload: IRegisterNewCustomerPayload,
): Promise<unknown> => {
  const response = await apiClient.post(
    "/company/register-new-customer",
    payload,
  );
  return response.data.data;
};

export const useRegisterNewCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<unknown, IApiResponse<unknown>>,
    IRegisterNewCustomerPayload
  >({
    mutationFn: registerNewCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER.GET_ALL],
      });
      // You might want to show a success toast message here
      // toast.success(data.message || "Profile updated successfully", {description: ""});
    },
  });
};
