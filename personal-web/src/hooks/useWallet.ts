import { useQuery } from "@tanstack/react-query";
import { WalletService } from "@/services/wallet.service";

export const useWallet = () => {
  const walletQuery = useQuery({
    queryKey: ["wallet"],
    queryFn: () => WalletService.getWallet(),
  });

  const virtualAccountQuery = useQuery({
    queryKey: ["virtual-account"],
    queryFn: () => WalletService.getVirtualAccount(),
  });

  return {
    wallets: walletQuery.data?.data || [],
    wallet: walletQuery.data?.data?.[0],
    isLoadingWallet: walletQuery.isLoading,
    walletError: walletQuery.error,
    refetchWallet: walletQuery.refetch,

    virtualAccount: virtualAccountQuery.data?.data,
    isLoadingVirtualAccount: virtualAccountQuery.isLoading,
    virtualAccountError: virtualAccountQuery.error,
  };
};
