import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { IApiResponse, TError } from "@/types/apiResponseType";
import { IApiKey, ICreateApiKeyPayload } from "@/types/apiKeys.types";
import {
  createApiKey,
  deleteApiKey,
  getApiKeys,
} from "@/services/apiKeysService";

export const useGetApiKeys = () => {
  return useQuery<IApiResponse<IApiKey[]>, TError>({
    queryKey: [QUERY_KEYS.API_KEYS],
    queryFn: getApiKeys,
    staleTime: 1000 * 60 * 30,
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation<IApiResponse<IApiKey>, TError, ICreateApiKeyPayload>({
    mutationFn: createApiKey,
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.API_KEYS] });
      }
    },
  });
};

export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation<IApiResponse<unknown>, TError, string>({
    mutationFn: deleteApiKey,
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.API_KEYS] });
      }
    },
  });
};
