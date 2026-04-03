import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateViewMode } from "@/hooks/endpoints/useAccount";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { useUserStore } from "@/state/userStore";
import { IApiResponse, TError } from "@/types/apiResponse.type";
import { IUser } from "@/types/user.types";

export const useUpdateViewMode = () => {
  const queryClient = useQueryClient();
  const _updateUser = useUserStore((state) => state._updateUser);

  return useMutation<IApiResponse<IUser>, TError, "LIVE" | "SANDBOX">({
    mutationFn: updateViewMode,
    onSuccess: (response) => {
      if (response.status && response.data) {
        _updateUser(response.data);
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.PROFILE] });
    },
  });
};
