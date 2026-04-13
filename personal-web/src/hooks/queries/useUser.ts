import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services";

export const useUserProfile = (options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await UserService.getProfile();
      const data = response.data;
      return {
        ...data,
        firstName: data.first_name || data.firstName,
        lastName: data.last_name || data.lastName,
      };
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
