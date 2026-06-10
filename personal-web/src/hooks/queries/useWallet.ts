import { useQuery } from "@tanstack/react-query";
import { WalletService } from "@/services";

export const useWalletBalance = () => {
  return useQuery({
    queryKey: ["wallet", "balance"],
    queryFn: () => WalletService.getWallet(),
  });
};

export const useVirtualAccount = () => {
  return useQuery({
    queryKey: ["wallet", "virtual-account"],
    queryFn: () => WalletService.getVirtualAccount(),
  });
};
