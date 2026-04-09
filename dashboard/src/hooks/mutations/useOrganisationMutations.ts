import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IApiResponse, TError } from "@/types/apiResponseType";
import {
  IOrganisation,
  IUpdateOrganisationPayload,
  IOrganisationDocument,
  IUpdateDocumentsPayload,
} from "@/types/organisation.types";
import {
  updateOrganisation,
  updateOrganisationDocuments,
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
