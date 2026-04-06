import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TransferService } from "@/services";
import type { ResolveAccountDto, InitiateTransferDto } from "@/types";

export const useResolveAccount = () => {
  return useMutation({
    mutationFn: (data: ResolveAccountDto) =>
      TransferService.resolveAccount(data),
  });
};

export const useInitiateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InitiateTransferDto) =>
      TransferService.initiateTransfer(data),
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
