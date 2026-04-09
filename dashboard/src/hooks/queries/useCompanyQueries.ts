import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { IApiResponse, TError } from "@/types/apiResponseType";
import { IGetCompanyUsersParams, IApiKey } from "@/types/company.types";
import { IUser } from "@/types/user.types";
import { getApiKeys, getCompanyUsers } from "@/hooks/endpoints/useCompany";

export const useGetCompanyUsers = (params: IGetCompanyUsersParams = {}) => {
  return useQuery<IApiResponse<IUser[]>, TError>({
    queryKey: [QUERY_KEYS.COMPANY_USERS, params],
    queryFn: () => getCompanyUsers(params),
    staleTime: 1000 * 60 * 10, // 10 minutes for staff list
  });
};

export const useGetApiKeys = (environment: "LIVE" | "SANDBOX") => {
  return useQuery<IApiResponse<IApiKey[]>, TError>({
    queryKey: [QUERY_KEYS.API_KEYS, environment],
    queryFn: () => getApiKeys(environment),
    staleTime: 1000 * 60 * 30, // 30 minutes for API keys as they change rarely
  });
};
