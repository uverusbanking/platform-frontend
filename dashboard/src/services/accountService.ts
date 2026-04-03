import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import { IUser } from "@/types/user.types";

export interface IUpdateProfilePayload {
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone_number: string;
  gender: string;
}

export interface IChangePasswordPayload {
  old_password: string;
  new_password: string;
}

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

export const updateViewMode = async (
  environment: "LIVE" | "SANDBOX",
): Promise<IApiResponse<IUser>> => {
  const response = await apiClient.patch("/account/view-mode", { environment });
  return response.data;
};
