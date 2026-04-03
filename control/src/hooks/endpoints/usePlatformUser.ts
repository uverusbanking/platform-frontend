/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponse.type";
import { IUser } from "@/types/user.types";
import {
  IGetPlatformUsersParams,
  IGetPlatformUsersResponse,
  ICreatePlatformUserPayload,
  IUpdatePlatformUserPayload,
} from "@/types/platformUser.types";

export const getPlatformUsers = async (
  params: IGetPlatformUsersParams,
): Promise<any> => {
  // Filter out 'all' role before sending to API if the API doesn't support it
  const apiParams = { ...params };
  if (apiParams.role === "all") {
    delete apiParams.role;
  }

  const response = await apiClient.get<IApiResponse<IGetPlatformUsersResponse>>(
    "/platform-user",
    { params: apiParams },
  );
  return response;
};

export const getPlatformUser = async (
  id: string,
): Promise<IApiResponse<IUser>> => {
  const response = await apiClient.get<IApiResponse<IUser>>(
    `/platform-user/${id}`,
  );
  return response.data;
};

export const createPlatformUser = async (
  payload: ICreatePlatformUserPayload,
): Promise<IApiResponse<IUser>> => {
  const response = await apiClient.post<IApiResponse<IUser>>(
    "/platform-user/",
    payload,
  );
  return response.data;
};

export const updatePlatformUser = async (
  payload: IUpdatePlatformUserPayload,
): Promise<IApiResponse<IUser>> => {
  const { userId, ...data } = payload;
  const response = await apiClient.patch<IApiResponse<IUser>>(
    `/platform-user/${userId}`,
    data,
  );
  return response.data;
};

export const deletePlatformUser = async (
  id: string,
): Promise<IApiResponse<{ message: string }>> => {
  const response = await apiClient.delete<IApiResponse<{ message: string }>>(
    `/platform-user/${id}`,
  );
  return response.data;
};
