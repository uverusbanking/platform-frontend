import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WalletService } from "@/services";
import type { CreateWalletDto } from "@/types";

export const useCreateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWalletDto) => WalletService.createWallet(data),
    onSuccess: () => {
      // Invalidate wallet queries to refetch new wallet data
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
};
