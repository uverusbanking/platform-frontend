import {
  IUpdateProfilePayload,
  IChangePasswordPayload,
} from "@/types/userAccount.types";

import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import { IUser } from "@/types/user.types";

export const updateProfile = async (
  payload: IUpdateProfilePayload,
): Promise<IApiResponse<IUser>> => {
  const response = await apiClient.patch("/account/profile", payload);
  return response.data;
};

export const changePassword = async (
  payload: IChangePasswordPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.put("/account/change-password", payload);
  return response.data;
};
