"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useUserStore } from "@/state/userStore";
import { InactivityModal } from "@/components/ui/InactivityModal";
import { subscribeToLogoutEvent } from "@/lib/authSync";

// --- Configuration ---
// Total timeout in milliseconds (5 minutes)
const INACTIVITY_TIMEOUT_MS =
  Number(import.meta.env.VITE_INACTIVITY_LIMIT) || 300000;
// Warning duration in milliseconds (30 seconds)
const WARNING_DURATION_MS =
  Number(import.meta.env.VITE_WARNING_DURATION) || 30000;
// When to show the modal (Total - Warning)
const WARNING_THRESHOLD_MS = INACTIVITY_TIMEOUT_MS - WARNING_DURATION_MS;

// Message types for BroadcastChannel
type ChannelMessage = { type: "ACTIVITY_DETECTED" };

interface InactivityContextType {
  resetTimer: () => void;
}

const InactivityContext = createContext<InactivityContextType | undefined>(
  undefined,
);

export function useInactivity() {
  const context = useContext(InactivityContext);
  if (!context) {
    throw new Error("useInactivity must be used within an InactivityProvider");
  }
  return context;
}

export function InactivityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const _logOutUser = useUserStore((state) => state._logOutUser);
  const _clearUserSessionLocally = useUserStore(
    (state) => state._clearUserSessionLocally,
  );
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(
    WARNING_DURATION_MS / 1000,
  );

  // Refs to hold mutable state without triggering re-renders for every tick
  const lastActivityRef = useRef<number>(0);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Initialize timer on mount
  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Reset timer when user logs in to prevent immediate logout
  useEffect(() => {
    if (isLoggedIn) {
      lastActivityRef.current = Date.now();
    }
  }, [isLoggedIn]);

  // --- Core Logout Logic ---
  const performLogout = useCallback(() => {
    // Prevent duplicate logout calls if already logged out or in process
    if (useUserStore.getState().isLoggedIn) {
      _logOutUser();
      setIsWarningModalOpen(false);
      // router.push("/auth/login"); // Or your login route
    }
  }, [_logOutUser]);

  // --- Reset Timer Logic ---
  const resetTimer = useCallback(
    (broadcast = true) => {
      lastActivityRef.current = Date.now();

      // If modal was open, close it
      if (isWarningModalOpen) {
        setIsWarningModalOpen(false);
      }

      if (broadcast && channelRef.current) {
        channelRef.current.postMessage({ type: "ACTIVITY_DETECTED" });
      }
    },
    [isWarningModalOpen],
  );

  // --- BroadcastChannel Setup ---
  useEffect(() => {
    // Only set up if we are in a browser environment
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel("inactivity_auth_channel");
      channelRef.current = channel;

      channel.onmessage = (event: MessageEvent<ChannelMessage>) => {
        if (event.data.type === "ACTIVITY_DETECTED") {
          // Another tab detected activity, reset our local timer silently (no re-broadcast)
          resetTimer(false);
        }
      };

      return () => {
        channel.close();
        channelRef.current = null;
      };
    }
  }, [resetTimer]);

  useEffect(() => {
    return subscribeToLogoutEvent(() => {
      setIsWarningModalOpen(false);
      _clearUserSessionLocally();
    });
  }, [_clearUserSessionLocally]);

  // --- Global Event Listeners ---
  useEffect(() => {
    if (!isLoggedIn) return; // Only track activity when logged in

    const handleActivity = () => {
      // Simple throttle: only reset if > 1 sec has passed to avoid spam
      if (Date.now() - lastActivityRef.current > 1000) {
        resetTimer(true);
      }
    };

    // Events to track
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    // Add listeners to window
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isLoggedIn, resetTimer]);

  // --- Timer Loop ---
  useEffect(() => {
    if (!isLoggedIn) return;

    const intervalId = setInterval(() => {
      // Skip if not initialized yet
      if (lastActivityRef.current === 0) return;

      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      // 1. Check for Logout
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT_MS) {
        // Time is up!
        performLogout();
        clearInterval(intervalId); // Stop timer
        return;
      }

      // 2. Check for Warning
      if (timeSinceLastActivity >= WARNING_THRESHOLD_MS) {
        if (!isWarningModalOpen) {
          setIsWarningModalOpen(true);
        }

        // Update countdown
        const remaining = Math.ceil(
          (INACTIVITY_TIMEOUT_MS - timeSinceLastActivity) / 1000,
        );
        setRemainingTime(remaining > 0 ? remaining : 0);
      } else {
        // If we backed off from threshold (e.g. activity detected), ensure modal closed
        if (isWarningModalOpen) {
          setIsWarningModalOpen(false);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isLoggedIn, isWarningModalOpen, performLogout]);

  // Only render context provider and modal if user is logged in (conceptually).
  // Though `isLoggedIn` check inside effects handles logic, keeping provider mounted is fine.

  return (
    <InactivityContext.Provider value={{ resetTimer }}>
      {children}
      {isLoggedIn && (
        <InactivityModal
          isOpen={isWarningModalOpen}
          remainingTime={remainingTime}
          onStayLoggedIn={() => resetTimer(true)}
          onLogout={performLogout}
        />
      )}
    </InactivityContext.Provider>
  );
}
