"use client";

import { useInactivity } from "@/hooks/useInactivity";
import { SessionTimeoutModal } from "./SessionTimeoutModal";
import { useUserStore } from "@/state/userStore";

export function InactivityTracker() {
  const { isLoggedIn } = useUserStore();
  const { showModal, countdown, handleStayLoggedIn, handleLogout } =
    useInactivity();

  // Only render if user is logged in
  if (!isLoggedIn) return null;

  return (
    <SessionTimeoutModal
      open={showModal}
      countdown={countdown}
      onStayLoggedIn={handleStayLoggedIn}
      onLogout={handleLogout}
    />
  );
}
