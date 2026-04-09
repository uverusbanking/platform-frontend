import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { getCustomers, getCustomer } from "../endpoints/useCustomer";
import { IGetCustomersParams } from "@/types/customer.types";

export const useGetCustomers = (params: IGetCustomersParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS, params],
    queryFn: () => getCustomers(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useGetCustomerById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER, id],
    queryFn: () => getCustomer(id),
    enabled: !!id,
  });
};
