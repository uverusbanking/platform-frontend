import { useMutation } from "@tanstack/react-query";
import { IApiResponse, TError } from "@/types/apiResponseType";
import {
  IVerifyAccountPayload,
  IVerifyAccountResponse,
  ITransferPayload,
} from "@/types/transfer.type";
import { verifyAccount, initiateTransfer } from "@/hooks/endpoints/useTransfer";

export const useVerifyAccount = () => {
  // const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<IVerifyAccountResponse>,
    TError,
    IVerifyAccountPayload
  >({
    mutationFn: verifyAccount,
    // onSuccess: () => {
    //     queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORGANISATION] });
    // },
  });
};

export const useInitiateTransfer = () => {
  // const queryClient = useQueryClient();

  return useMutation<IApiResponse<unknown>, TError, ITransferPayload>({
    mutationFn: initiateTransfer,
    // onSuccess: () => {
    //     queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORGANISATION] });
    // },
  });
};
