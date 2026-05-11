import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TError } from "@/types/apiResponse.type";
import { IApiResponse } from "@/types/apiResponse.type";
import {
  IFreezeWalletPayload,
  IUnfreezeWalletPayload,
} from "@/types/wallet.types";
import { freezeWallet, unfreezeWallet } from "@/hooks/endpoints/useWallet";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useFreezeWallet = (customerId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<unknown>,
    TError,
    { id: string; payload: IFreezeWalletPayload }
  >({
    mutationFn: ({ id, payload }) => freezeWallet(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLET.CUSTOMER_WALLETS, customerId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLET.FROZEN_FUNDS],
      });
    },
  });
};

export const useUnfreezeWallet = (customerId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<unknown>,
    TError,
    { id: string; payload: IUnfreezeWalletPayload }
  >({
    mutationFn: ({ id, payload }) => unfreezeWallet(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLET.CUSTOMER_WALLETS, customerId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLET.FROZEN_FUNDS],
      });
    },
  });
};
