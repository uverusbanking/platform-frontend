import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { TError } from "@/types/apiResponse.type";
import {
  IGetPlatformTransactionFilters,
  IGetTransactionsResponse,
} from "@/types/transaction.types";

const getPlatformCustomerTransactions = async (
  customerId: string,
  filters: IGetPlatformTransactionFilters,
): Promise<IGetTransactionsResponse> => {
  const response = await apiClient.get(
    `/transactions/platform/customers/${customerId}`,
    { params: filters },
  );
  return response.data;
};

export const useGetPlatformCustomerTransactions = (
  customerId: string,
  filters: IGetPlatformTransactionFilters = {},
) => {
  return useQuery<IGetTransactionsResponse, TError>({
    queryKey: [QUERY_KEYS.TRANSACTION.PLATFORM_LIST, customerId, filters],
    queryFn: () => getPlatformCustomerTransactions(customerId, filters),
    enabled: !!customerId,
  });
};
