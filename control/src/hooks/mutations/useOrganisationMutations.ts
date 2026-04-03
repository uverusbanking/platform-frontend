import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TError, IApiResponse } from "@/types/apiResponse.type";
import {
  IGenerateApiKeyResponse,
  ICreateApiKeyPayload,
} from "@/types/organisation.types";
import {
  addOrganisationUser,
  updateOrganisationUser,
  deleteOrganisationUser,
  createApiKey,
  deleteApiKey,
  updateOrganisationDocumentStatus,
  IUpdateDocumentStatusPayload,
} from "@/hooks/endpoints/useOrganisation";
import { IAddOrganisationUserPayload } from "@/types/organisation.types";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useAddOrganisationUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<unknown>,
    TError,
    IAddOrganisationUserPayload & { organisationId: string }
  >({
    mutationFn: addOrganisationUser,
    onSuccess: () => {
      // Invalidate all related queries for automatic reload
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.GET_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.STATS],
      });
    },
  });
};

export const useUpdateOrganisationUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<unknown>,
    TError,
    Partial<IAddOrganisationUserPayload> & { userId: string }
  >({
    mutationFn: updateOrganisationUser,
    onSuccess: () => {
      // Invalidate all related queries for automatic reload
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.GET_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.STATS],
      });
    },
  });
};

export const useDeleteOrganisationUser = () => {
  const queryClient = useQueryClient();

  return useMutation<IApiResponse<unknown>, TError, string>({
    mutationFn: deleteOrganisationUser,
    onSuccess: () => {
      // Invalidate all related queries for automatic reload
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.GET_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.STATS],
      });
    },
  });
};

export const useAddApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<IGenerateApiKeyResponse>,
    TError,
    ICreateApiKeyPayload
  >({
    mutationFn: createApiKey,
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORGANISATION.API_KEYS],
        });
      }
    },
  });
};

export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<unknown>,
    TError,
    { id: string; environment: "LIVE" | "SANDBOX" }
  >({
    mutationFn: deleteApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.API_KEYS],
      });
    },
  });
};

export const useUpdateOrganisationDocumentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<unknown>,
    TError,
    IUpdateDocumentStatusPayload
  >({
    mutationFn: updateOrganisationDocumentStatus,
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
    },
  });
};
