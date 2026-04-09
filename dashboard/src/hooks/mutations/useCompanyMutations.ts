import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { IApiResponse, TError } from "@/types/apiResponseType";
import {
  addBrandUser,
  updateBrandUser,
  deleteBrandUser,
  createApiKey,
  deleteApiKey,
} from "@/hooks/endpoints/useCompany";
import {
  IAddBrandUserPayload,
  ICreateApiKeyPayload,
  IGenerateApiKeyResponse,
} from "@/types/company.types";

export const useAddBrandUser = () => {
  const queryClient = useQueryClient();
  return useMutation<IApiResponse<unknown>, TError, IAddBrandUserPayload>({
    mutationFn: addBrandUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANY_USERS] });
    },
  });
};

export const useUpdateBrandUser = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<unknown>,
    TError,
    Partial<IAddBrandUserPayload> & { userId: string }
  >({
    mutationFn: updateBrandUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANY_USERS] });
    },
  });
};

export const useDeleteBrandUser = () => {
  const queryClient = useQueryClient();
  return useMutation<IApiResponse<unknown>, TError, string>({
    mutationFn: deleteBrandUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANY_USERS] });
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
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.API_KEYS] });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.API_KEYS] });
    },
  });
};
