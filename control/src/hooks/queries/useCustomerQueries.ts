import {
  getCustomer,
  getCustomers,
  getCustomerStats,
} from "@/hooks/endpoints/useCustomer";
import { ICustomerStats, IGetCustomersParams } from "@/types/customer.types";
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
