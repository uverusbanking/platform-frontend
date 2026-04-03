import { IApiResponse, TError } from "@/types/apiResponseType";
import {
  IApiKey,
  ICreateApiKeyPayload,
  IGenerateApiKeyResponse,
} from "@/types/company.types";
// IUser import removed
import {
  getCompanyUsers,
  addBrandUser,
  updateBrandUser,
  deleteBrandUser,
  getApiKeys,
  createApiKey,
  deleteApiKey,
  IAddBrandUserPayload,
  IGetCompanyUsersParams,
} from "@/services/companyService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";

import { IUser } from "@/types/user.types";

export { type IAddBrandUserPayload, type IGetCompanyUsersParams };

export const useGetCompanyUsers = (params: IGetCompanyUsersParams = {}) => {
  return useQuery<IApiResponse<IUser[]>, TError>({
    queryKey: [QUERY_KEYS.COMPANY_USERS, params],
    queryFn: () => getCompanyUsers(params),
    staleTime: 1000 * 60 * 10, // 10 minutes for staff list
  });
};

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

export const useGetApiKeys = (environment: "LIVE" | "SANDBOX") => {
  return useQuery<IApiResponse<IApiKey[]>, TError>({
    queryKey: [QUERY_KEYS.API_KEYS, environment],
    queryFn: () => getApiKeys(environment),
    staleTime: 1000 * 60 * 30, // 30 minutes for API keys as they change rarely
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
