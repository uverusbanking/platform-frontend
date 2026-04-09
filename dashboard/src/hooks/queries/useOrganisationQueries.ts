import { useQuery } from "@tanstack/react-query";
import { IApiResponse, TError } from "@/types/apiResponseType";
import {
  IOrganisationStats,
  IOrganisation,
  IOrganisationDocument,
} from "@/types/organisation.types";
import {
  getOrganisation,
  getOrganisationDocuments,
  getOrganisationStats,
} from "@/hooks/endpoints/useOrganisation";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useGetOrganisationStats = () => {
  return useQuery<IApiResponse<IOrganisationStats>, TError>({
    queryKey: ["organisation-stats"], // Keep as string for now if not in keys or add to keys
    queryFn: getOrganisationStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetOrganisation = () => {
  return useQuery<IApiResponse<IOrganisation>, TError>({
    queryKey: [QUERY_KEYS.ORGANISATION],
    queryFn: getOrganisation,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useGetOrganisationDocuments = () => {
  return useQuery<IApiResponse<IOrganisationDocument[]>, TError>({
    queryKey: [QUERY_KEYS.ORGANISATION_DOCUMENTS],
    queryFn: getOrganisationDocuments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
