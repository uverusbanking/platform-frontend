import { useQuery } from "@tanstack/react-query";
import { TError, IApiResponse } from "@/types/apiResponse.type";
import { IApiKey } from "@/types/organisation.types";
import {
  getOrganisationUsers,
  getApiKeys,
  getOrganisationDocuments,
  getOrganisations,
} from "@/hooks/endpoints/useOrganisation";
import {
  IOrganisation,
  IOrganisationDocument,
} from "@/types/organisation.types";
import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  IGetOrganisationUsersParams,
  IGetOrganisationUsersResponse,
  IGetOrganisationsParams,
  IGetOrganisationsResponse,
  IOrganisationStatsSummary,
} from "@/types/organisation.types";
import {
  getOrganisationById,
  getOrganisationStatsById,
  getOrganisationStatistics,
} from "@/hooks/endpoints/useOrganisation";
import {
  IGetOrganisationStatsParams,
  IOrganisationStats,
} from "@/types/organisation.types";

export const useGetOrganisationById = (id: string) => {
  return useQuery<IApiResponse<IOrganisation>, TError>({
    queryKey: [QUERY_KEYS.ORGANISATION.GET_BY_ID, id],
    queryFn: () => getOrganisationById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetOrganisationUsers = (
  params: IGetOrganisationUsersParams = {},
) => {
  return useQuery<IGetOrganisationUsersResponse, TError>({
    queryKey: [QUERY_KEYS.ORGANISATION.USERS, params],
    queryFn: () => getOrganisationUsers(params),
    enabled: !!params.organisationId,
    staleTime: 1000 * 60 * 10, // 10 minutes for staff list
  });
};

export const useGetApiKeys = (environment: "LIVE" | "SANDBOX") => {
  return useQuery<IApiKey[], TError>({
    queryKey: [QUERY_KEYS.ORGANISATION.API_KEYS, environment],
    queryFn: () => getApiKeys(environment),
    staleTime: 1000 * 60 * 30, // 30 minutes for API keys as they change rarely
  });
};

export const useGetOrganisations = (
  params: IGetOrganisationsParams = { page: 1, limit: 10 },
) => {
  return useQuery<IGetOrganisationsResponse, TError>({
    queryKey: [QUERY_KEYS.ORGANISATION.GET_ALL, params],
    queryFn: () => getOrganisations(params),
    staleTime: 1000 * 60 * 10, // 10 minutes for company list
  });
};

export const useGetOrganisationDocuments = (organisationId: string) => {
  return useQuery<IOrganisationDocument[], TError>({
    queryKey: [QUERY_KEYS.ORGANISATION.DOCUMENTS, organisationId],
    queryFn: () => getOrganisationDocuments(organisationId),
    enabled: !!organisationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetOrganisationStatistics = (
  params?: IGetOrganisationStatsParams,
) => {
  return useQuery<IApiResponse<IOrganisationStatsSummary>, TError>({
    queryKey: [QUERY_KEYS.ORGANISATION.STATISTICS, params],
    queryFn: () => getOrganisationStatistics(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetOrganisationStatsById = (
  id: string,
  params?: IGetOrganisationStatsParams,
) => {
  return useQuery<IApiResponse<IOrganisationStats>, TError>({
    queryKey: [QUERY_KEYS.ORGANISATION.STATS, id, params],
    queryFn: () => getOrganisationStatsById(id, params),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
