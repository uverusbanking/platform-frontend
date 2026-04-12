import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TransferService } from "@/services";
import type { ResolveAccountDto, InitiateTransferDto } from "@/types";

export const useResolveAccount = () => {
  return useMutation({
    mutationFn: async (data: ResolveAccountDto) => {
      const response = await TransferService.resolveAccount(data);
      return response.data;
    },
  });
};

export const useInitiateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InitiateTransferDto) => {
      const response = await TransferService.initiateTransfer(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate wallet and transaction queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({
        queryKey: ["transfers", "transactions"],
      });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
