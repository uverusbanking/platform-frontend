import { useQuery } from "@tanstack/react-query";
import { TransactionService } from "@/services";

export const useTransactions = ({page, limit}: {page: number, limit: number}) => {
  return useQuery({
    queryKey: ["transactions", page, limit],
    queryFn: () => TransactionService.getTransactions({page, limit}),
  });
};

export const useTransactionDetails = (id: string) => {
  return useQuery({
    queryKey: ["transactions", id],
    queryFn: () => TransactionService.getTransactionDetails(id),
    enabled: !!id,
  });
};
