import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { IApiResponse, TError } from "@/types/apiResponse.type";
import {
  IGetPlatformTransactionFilters,
  IGetTransactionsResponse,
  ITransaction,
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

const getPlatformTransactionDetail = async (
  transactionId: string,
): Promise<IApiResponse<ITransaction>> => {
  const response = await apiClient.get(
    `/transactions/platform/${transactionId}`,
  );
  return response.data;
};

export const useGetTransactionDetail = (transactionId: string) => {
  return useQuery<IApiResponse<ITransaction>, TError>({
    queryKey: [QUERY_KEYS.TRANSACTION.GET_DETAIL, transactionId],
    queryFn: () => getPlatformTransactionDetail(transactionId),
    enabled: !!transactionId,
  });
};
