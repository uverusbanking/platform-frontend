import { IApiResponse, TError } from "@/types/apiResponseType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  getBanks,
  IBanks,
  initiateTransfer,
  ITransferPayload,
  IVerifyAccountPayload,
  IVerifyAccountResponse,
  verifyAccount,
} from "@/services/transferService";

export const useGetBanks = (organisation_id: string) => {
  return useQuery<IApiResponse<IBanks[]>, TError>({
    queryKey: [QUERY_KEYS.BANKS],
    queryFn: () => getBanks(organisation_id),
  });
};

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
