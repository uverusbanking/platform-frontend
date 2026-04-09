import { IApiResponse, TError } from "@/types/apiResponseType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/state/userStore";
import { IUser } from "@/types/user.types";
import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  IUpdateProfilePayload,
  IChangePasswordPayload,
} from "@/types/userAccount.types";
import {
  updateProfile,
  changePassword,
  updateViewMode,
} from "@/hooks/endpoints/useAccount";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { userData, _updateUser } = useUserStore();

  return useMutation<
    IApiResponse<IUser>,
    TError,
    IUpdateProfilePayload,
    { previousUser: IUser }
  >({
    mutationFn: updateProfile,
    onMutate: async (newProfile) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.USER_PROFILE] });

      // Snapshot the previous value
      const previousUser = { ...userData } as IUser;

      // Optimistically update to the new value
      _updateUser({ ...userData, ...newProfile });

      // Return a context object with the snapshotted value
      return { previousUser };
    },
    onError: (err, newProfile, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousUser) {
        _updateUser(context.previousUser);
      }
    },
    onSuccess: (response) => {
      if (response.status && response.data) {
        _updateUser(response.data);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data from the server
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_PROFILE] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation<IApiResponse<unknown>, TError, IChangePasswordPayload>({
    mutationFn: changePassword,
  });
};

export const useUpdateViewMode = () => {
  const queryClient = useQueryClient();
  const _updateUser = useUserStore((state) => state._updateUser);

  return useMutation<IApiResponse<IUser>, TError, "LIVE" | "SANDBOX">({
    mutationFn: updateViewMode,
    onSuccess: (response) => {
      if (response.status && response.data) {
        _updateUser(response.data);
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_PROFILE] });
    },
  });
};
