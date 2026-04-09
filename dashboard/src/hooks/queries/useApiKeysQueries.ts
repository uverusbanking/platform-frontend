import { useQuery } from "@tanstack/react-query";
import { IApiResponse, TError } from "@/types/apiResponseType";
import { IApiKey } from "@/types/apiKeys.types";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { getApiKeys } from "@/hooks/endpoints/useApiKeys";

export const useGetApiKeys = () => {
  return useQuery<IApiResponse<IApiKey[]>, TError>({
    queryKey: [QUERY_KEYS.API_KEYS],
    queryFn: getApiKeys,
    staleTime: 1000 * 60 * 30,
  });
};
