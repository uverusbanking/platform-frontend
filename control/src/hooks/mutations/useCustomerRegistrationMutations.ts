import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  registerNewCustomer,
  verifyNewCustomerRegistration,
} from "@/hooks/endpoints/useCustomerRegistration";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { IApiResponse } from "@/types/apiResponse.type";
import {
  IRegisterNewCustomerPayload,
  IVerifyNewCustomerRegistrationPayload,
  IVerifyNewCustomerRegistrationResponse,
} from "@/types/customer.types";

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
