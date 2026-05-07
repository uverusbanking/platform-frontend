import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registerOrganisation,
  checkOrganisationExists,
  updateOrganisation,
  updateOrganisationDocuments,
  updateBrandSettings,
  updateConfiguredDomains,
  approveOrgKYB,
} from "@/hooks/endpoints/useOrganisation";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useRegisterOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerOrganisation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.GET_ALL],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.STATISTICS],
      });
    },
  });
};

export const useCheckOrganisationExists = () => {
  return useMutation({
    mutationFn: checkOrganisationExists,
  });
};

export const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrganisation,
    onSuccess: () => {
      // Invalidate all related queries for automatic reload
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.GET_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PLATFORM.ORGANISATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.STATS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.STATISTICS],
      });
    },
  });
};

export const useUpdateBrandSettings = () => {
  return useMutation({ mutationFn: updateBrandSettings });
};

export const useUpdateConfiguredDomains = () => {
  return useMutation({ mutationFn: updateConfiguredDomains });
};

export const useApproveOrgKYB = (organisationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => approveOrgKYB(organisationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.GO_LIVE_CHECKLIST, organisationId],
      });
    },
  });
};

export const useUpdateOrganisationDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrganisationDocuments,
    onSuccess: () => {
      // Invalidate all related queries for automatic reload
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.DOCUMENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.GET_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.STATS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.STATISTICS],
      });
    },
  });
};
