import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPlatformUser,
  updatePlatformUser,
  deletePlatformUser,
} from "@/hooks/endpoints/usePlatformUser";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useCreatePlatformUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlatformUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLATFORM.USERS] });
    },
  });
};

export const useUpdatePlatformUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlatformUser,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLATFORM.USERS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PLATFORM.USERS, variables.userId],
      });
    },
  });
};

export const useDeletePlatformUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlatformUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLATFORM.USERS] });
    },
  });
};
