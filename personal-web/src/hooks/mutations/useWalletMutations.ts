import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WalletService } from "@/services";

export const useCreateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => WalletService.createWallet(),
    onSuccess: () => {
      // Invalidate wallet queries to refetch new wallet data
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
};
