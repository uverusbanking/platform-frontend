import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IApiResponse, TError } from "@/types/apiResponseType";
import {
  IOrganisation,
  IUpdateOrganisationPayload,
  IOrganisationDocument,
  IUpdateDocumentsPayload,
  IBrandConfig,
  IConfiguredDomains,
  IUpdateBrandSettingsPayload,
  IUpdateConfiguredDomainsPayload,
} from "@/types/organisation.types";
import {
  updateOrganisation,
  updateOrganisationDocuments,
  updateBrandSettings,
  updateConfiguredDomains,
  initiateDomainVerification,
  checkDomainVerification,
} from "@/hooks/endpoints/useOrganisation";
import { QUERY_KEYS } from "@/lib/queryKeys";

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

export const useUpdateBrandSettings = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<IBrandConfig>,
    TError,
    IUpdateBrandSettingsPayload
  >({
    mutationFn: updateBrandSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRAND_SETTINGS] });
    },
  });
};

export const useUpdateConfiguredDomains = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<{ configured_domains: IConfiguredDomains }>,
    TError,
    IUpdateConfiguredDomainsPayload
  >({
    mutationFn: updateConfiguredDomains,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONFIGURED_DOMAINS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DOMAIN_VERIFICATION],
      });
    },
  });
};

export const useInitiateDomainVerification = () => {
  return useMutation<
    IApiResponse<{
      txt_host: string;
      txt_value: string;
      ttl: number;
      already_verified: boolean;
    }>,
    TError,
    string
  >({
    mutationFn: initiateDomainVerification,
  });
};

export const useCheckDomainVerification = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<{
      status: string;
      verified_at: string | null;
      last_checked_at: string | null;
    }>,
    TError,
    string
  >({
    mutationFn: checkDomainVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DOMAIN_VERIFICATION],
      });
    },
  });
};
