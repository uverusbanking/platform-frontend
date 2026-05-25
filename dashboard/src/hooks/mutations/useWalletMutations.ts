import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IApiResponse, TError } from "@/types/apiResponseType";
import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  releaseSingleHeldTransaction,
  releaseAllHeldTransactions,
} from "../endpoints/useWallet";

export const useReleaseSingleHeldTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<unknown>,
    TError,
    { walletId: string; transactionId: string }
  >({
    mutationFn: ({ walletId, transactionId }) =>
      releaseSingleHeldTransaction(walletId, transactionId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.HELD_TRANSACTIONS, variables.walletId],
      });
    },
  });
};

export const useReleaseAllHeldTransactions = () => {
  const queryClient = useQueryClient();
  return useMutation<IApiResponse<unknown>, TError, { walletId: string }>({
    mutationFn: ({ walletId }) => releaseAllHeldTransactions(walletId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.HELD_TRANSACTIONS, variables.walletId],
      });
    },
  });
};
