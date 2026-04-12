import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services";

export const useUserProfile = (options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await UserService.getProfile();
      return response.data;
    },
    ...options,
  });
};

export const useKycStatus = () => {
  return useQuery({
    queryKey: ["user", "kyc-status"],
    queryFn: async () => {
      const response = await UserService.getKycStatus();
      return response.data;
    },
  });
};
