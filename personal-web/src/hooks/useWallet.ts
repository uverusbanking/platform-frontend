import { useQuery } from "@tanstack/react-query";
import { WalletService } from "@/services/wallet.service";

export const useWallet = () => {
  const walletQuery = useQuery({
    queryKey: ["wallet"],
    queryFn: () => WalletService.getWallet(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const virtualAccountQuery = useQuery({
    queryKey: ["virtual-account"],
    queryFn: () => WalletService.getVirtualAccount(),
  });

  return {
    wallet: walletQuery.data,
    isLoadingWallet: walletQuery.isLoading,
    walletError: walletQuery.error,
    refetchWallet: walletQuery.refetch,

    virtualAccount: virtualAccountQuery.data?.data,
    isLoadingVirtualAccount: virtualAccountQuery.isLoading,
    virtualAccountError: virtualAccountQuery.error,
  };
};
