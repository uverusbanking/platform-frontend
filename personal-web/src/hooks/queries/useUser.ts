import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services";

export const useUserProfile = (options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: UserService.getProfile,
    ...options,
  });
};

export const useKycStatus = () => {
  return useQuery({
    queryKey: ["user", "kyc-status"],
    queryFn: UserService.getKycStatus,
  });
};
