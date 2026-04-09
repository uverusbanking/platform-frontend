"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/state/userStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // TODO:::
  // While redirecting, render nothing or a loader
  if (!isLoggedIn) return null;

  return <>{children}</>;
}
