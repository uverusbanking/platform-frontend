import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IApiResponse } from "@/types/apiResponseType";
import { IUser } from "@/types/user.types";
import {
  ICreateCustomerPayload,
  IFreezeCustomerPayload,
} from "@/types/customer.types";
import {
  createCustomer,
  freezeCustomer,
  setCustomerTier,
  unfreezeCustomer,
} from "../endpoints/useCustomer";
import { TError } from "@/types/apiResponseType";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { IRegisterNewCustomerPayload } from "@/types/customer.types";
import { AxiosError } from "axios";
import { registerNewCustomer } from "@/hooks/endpoints/useCustomer";

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<IApiResponse<IUser>, TError, ICreateCustomerPayload>({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] });
    },
  });
};

export const useFreezeCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<unknown>,
    TError,
    { id: string; payload: IFreezeCustomerPayload }
  >({
    mutationFn: ({ id, payload }) => freezeCustomer(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] });
    },
  });
};

export const useUnfreezeCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<unknown>,
    TError,
    { id: string; payload: { justification: string } }
  >({
    mutationFn: ({ id, payload }) => unfreezeCustomer(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] });
    },
  });
};

export const useSetCustomerTier = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<unknown>,
    TError,
    { id: string; payload: { kyc_level: number; justification: string } }
  >({
    mutationFn: ({ id, payload }) => setCustomerTier(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] });
    },
  });
};

export const useRegisterNewCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<unknown>,
    AxiosError<unknown, IApiResponse<unknown>>,
    IRegisterNewCustomerPayload
  >({
    mutationFn: registerNewCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] });
      // You might want to show a success toast message here
      // toast.success(data.message || "Profile updated successfully", {description: ""});
    },
  });
};
