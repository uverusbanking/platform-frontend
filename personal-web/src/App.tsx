import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { HelmetProvider } from "react-helmet-async";
import { SessionGuard } from "@/components/SessionGuard";
import { useBrandConfig } from "@/hooks/queries/useBrandConfig";
import { OrgUnavailableScreen } from "@/components/OrgUnavailableScreen";
import { BrandConfigService } from "@shared/core";

// Pages
import Index from "./pages/Index";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Dashboard from "./pages/account/Dashboard";
import Send from "./pages/account/Send";
import Receive from "./pages/account/Receive";
import Transactions from "./pages/account/Transactions";
import TransactionDetail from "./pages/account/TransactionDetail";
import Profile from "./pages/account/Profile";
import Settings from "./pages/account/Settings";
import Notifications from "./pages/account/Notifications";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import KYCVerification from "./pages/account/KYCVerification";

// Admin Pages
import {
  AdminLogin,
  AdminDashboard,
  AdminUsers,
  AdminKYC,
  AdminTiers,
  AdminWallets,
  AdminTransactions,
  AdminAuditLogs,
} from "./pages/admin/index";
import { AdminLayout } from "./components/admin/AdminLayout";
import { UserAccountLayout } from "./components/UserAccountLayout";
import { AuthLayout } from "./components/AuthLayout";

function AppContent() {
  const { data: brandConfig, refetch: refetchBrandConfig } = useBrandConfig();
  const [midSessionCode, setMidSessionCode] = useState<string | undefined>(
    undefined,
  );

  // Listen for org-unavailable events dispatched by the API client when a
  // mid-session request returns 503 with an ORG_* code.
  useEffect(() => {
    const handler = (e: Event) => {
      const code = (e as CustomEvent<{ code: string }>).detail?.code;
      if (code) {
        setMidSessionCode(code);
        refetchBrandConfig();
      }
    };
    window.addEventListener("org-unavailable", handler);
    return () => window.removeEventListener("org-unavailable", handler);
  }, [refetchBrandConfig]);

  const unavailabilityCode =
    midSessionCode ||
    (brandConfig?.available === false
      ? brandConfig.unavailabilityCode
      : undefined) ||
    (brandConfig?.status && brandConfig.status !== "ACTIVE"
      ? `ORG_${brandConfig.status}`
      : undefined);

  if (unavailabilityCode) {
    const config = brandConfig ?? BrandConfigService.getConfigSync("personal");
    return (
      <OrgUnavailableScreen
        brandConfig={config}
        unavailabilityCode={unavailabilityCode}
      />
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <AdminProvider>
            <SessionGuard>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />

                {/* Auth Routes */}
                <Route path="/auth" element={<AuthLayout />}>
                  <Route path="" element={<Navigate to="login" replace />} />
                  <Route path="login" element={<Navigate to="/" replace />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password" element={<ResetPassword />} />
                  <Route path="verify-otp" element={<VerifyOTP />} />
                </Route>

                {/* User Account/Dashboard Routes */}
                <Route path="/account" element={<UserAccountLayout />}>
                  <Route
                    path=""
                    element={<Navigate to="dashboard" replace />}
                  />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="send" element={<Send />} />
                  <Route path="receive" element={<Receive />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route
                    path="transactions/:id"
                    element={<TransactionDetail />}
                  />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route
                    path="kyc-verification"
                    element={<KYCVerification />}
                  />
                </Route>

                {/* Admin Dashboard Routes */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-dashboard" element={<AdminLayout />}>
                  <Route
                    path=""
                    element={<Navigate to="dashboard" replace />}
                  />
                  <Route path="dashboard" element={<AdminDashboard />} />

                  <Route path="users" element={<AdminUsers />} />
                  <Route path="kyc" element={<AdminKYC />} />
                  <Route path="tiers" element={<AdminTiers />} />
                  <Route path="wallets" element={<AdminWallets />} />
                  <Route path="transactions" element={<AdminTransactions />} />
                  <Route path="audit-logs" element={<AdminAuditLogs />} />
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SessionGuard>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 1 minute
      staleTime: 60 * 1000,
      // Keep unused data in garbage collection for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Refetch when window gains focus
      refetchOnWindowFocus: true,
      // Retry failed requests once
      retry: 1,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
