import { useQuery } from "@tanstack/react-query";
import { TransferService } from "@/services";

export const useBanks = () => {
  return useQuery({
    queryKey: ["transfers", "banks"],
    queryFn: TransferService.getBanks,
  });
};

export const useTransferTransactions = (
  page: number = 1,
  limit: number = 20,
) => {
  return useQuery({
    queryKey: ["transfers", "transactions", page, limit],
    queryFn: () => TransferService.getTransactions(page, limit),
  });
};

export const useTransferTransactionDetails = (transactionId: string) => {
  return useQuery({
    queryKey: ["transfers", "transactions", transactionId],
    queryFn: () => TransferService.getTransactionDetails(transactionId),
    enabled: !!transactionId,
  });
};
