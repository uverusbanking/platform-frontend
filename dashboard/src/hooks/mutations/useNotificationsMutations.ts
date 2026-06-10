import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../endpoints/useNotifications";

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to mark notification as read",
      );
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to mark all notifications as read",
      );
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete notification",
      );
    },
  });
};
