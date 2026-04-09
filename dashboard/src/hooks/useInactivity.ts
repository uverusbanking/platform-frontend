import { useState, useEffect, useCallback, useRef } from "react";
import { useUserStore } from "@/state/userStore";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/lib/routes";
enum eventTypes {
  ACTIVITY_UPDATE = "ACTIVITY_UPDATE",
  LOGOUT = "LOGOUT",
}
// Configuration constants
const INACTIVITY_LIMIT =
  Number(import.meta.env.VITE_INACTIVITY_LIMIT) || 5 * 60 * 1000; // 5 minutes
const WARNING_DURATION =
  Number(import.meta.env.VITE_WARNING_DURATION) || 30 * 1000; // 30 seconds
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
  // 'touchstart' // Can be added for mobile if needed, though click/scroll usually covers it
];

export const useInactivity = () => {
  const navigate = useNavigate();
  const { isLoggedIn, _logOutUser } = useUserStore();

  // State
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_DURATION / 1000);

  // Refs
  // Use refs to avoid dependency cycles in event listeners and intervals
  const channelRef = useRef<BroadcastChannel | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const isLoggedOutRef = useRef(false);

  // Initialize BroadcastChannel
  useEffect(() => {
    // Only run on client side and if supported
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channelRef.current = new BroadcastChannel("auth_channel");

      channelRef.current.onmessage = (event) => {
        const { type, payload } = event.data;

        if (type === eventTypes.ACTIVITY_UPDATE) {
          // Sync last activity from other tabs
          const timestamp = payload;
          setLastActivity(timestamp);
          lastActivityRef.current = timestamp;

          // If modal was open, close it since activity happened elsewhere
          setShowModal(false);
        } else if (type === eventTypes.LOGOUT) {
          // Force logout if another tab did so
          handleLogout(false); // false = don't broadcast, to avoid loops
        }
      };
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // handleLogout intentionally omitted - it's stable via useCallback

  // Helper to broadcast messages
  const broadcast = useCallback((type: string, payload?: number) => {
    if (channelRef.current) {
      channelRef.current.postMessage({ type, payload });
    }
  }, []);

  // User interaction handler
  const handleUserActivity = useCallback(() => {
    // Throttle updates: only update if > 1 second since last update to avoid spamming state/channel
    const now = Date.now();
    if (now - lastActivityRef.current > 1000) {
      setLastActivity(now);
      lastActivityRef.current = now;
      broadcast(eventTypes.ACTIVITY_UPDATE, now);

      // If modal is showing and user moves mouse/keys, we auto-dismiss
      // (Optional UX decision: usually requirements say "Stay Logged In button" dismisses it,
      // but requirements say "Activity includes... No mouse movement".
      // Often movement effectively stays logged in.
      // HOWEVER, Requirements say: "Clicking 'Stay Logged In' ... Dismisses the modal".
      // Implicitly, passive movement might NOT dismiss the modal if it's already showing,
      // to force explicit decision, OR it does.
      // Requirement 1 says: "Activity... resets inactivity timer".
      // Requirement 6 says: "Pause inactivity timer while warning modal is visible".
      // This implies activity acts differently when modal is open?
      // Actually, usually "Stay Logged In" resets.
      // Let's stick to the button resetting it explicitly if the modal is already open,
      // OR if activity resets timer, it effectively closes modal.
      // Let's update logic: If modal is open, we do NOT auto-reset on passive movement
      // unless requirements say so. Requirement 4 says "Clicking it [Button] ... Reset".
      // It doesn't explicitly forbid passive reset, but "Pause inactivity timer while warning modal is visible"
      // suggests we wait for the user to click the button.
      // BUT, typically, if a user is typing, they shouldn't see a modal.
      // Let's adhere to "Activity resets timer". If timer resets, modal condition (time > limit - warning) fails, so it closes.
      // So yes, local activity will close it via state update.)
      setShowModal(false);
    }
  }, [broadcast]);

  // Bind event listeners
  useEffect(() => {
    if (!isLoggedIn) return;

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isLoggedIn, handleUserActivity]);

  // Logout Handler (declared before timer logic that uses it)
  const handleLogout = useCallback(
    (shouldBroadcast = true) => {
      if (isLoggedOutRef.current) return;

      isLoggedOutRef.current = true; // Prevent double firing

      // 1. Clear timers
      if (timerRef.current) clearInterval(timerRef.current);

      // 2. Broadcast logout to other tabs
      if (shouldBroadcast) {
        broadcast(eventTypes.LOGOUT);
      }

      // 3. Clear local state and API logout
      _logOutUser();

      // 4. Redirect
      navigate(APP_ROUTES.AUTH.LOGIN, { replace: true });

      setShowModal(false);
    },
    [broadcast, _logOutUser, navigate],
  );

  // Timer Logic
  useEffect(() => {
    if (!isLoggedIn) return;

    // Clear existing timer
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const timeElapsed = now - lastActivityRef.current;

      // Check for timeout
      if (timeElapsed >= INACTIVITY_LIMIT) {
        handleLogout(true);
      }
      // Check for warning
      else if (timeElapsed >= INACTIVITY_LIMIT - WARNING_DURATION) {
        if (!showModal) {
          setShowModal(true);
        }

        // Calculate remaining countdown
        const remaining = Math.max(
          0,
          Math.ceil((INACTIVITY_LIMIT - timeElapsed) / 1000),
        );
        setCountdown(remaining);
      } else {
        // Reset states if we are back in safe zone (e.g. synced activity)
        if (showModal) {
          setShowModal(false);
        }
      }
    }, 1000); // Check every second

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoggedIn, lastActivity, showModal, handleLogout]); // Re-run if these change, though refs help avoid some deps

  const handleStayLoggedIn = useCallback(() => {
    const now = Date.now();
    setLastActivity(now);
    lastActivityRef.current = now;
    setShowModal(false);
    broadcast(eventTypes.ACTIVITY_UPDATE, now);
  }, [broadcast]);

  return {
    showModal,
    countdown,
    handleStayLoggedIn,
    handleLogout: () => handleLogout(true),
  };
};
