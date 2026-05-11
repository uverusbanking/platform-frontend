import { useQuery } from "@tanstack/react-query";
import { TransferService } from "@/services";
import { PaginationParams } from "@/types";

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

export const useRecentBeneficiaries = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["transfers", "beneficiaries", "recent", params],
    queryFn: () => TransferService.getRecentBeneficiaries(params),
  });
};

export const useSavedBeneficiaries = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["transfers", "beneficiaries", "saved", params],
    queryFn: () => TransferService.getSavedBeneficiaries(params),
  });
};
