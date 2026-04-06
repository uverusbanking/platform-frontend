import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { UserProfile } from "@/types/onboarding";
import type { CorporateRole } from "@/types/roles";
import { mockUser } from "@/services/mockData";

const EMAIL_ROLE_MAP: Record<string, { role: CorporateRole; name: string }> = {
  "admin@technovasolutions.com": { role: "owner", name: "Adewale Ogundimu" },
  "initiator@technovasolutions.com": { role: "initiator", name: "Fatima Bello" },
  "authorizer@technovasolutions.com": { role: "authorizer", name: "Chidi Nwosu" },
  "auditor@technovasolutions.com": { role: "viewer", name: "Grace Adekunle" },
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; full_name: string; phone_number: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (current: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = useCallback(async (email: string, _password: string) => {
    if (!email) return { success: false, error: "Email is required" };
    const mapped = EMAIL_ROLE_MAP[email.toLowerCase()];
    setUser({
      ...mockUser,
      email,
      full_name: mapped?.name ?? mockUser.full_name,
      role: mapped?.role ?? "owner",
    });
    return { success: true };
  }, []);

  const register = useCallback(async (data: { email: string; password: string; full_name: string; phone_number: string }) => {
    if (!data.email || !data.password) return { success: false, error: "All fields are required" };
    setUser({
      ...mockUser,
      email: data.email,
      full_name: data.full_name,
      phone_number: data.phone_number,
      role: "owner",
    });
    return { success: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const changePassword = useCallback(async (_current: string, _newPass: string) => {
    if (user) setUser({ ...user, force_password_change: false });
    return { success: true };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
