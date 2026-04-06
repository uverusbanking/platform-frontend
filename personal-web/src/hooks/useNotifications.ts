import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Mock notifications
      // In production, this should call a dedicated notifications endpoint
      const mockNotifications: Notification[] = [
        {
          id: "1",
          user_id: user.id,
          title: "Welcome to UverusPay",
          message: "Thank you for signing up!",
          type: "system",
          is_read: false,
          metadata: {},
          created_at: new Date().toISOString(),
        },
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Mock mark as read
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      // Mock mark all as read
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const refreshNotifications = () => {
    fetchNotifications();
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };
};
