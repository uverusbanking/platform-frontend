/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { TError, IApiResponse } from "@/types/apiResponse.type";
import {
  getPlatformUsers,
  getPlatformUser,
} from "@/hooks/endpoints/usePlatformUser";
import {
  IGetPlatformUsersParams,
  IGetPlatformUsersResponse,
} from "@/types/platformUser.types";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { IUser } from "@/types/user.types";

export const useGetPlatformUsers = (params: IGetPlatformUsersParams) => {
  return useQuery<IApiResponse<any>, TError, IGetPlatformUsersResponse>({
    queryKey: [QUERY_KEYS.PLATFORM.USERS, params],
    queryFn: () => getPlatformUsers(params),
    select: (res) => res.data,
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
  });
};

export const useGetPlatformUser = (id?: string) => {
  return useQuery<IApiResponse<IUser>, TError>({
    queryKey: [QUERY_KEYS.PLATFORM.USERS, id],
    queryFn: () => getPlatformUser(id!),
    enabled: !!id,
  });
};
