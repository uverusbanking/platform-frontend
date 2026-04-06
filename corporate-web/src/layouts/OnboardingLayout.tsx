import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function OnboardingLayout() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.force_password_change) return <Navigate to="/change-password" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}
