import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services";
import type { UpdateProfileDto } from "@/types";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileDto) => UserService.updateProfile(data),
    onSuccess: () => {
      // Invalidate user profile query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
};
