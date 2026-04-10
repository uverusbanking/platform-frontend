import { freezeCustomer } from "@/hooks/endpoints/useCustomer";
import { IApiResponse, TError } from "@/types/apiResponse.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfreezeCustomer } from "../endpoints/useCustomer";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { IFreezeCustomerPayload } from "@/types/customer.types";
import { IUser } from "@/types/user.types";

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
        queryKey: [QUERY_KEYS.CUSTOMER.GET_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER.GET_ALL],
      });
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
        queryKey: [QUERY_KEYS.CUSTOMER.GET_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER.GET_ALL],
      });
    },
  });
};
