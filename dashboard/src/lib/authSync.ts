export const AUTH_SYNC_CHANNEL_NAME = "auth_session_channel";
export const AUTH_SYNC_STORAGE_KEY = "__auth_session_event__";
export const AUTH_SYNC_TAB_ID_STORAGE_KEY = "__auth_session_tab_id__";

type LogoutSyncMessage = {
  type: "LOGOUT";
  sourceTabId: string;
  timestamp: number;
};

const createTabId = () => {
  if (typeof window === "undefined") {
    return "server";
  }

  const existingTabId = sessionStorage.getItem(AUTH_SYNC_TAB_ID_STORAGE_KEY);
  if (existingTabId) {
    return existingTabId;
  }

  const nextTabId =
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  sessionStorage.setItem(AUTH_SYNC_TAB_ID_STORAGE_KEY, nextTabId);
  return nextTabId;
};

const isLogoutSyncMessage = (value: unknown): value is LogoutSyncMessage => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Partial<LogoutSyncMessage>;

  return (
    message.type === "LOGOUT" &&
    typeof message.sourceTabId === "string" &&
    typeof message.timestamp === "number"
  );
};

const createLogoutSyncMessage = (): LogoutSyncMessage => ({
  type: "LOGOUT",
  sourceTabId: createTabId(),
  timestamp: Date.now(),
});

export const broadcastLogoutEvent = () => {
  if (typeof window === "undefined") {
    return;
  }

  const message = createLogoutSyncMessage();

  if ("BroadcastChannel" in window) {
    try {
      const channel = new BroadcastChannel(AUTH_SYNC_CHANNEL_NAME);
      channel.postMessage(message);
      channel.close();
    } catch {
      // Fall back to storage-event-based sync if BroadcastChannel is unavailable.
    }
  }

  try {
    localStorage.setItem(AUTH_SYNC_STORAGE_KEY, JSON.stringify(message));
  } catch {
    // Ignore storage write failures; local tab logout should still proceed.
  }
};

export const subscribeToLogoutEvent = (onLogout: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const currentTabId = createTabId();
  let channel: BroadcastChannel | null = null;

  const handleLogoutMessage = (value: unknown) => {
    if (!isLogoutSyncMessage(value) || value.sourceTabId === currentTabId) {
      return;
    }

    onLogout();
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== AUTH_SYNC_STORAGE_KEY || !event.newValue) {
      return;
    }

    try {
      handleLogoutMessage(JSON.parse(event.newValue));
    } catch {
      // Ignore malformed storage payloads.
    }
  };

  if ("BroadcastChannel" in window) {
    try {
      channel = new BroadcastChannel(AUTH_SYNC_CHANNEL_NAME);
      channel.onmessage = (event) => {
        handleLogoutMessage(event.data);
      };
    } catch {
      channel = null;
    }
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    channel?.close();
    window.removeEventListener("storage", handleStorage);
  };
};
