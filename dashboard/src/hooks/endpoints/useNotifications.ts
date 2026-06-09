import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import { INotification } from "@/types/notification.types";

export const getNotifications = async (): Promise<
  IApiResponse<INotification[]>
> => {
  const response = await apiClient.get("/organisation/notifications");
  return response.data;
};

export const markNotificationAsRead = async (
  id: string,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.patch(
    `/organisation/notifications/${id}/read`,
  );
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<
  IApiResponse<unknown>
> => {
  const response = await apiClient.patch(
    "/organisation/notifications/mark-all-read",
  );
  return response.data;
};

export const deleteNotification = async (
  id: string,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.delete(`/organisation/notifications/${id}`);
  return response.data;
};
