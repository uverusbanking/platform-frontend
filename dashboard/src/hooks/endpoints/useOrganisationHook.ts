import { IApiResponse, TError } from "@/types/apiResponseType";
import {
  getOrganisationStats,
  getOrganisation,
  updateOrganisation,
  getOrganisationDocuments,
  updateOrganisationDocuments,
  IOrganisationStats,
  IMember,
  IOrganisation,
  IUpdateOrganisationPayload,
  IOrganisationDocument,
  OrganisationDocumentType,
  IUpdateDocumentPayload,
  IUpdateDocumentsPayload,
} from "@/services/organisationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";

export {
  type IOrganisationStats,
  type IMember,
  type IOrganisation,
  type IUpdateOrganisationPayload,
  type IOrganisationDocument,
  type OrganisationDocumentType,
  type IUpdateDocumentPayload,
  type IUpdateDocumentsPayload,
};

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

export const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<IOrganisation>,
    TError,
    IUpdateOrganisationPayload
  >({
    mutationFn: updateOrganisation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORGANISATION] });
    },
  });
};

// --- Organisation Documents ---

export const useGetOrganisationDocuments = () => {
  return useQuery<IApiResponse<IOrganisationDocument[]>, TError>({
    queryKey: [QUERY_KEYS.ORGANISATION_DOCUMENTS],
    queryFn: getOrganisationDocuments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateOrganisationDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<IOrganisationDocument[]>,
    TError,
    IUpdateDocumentsPayload
  >({
    mutationFn: updateOrganisationDocuments,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION_DOCUMENTS],
      });
    },
  });
};
