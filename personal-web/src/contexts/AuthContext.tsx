import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthService, UserService } from "@/services";
import type { UserDto, AuthResponseDto, ApiResponse } from "@/types";
import { encryptPassword } from "@shared/core";

interface AuthContextType {
  user: UserDto | null;
  accessToken: string | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: Error | null; needsVerification?: boolean }>;
  signOut: () => Promise<void>;
  verifyOTP: (
    email: string,
    otp: string,
    isRegistration?: boolean,
  ) => Promise<{ error: Error | null }>;
  resendOTP: (email: string) => Promise<{ error: Error | null }>;
  verifyAndAuthenticate: (
    email: string,
    otp: string,
    password: string,
    isRegistration?: boolean,
  ) => Promise<{ error: Error | null }>;
  pendingEmail: string | null;
  pendingPassword: string | null;
  pendingSessionId: string | null;
  isAdmin: boolean;
  setPendingCredentials: (
    email: string | null,
    password: string | null,
  ) => void;
  setPendingSessionId: (sessionId: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "sb-access-token";
const USER_KEY = "sb-user-data";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingPassword, setPendingPassword] = useState<string | null>(null);
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);

  const setPendingCredentials = (
    email: string | null,
    password: string | null,
  ) => {
    setPendingEmail(email);
    setPendingPassword(password);
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userData = localStorage.getItem(USER_KEY);

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setAccessToken(token);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const keyResponse = await AuthService.getPublicKey();
      const encryptionKey = keyResponse.data.public_key;
      const encryptedPassword = await encryptPassword(password, encryptionKey);

      const response = await AuthService.login({
        email,
        encrypted_password: encryptedPassword,
      });

      const result = response.data;

      // Store token and user data if available immediately
      if (result.access_token) {
        setAccessToken(result.access_token);
        localStorage.setItem(TOKEN_KEY, result.access_token);

        // Fetch full profile since login payload is minimal
        try {
          const profileResponse = await UserService.getProfile();
          const profileData = profileResponse.data;

          const userData: UserDto = {
            id: profileData.id,
            email: profileData.email,
            firstName: profileData.first_name || profileData.firstName || "",
            lastName: profileData.last_name || profileData.lastName || "",
            role: profileData.status === "ACTIVE" ? "user" : "pending",
          };

          setUser(userData);
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
        } catch (profileError) {
          console.error(
            "Failed to fetch user profile after login:",
            profileError,
          );
          // Fallback with basic info if profile fetch fails
          const basicUser: UserDto = {
            id: result.user.id,
            email: result.user.email,
            firstName: "",
            lastName: "",
          };
          setUser(basicUser);
          localStorage.setItem(USER_KEY, JSON.stringify(basicUser));
        }

        return { error: null };
      }

      // Fallback for 2FA if backend still requires it
      if (result.two_factor_required) {
        setPendingSessionId(result.session_id || null);
        setPendingCredentials(email, password);
        return { error: null, needs2FA: true } as any;
      }

      return { error: new Error("Authentication failed: No token received") };
    } catch (error: any) {
      // Check if error indicates unverified account
      const errorMessage = error.message || "";

      if (
        errorMessage.includes("not verified") ||
        errorMessage.includes("verify") ||
        errorMessage.includes("OTP")
      ) {
        // Store credentials for auto-login after verification
        setPendingCredentials(email, password);

        // Try to send OTP
        try {
          await AuthService.sendOtp({ email });
        } catch (otpError) {
          console.error("Failed to send OTP:", otpError);
        }

        return { error: null, needsVerification: true };
      }

      return { error: error as Error };
    }
  };

  const verifyOTP = async (
    email: string,
    otp: string,
    isRegistration?: boolean,
  ) => {
    try {
      if (pendingSessionId) {
        const response = await AuthService.verify2FACode({
          session_id: pendingSessionId,
          code: otp,
        });

        const result = response.data;

        // Store token and user data on successful 2FA
        setAccessToken(result.access_token);
        localStorage.setItem(TOKEN_KEY, result.access_token);

        // Fetch full profile
        try {
          const profileResponse = await UserService.getProfile();
          const profileData = profileResponse.data;

          const userData: UserDto = {
            id: profileData.id,
            email: profileData.email,
            firstName: profileData.first_name || profileData.firstName || "",
            lastName: profileData.last_name || profileData.lastName || "",
          };

          setUser(userData);
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
        } catch (error) {
          console.error("Failed to fetch profile in 2FA:", error);
        }

        setPendingSessionId(null);
        setPendingCredentials(null, null);

        return { error: null };
      }

      if (isRegistration) {
        // Generate a random idempotency key for registration completion
        const idempotencyKey =
          crypto.randomUUID?.() || Math.random().toString(36).substring(2);
        await AuthService.completeRegistration(
          { email, code: otp },
          idempotencyKey,
        );
      } else {
        // Fallback to legacy verifyOtp for forgot-password
        await AuthService.verifyOtp({ email, otp });
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const verifyAndAuthenticate = async (
    email: string,
    otp: string,
    password: string,
    isRegistration?: boolean,
  ) => {
    try {
      // First verify OTP
      const { error: verifyError } = await verifyOTP(
        email,
        otp,
        isRegistration,
      );
      if (verifyError) {
        return { error: verifyError };
      }

      // Then authenticate
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        return { error: signInError };
      }

      // Clear pending credentials
      setPendingCredentials(null, null);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const resendOTP = async (email: string) => {
    try {
      await AuthService.resendOtp({ email });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setAccessToken(null);
    setPendingCredentials(null, null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        signIn,
        signOut,
        verifyOTP,
        resendOTP,
        verifyAndAuthenticate,
        pendingEmail,
        pendingPassword,
        pendingSessionId,
        isAdmin: user?.role === "admin",
        setPendingCredentials,
        setPendingSessionId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
