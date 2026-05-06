import {
  getCustomer,
  getCustomers,
  getCustomerStats,
  getCustomerActivity,
  getCustomerActivityDetail,
} from "@/hooks/endpoints/useCustomer";
import { ICustomerStats, IGetCustomersParams } from "@/types/customer.types";
import { ICustomerActivityResponse, IGetCustomerActivityFilters } from "@/types/activity.types";
import { IApiResponse, TError } from "@/types/apiResponse.type";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomerStats = () => {
  return useQuery<IApiResponse<ICustomerStats>, TError>({
    queryKey: [QUERY_KEYS.CUSTOMER.STATS],
    queryFn: getCustomerStats,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useGetCustomers = (params: IGetCustomersParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER.GET_ALL, params],
    queryFn: () => getCustomers(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useGetCustomerById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER.GET_BY_ID, id],
    queryFn: () => getCustomer(id),
    enabled: !!id,
  });
};

export const useGetCustomerActivity = (id: string, filters: IGetCustomerActivityFilters) => {
  return useQuery<ICustomerActivityResponse, TError>({
    queryKey: [QUERY_KEYS.CUSTOMER.ACTIVITY, id, filters],
    queryFn: () => getCustomerActivity(id, filters),
    enabled: !!id,
  });
};

export const useGetCustomerActivityDetail = (id: string, activityId: string) => {
  return useQuery<IApiResponse<any>, TError>({
    queryKey: [QUERY_KEYS.CUSTOMER.ACTIVITY, id, "detail", activityId],
    queryFn: () => getCustomerActivityDetail(id, activityId),
    enabled: !!id && !!activityId,
  });
};
