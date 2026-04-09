import { useQuery } from "@tanstack/react-query";
import { IApiResponse, TError } from "@/types/apiResponseType";
import { IBanks, getBanks } from "@/hooks/endpoints/useTransfer";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useGetBanks = (organisation_id: string) => {
  return useQuery<IApiResponse<IBanks[]>, TError>({
    queryKey: [QUERY_KEYS.BANKS],
    queryFn: () => getBanks(organisation_id),
  });
};
