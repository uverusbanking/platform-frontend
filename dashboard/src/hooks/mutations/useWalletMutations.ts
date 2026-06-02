import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IApiResponse, TError } from "@/types/apiResponseType";
import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  freezeWallet,
  unfreezeWallet,
  releaseSingleHeldTransaction,
  releaseAllHeldTransactions,
  adjustExternalDebit,
  adjustExternalCredit,
  collectFee,
  manualCorrection,
  reverseTransaction,
} from "../endpoints/useWallet";
import {
  IAdjustmentResult,
  IExternalDebitPayload,
  IExternalCreditPayload,
  IFeeAdjustmentPayload,
  IManualCorrectionPayload,
  IReversalPayload,
} from "@/types/adjustment.types";

export const useFreezeWallet = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<unknown>,
    TError,
    {
      walletId: string;
      payload: { transfer?: boolean; funding?: boolean; reason?: string };
    }
  >({
    mutationFn: ({ walletId, payload }) => freezeWallet(walletId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLETS, variables.walletId],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLETS] });
    },
  });
};

export const useUnfreezeWallet = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<unknown>,
    TError,
    { walletId: string; payload: { transfer?: boolean; funding?: boolean } }
  >({
    mutationFn: ({ walletId, payload }) => unfreezeWallet(walletId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLETS, variables.walletId],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLETS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.HELD_TRANSACTIONS, variables.walletId],
      });
    },
  });
};

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

export const useAdjustExternalDebit = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IAdjustmentResult,
    TError,
    { walletId: string; payload: IExternalDebitPayload }
  >({
    mutationFn: ({ walletId, payload }) =>
      adjustExternalDebit(walletId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLETS, variables.walletId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADJUSTMENTS, variables.walletId],
      });
    },
  });
};

export const useAdjustExternalCredit = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IAdjustmentResult,
    TError,
    { walletId: string; payload: IExternalCreditPayload }
  >({
    mutationFn: ({ walletId, payload }) =>
      adjustExternalCredit(walletId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLETS, variables.walletId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADJUSTMENTS, variables.walletId],
      });
    },
  });
};

export const useCollectFee = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IAdjustmentResult,
    TError,
    { walletId: string; payload: IFeeAdjustmentPayload }
  >({
    mutationFn: ({ walletId, payload }) => collectFee(walletId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLETS, variables.walletId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADJUSTMENTS, variables.walletId],
      });
    },
  });
};

export const useManualCorrection = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IAdjustmentResult,
    TError,
    { walletId: string; payload: IManualCorrectionPayload }
  >({
    mutationFn: ({ walletId, payload }) => manualCorrection(walletId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLETS, variables.walletId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADJUSTMENTS, variables.walletId],
      });
    },
  });
};

export const useReverseTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IAdjustmentResult,
    TError,
    { walletId: string; payload: IReversalPayload }
  >({
    mutationFn: ({ walletId, payload }) =>
      reverseTransaction(walletId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLETS, variables.walletId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADJUSTMENTS, variables.walletId],
      });
    },
  });
};
