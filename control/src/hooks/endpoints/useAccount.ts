import { IApiResponse, TError } from "@/types/apiResponse.type";
import apiClient from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/state/userStore";
import { IUser } from "@/types/user.types";
import { Gender } from "@/types/enums";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { IUpdateProfilePayload } from "@/types/user.types";

const updateProfile = async (
  payload: IUpdateProfilePayload,
): Promise<IApiResponse<IUser>> => {
  const response = await apiClient.patch("/account/profile", payload);
  return response.data;
};

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
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.USER.PROFILE] });

      // Snapshot the previous value
      const previousUser = { ...userData } as IUser;

      // Optimistically update to the new value
      _updateUser({
        ...userData,
        ...newProfile,
        gender: newProfile.gender as Gender,
      });

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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.PROFILE] });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === QUERY_KEYS.PLATFORM.USERS,
      });
    },
  });
};

export const updateViewMode = async (
  environment: "LIVE" | "SANDBOX",
): Promise<IApiResponse<IUser>> => {
  const response = await apiClient.patch("/account/view-mode", { environment });
  return response.data;
};
