import { Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import type { PermissionCategory } from "@/types/roles";

interface Props {
  children: React.ReactNode;
  /** Require access to this permission category */
  category?: PermissionCategory;
  /** Require a specific action id */
  action?: string;
  /** Where to redirect on denial (default: /dashboard) */
  fallback?: string;
}

export default function RequirePermission({ children, category, action, fallback = "/dashboard" }: Props) {
  const { can, canAccessCategory } = usePermissions();

  if (action && !can(action)) return <Navigate to={fallback} replace />;
  if (category && !canAccessCategory(category)) return <Navigate to={fallback} replace />;

  return <>{children}</>;
}
