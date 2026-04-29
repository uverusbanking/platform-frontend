import { useQuery } from "@tanstack/react-query";
import { IApiResponse, TError } from "@/types/apiResponseType";
import {
  IOrganisationStats,
  IOrganisation,
  IOrganisationDocument,
  IBrandConfig,
  IConfiguredDomains,
  IDomainVerificationStatus,
} from "@/types/organisation.types";
import {
  getOrganisation,
  getOrganisationDocuments,
  getOrganisationStats,
  getBrandSettings,
  getConfiguredDomains,
  getDomainVerificationStatuses,
  getGoLiveChecklist,
  IGoLiveChecklist,
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

export const useGetBrandSettings = () => {
  return useQuery<IApiResponse<IBrandConfig>, TError>({
    queryKey: [QUERY_KEYS.BRAND_SETTINGS],
    queryFn: getBrandSettings,
    staleTime: 1000 * 60 * 10,
  });
};

export const useGetConfiguredDomains = () => {
  return useQuery<
    IApiResponse<{ configured_domains: IConfiguredDomains }>,
    TError
  >({
    queryKey: [QUERY_KEYS.CONFIGURED_DOMAINS],
    queryFn: getConfiguredDomains,
    staleTime: 1000 * 60 * 10,
  });
};

export const useGetDomainVerificationStatuses = () => {
  return useQuery<IApiResponse<IDomainVerificationStatus[]>, TError>({
    queryKey: [QUERY_KEYS.DOMAIN_VERIFICATION],
    queryFn: getDomainVerificationStatuses,
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetGoLiveChecklist = () => {
  return useQuery<IApiResponse<IGoLiveChecklist>, TError>({
    queryKey: [QUERY_KEYS.GO_LIVE_CHECKLIST],
    queryFn: getGoLiveChecklist,
    staleTime: 1000 * 60 * 2,
  });
};
