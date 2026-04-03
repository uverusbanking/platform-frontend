import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registerOrganisation,
  checkOrganisationExists,
  updateOrganisation,
  updateOrganisationDocuments,
} from "@/hooks/endpoints/useOrganisation";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useRegisterOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerOrganisation,
    onSuccess: () => {
      // Invalidate all related queries for automatic reload
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PLATFORM.ORGANISATIONS],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLATFORM.STATS] });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLATFORM.STATS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.STATISTICS],
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLATFORM.STATS] });
    },
  });
};
