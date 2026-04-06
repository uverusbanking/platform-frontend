import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import OnboardingLayout from "@/layouts/OnboardingLayout";
import RequirePermission from "@/components/RequirePermission";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import ChangePasswordPage from "@/pages/ChangePassword";
import DashboardPage from "@/pages/Dashboard";
import OnboardingWizard from "@/pages/OnboardingWizard";
import ApplicationsList from "@/pages/ApplicationsList";
import AccountsPage from "@/pages/AccountsPage";
import ApplicationDetail from "@/pages/ApplicationDetail";
import RolesPermissionsPage from "@/pages/RolesPermissions";
import ApprovalRulesPage from "@/pages/ApprovalRules";
import PaymentsPage from "@/pages/PaymentsPage";
import TransactionsPage from "@/pages/TransactionsPage";
import NewPayment from "@/pages/NewPayment";
import PaymentDetail from "@/pages/PaymentDetail";
import UserManagement from "@/pages/UserManagement";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />

            {/* Onboarding (protected but outside dashboard layout) */}
            <Route element={<OnboardingLayout />}>
              <Route path="/onboarding/:id" element={<OnboardingWizard />} />
            </Route>

            {/* Protected routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/applications" element={<ApplicationsList />} />
              <Route path="/applications/:id" element={<ApplicationDetail />} />
              <Route path="/payments" element={<RequirePermission category="transactions"><PaymentsPage /></RequirePermission>} />
              <Route path="/payments/new" element={<RequirePermission action="tx_initiate"><NewPayment /></RequirePermission>} />
              <Route path="/payments/:id" element={<RequirePermission category="transactions"><PaymentDetail /></RequirePermission>} />
              <Route path="/transactions" element={<RequirePermission category="transactions"><TransactionsPage /></RequirePermission>} />
              <Route path="/users" element={<RequirePermission action="usr_invite"><UserManagement /></RequirePermission>} />
              <Route path="/roles" element={<RequirePermission action="usr_roles"><RolesPermissionsPage /></RequirePermission>} />
              <Route path="/settings/approval-rules" element={<RequirePermission action="apr_config"><ApprovalRulesPage /></RequirePermission>} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
