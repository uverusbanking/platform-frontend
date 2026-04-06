import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "@/contexts/AuthContext"

export type AdminRole =
  | "super_admin"
  | "operations_admin"
  | "compliance_admin"
  | "support_admin"
  | "read_only_admin";

export interface AdminUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  role: AdminRole;
  is_active: boolean;
  two_factor_enabled: boolean;
  last_login_at: string | null;
  created_at: string;
}

export type AdminPermission =
  | "view_users"
  | "manage_users"
  | "view_kyc"
  | "manage_kyc"
  | "view_transactions"
  | "manage_transactions"
  | "view_wallets"
  | "manage_wallets"
  | "view_tiers"
  | "manage_tiers"
  | "view_logs"
  | "manage_admins";

// Permission mapping by role
const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    "view_users",
    "manage_users",
    "view_kyc",
    "manage_kyc",
    "view_transactions",
    "manage_transactions",
    "view_wallets",
    "manage_wallets",
    "view_tiers",
    "manage_tiers",
    "view_logs",
    "manage_admins",
  ],
  operations_admin: [
    "view_users",
    "manage_users",
    "view_transactions",
    "manage_transactions",
    "view_wallets",
    "manage_wallets",
    "view_tiers",
    "view_logs",
  ],
  compliance_admin: [
    "view_users",
    "view_kyc",
    "manage_kyc",
    "view_transactions",
    "view_wallets",
    "view_tiers",
    "manage_tiers",
    "view_logs",
  ],
  support_admin: [
    "view_users",
    "manage_users",
    "view_kyc",
    "view_transactions",
    "view_tiers",
    "view_logs",
  ],
  read_only_admin: [
    "view_users",
    "view_kyc",
    "view_transactions",
    "view_wallets",
    "view_tiers",
    "view_logs",
  ],
};

interface AdminContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  loading: boolean;
  role: AdminRole | null;
  hasPermission: (permission: AdminPermission) => boolean;
  logAction: (
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, unknown>,
  ) => Promise<void>;
  refreshAdminUser: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  /*
   * Checks user role directly from AuthContext.
   */
  const fetchAdminUser = useCallback(async () => {
    if (!user?.email) {
      setAdminUser(null);
      setLoading(false);
      return;
    }

    // Role check - assuming 'admin', 'super_admin' etc are in user.role
    // or defaulting to 'read_only_admin' if generic 'admin' role is present
    const userRole = user.role as AdminRole;

    // Simple check: if user has a role that looks like an admin role
    const validRoles: AdminRole[] = [
      "super_admin",
      "operations_admin",
      "compliance_admin",
      "support_admin",
      "read_only_admin",
    ];

    if (userRole && validRoles.includes(userRole)) {
      setAdminUser({
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        full_name: `${user.firstName} ${user.lastName}`,
        role: userRole,
        is_active: true,
        two_factor_enabled: false, // Default
        last_login_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    } else {
      // If just "admin" but not specific, maybe map to read_only or super_admin for now?
      if (user.role === "admin") {
        setAdminUser({
          id: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          full_name: `${user.firstName} ${user.lastName}`,
          role: "super_admin", // Default generic admin to super_admin or limited?
          is_active: true,
          two_factor_enabled: false,
          last_login_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
      } else {
        setAdminUser(null);
      }
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchAdminUser();
    }
  }, [authLoading, fetchAdminUser]);

  const hasPermission = useCallback(
    (permission: AdminPermission): boolean => {
      if (!adminUser?.role) return false;
      return ROLE_PERMISSIONS[adminUser.role]?.includes(permission) ?? false;
    },
    [adminUser?.role],
  );

  // Stub for logAction
  const logAction = useCallback(
    async (
      action: string,
      resourceType: string,
      resourceId?: string,
      details?: Record<string, unknown>,
    ) => {
      console.log(
        `[Admin Log] ${action} on ${resourceType} (${resourceId})`,
        details,
      );
    },
    [],
  );

  const refreshAdminUser = useCallback(async () => {
    await fetchAdminUser();
  }, [fetchAdminUser]);

  const value: AdminContextType = {
    adminUser,
    isAdminAuthenticated: !!adminUser && adminUser.is_active,
    loading: loading || authLoading,
    role: adminUser?.role || null,
    hasPermission,
    logAction,
    refreshAdminUser,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
