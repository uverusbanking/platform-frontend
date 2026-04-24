import { useQuery } from "@tanstack/react-query";
import { TError } from "@/types/apiResponse.type";
import { getRoles } from "@/hooks/endpoints/usePlatform";
import { getOrganisations } from "@/hooks/endpoints/useOrganisation";
import { IRole } from "@/types/user.types";
import {
  IGetOrganisationsParams,
  IGetOrganisationsResponse,
} from "@/types/organisation.types";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useGetOrganisations = (
  params: IGetOrganisationsParams = { page: 1, limit: 10 },
) => {
  return useQuery<IGetOrganisationsResponse, TError>({
    queryKey: [QUERY_KEYS.PLATFORM.ORGANISATIONS, params],
    queryFn: () => getOrganisations(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetRoles = (type: "PLATFORM" | "BRAND" = "PLATFORM") => {
  return useQuery<IRole[], TError>({
    queryKey: [QUERY_KEYS.PLATFORM.ROLES, type],
    queryFn: () => getRoles(type),
    staleTime: 1000 * 60 * 30, // 30 minutes - roles don't change often
  });
};
