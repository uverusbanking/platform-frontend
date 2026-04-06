import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "@/services";
import type { UserDto, AuthResponseDto } from "@/types";

interface AuthContextType {
  user: UserDto | null;
  accessToken: string | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: Error | null; needsVerification?: boolean }>;
  signOut: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<{ error: Error | null }>;
  resendOTP: (email: string) => Promise<{ error: Error | null }>;
  verifyAndAuthenticate: (
    email: string,
    otp: string,
    password: string,
  ) => Promise<{ error: Error | null }>;
  pendingEmail: string | null;
  pendingPassword: string | null;
  isAdmin: boolean;
  setPendingCredentials: (
    email: string | null,
    password: string | null,
  ) => void;
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
      const response = await AuthService.login({ email, password });

      // Store token and user data
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      setAccessToken(response.accessToken);
      setUser(response.user);

      return { error: null };
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

  const verifyOTP = async (email: string, otp: string) => {
    try {
      await AuthService.verifyOtp({ email, otp });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const verifyAndAuthenticate = async (
    email: string,
    otp: string,
    password: string,
  ) => {
    try {
      // First verify OTP
      const { error: verifyError } = await verifyOTP(email, otp);
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
        isAdmin: user?.role === "admin",
        setPendingCredentials,
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
