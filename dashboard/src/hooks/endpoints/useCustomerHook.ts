import { IApiResponse, TError } from "@/types/apiResponseType";
import { IUser } from "@/types/user.types";
import {
  createCustomer,
  freezeCustomer,
  unfreezeCustomer,
  getCustomers,
  getCustomer,
  ICreateCustomerPayload,
  IFreezeCustomerPayload,
  IGetCustomersParams,
  IGetCustomersResponse,
} from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";

// Types are now imported from services/userService

export {
  type ICreateCustomerPayload,
  type IGetCustomersParams,
  type IGetCustomersResponse,
};

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

export const useGetCustomers = (params: IGetCustomersParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS, params],
    queryFn: () => getCustomers(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useGetCustomerById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER, id],
    queryFn: () => getCustomer(id),
    enabled: !!id,
  });
};
