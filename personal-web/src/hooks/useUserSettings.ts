import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface UserSettings {
  id: string;
  user_id: string;
  two_factor_enabled: boolean;
  biometric_enabled: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  transaction_alerts: boolean;
  login_alerts: boolean;
  daily_limit_alerts: boolean;
  auto_limit_management: boolean;
  profile_visibility: string;
  preferred_language: string;
  timezone: string;
}

export const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      // Mock Data
      setSettings({
        id: "mock-settings-id",
        user_id: user.id,
        two_factor_enabled: false,
        biometric_enabled: false,
        email_notifications: true,
        sms_notifications: true,
        push_notifications: true,
        transaction_alerts: true,
        login_alerts: true,
        daily_limit_alerts: true,
        auto_limit_management: false,
        profile_visibility: "private",
        preferred_language: "en",
        timezone: "UTC",
      });
    } catch (err) {
      console.error("Error in fetchSettings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (
    updates: Partial<UserSettings>,
  ): Promise<boolean> => {
    if (!user || !settings) return false;

    setSaving(true);
    try {
      // Mock Update
      setSettings((prev) => (prev ? { ...prev, ...updates } : null));
      toast.success("Settings updated");
      return true;
    } catch (err) {
      console.error("Error in updateSettings:", err);
      toast.error("An error occurred");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = async (key: keyof UserSettings): Promise<boolean> => {
    if (!settings) return false;
    const currentValue = settings[key];
    if (typeof currentValue !== "boolean") return false;
    return updateSettings({ [key]: !currentValue });
  };

  return {
    settings,
    loading,
    saving,
    updateSettings,
    toggleSetting,
    refetch: fetchSettings,
  };
};
