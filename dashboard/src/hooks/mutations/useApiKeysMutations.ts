import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IApiResponse, TError } from "@/types/apiResponseType";
import { IApiKey, ICreateApiKeyPayload } from "@/types/apiKeys.types";
import { createApiKey, deleteApiKey } from "@/hooks/endpoints/useApiKeys";
import { QUERY_KEYS } from "@/lib/queryKeys";

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
