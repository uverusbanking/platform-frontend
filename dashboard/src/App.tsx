import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import LoadingDataComponent from "@/components/LoadingData2";
import { queryClient } from "@/utils/queryClient";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardSidebar } from "@/app/account/DashboardSidebar";
import { DashboardHeader } from "@/app/account/DashboardHeader";
import { OnboardingBanner } from "@/components/OnboardingBanner";
import { KYCNudgeModal } from "@/components/KYCNudgeModal";

// Auth pages
import Login from "@/app/(auth)/page";
import ForgotPassword from "@/app/(auth)/forgot-password/page";
import Register from "@/app/(auth)/register/page";
import Verify from "@/app/(auth)/verify/[session_id]/page";

// Account pages
import DashboardPage from "@/app/account/dashboard/page";
import CustomersPage from "@/app/account/customers/page";
import CustomerDetailPage from "@/app/account/customers/[id]/page";
import StaffPage from "@/app/account/staff/page";
import BankingPage from "@/app/account/banking/page";
import BankAccountsPage from "@/app/account/banking/accounts/page";
import TransactionsPage from "@/app/account/banking/transactions/page";
import LimitsPage from "@/app/account/banking/limits/page";
import LoansPage from "@/app/account/loans/page";
import LoanApplicationsPage from "@/app/account/loans/applications/page";
import ActiveLoansPage from "@/app/account/loans/active/page";
import LoanProductsPage from "@/app/account/loans/products/page";
import CardsPage from "@/app/account/cards/page";
import UssdPage from "@/app/account/ussd/page";
import WhatsappPage from "@/app/account/whatsapp/page";
import PosPage from "@/app/account/pos/page";
import ExpensesPage from "@/app/account/expenses/page";
import NotificationsPage from "@/app/account/notifications/page";
import ReportsPage from "@/app/account/reports/page";
import BranchesPage from "@/app/account/branches/page";

// Payment gateway pages
import PaymentLinksPage from "@/app/account/payment-links/page";
import PayoutsPage from "@/app/account/payouts/page";
import AnalyticsPage from "@/app/account/analytics/page";
import DevApiKeysPage from "@/app/account/developers/api-keys/page";
import DevWebhooksPage from "@/app/account/developers/webhooks/page";
import DevSdkPage from "@/app/account/developers/sdk/page";
import DevLogsPage from "@/app/account/developers/logs/page";

// Settings pages
import SettingsLayout from "@/app/account/settings/layout";
import ProfilePage from "@/app/account/settings/profile/page";
import OrganisationPage from "@/app/account/settings/organisation/page";
import DocumentsPage from "@/app/account/settings/documents/page";
import SecurityPage from "@/app/account/settings/security/page";
import ApiKeysPage from "@/app/account/settings/api-keys/page";
import BrandPage from "@/app/account/settings/brand/page";
import IntegrationsPage from "@/app/account/settings/integrations/page";

// 404
import NotFound from "@/app/not-found";

function RootLayout() {
  const { reAuthUser, isLoading } = useCheckAuth();

  useEffect(() => {
    const initPersistence = async () => {
      try {
        const { persistQueryClient } =
          await import("@tanstack/react-query-persist-client");
        const { createSyncStoragePersister } =
          await import("@tanstack/query-sync-storage-persister");

        const localStoragePersister = createSyncStoragePersister({
          storage: window.localStorage,
        });

        persistQueryClient({
          queryClient,
          persister: localStoragePersister,
          maxAge: 1000 * 60 * 60 * 24, // 24 hours
        });
      } catch (error) {
        console.error("Failed to initialize React Query persistence:", error);
      }
    };

    initPersistence();
    reAuthUser();
  }, [reAuthUser]);

  if (isLoading) return <LoadingDataComponent containerHeight="100dvh" />;

  return <Outlet />;
}

function AccountLayout() {
  return (
    <ProtectedRoute>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "20rem",
            "--sidebar-width-icon": "4rem",
          } as React.CSSProperties
        }
      >
        <div className="min-h-screen flex w-full bg-gradient-surface">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <OnboardingBanner />
            <KYCNudgeModal />
            <main className="flex-1 p-6">
              <div className="mx-auto w-full max-w-[1200px]">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster position="top-center" richColors closeButton />
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              {/* Root redirects to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify/:session_id" element={<Verify />} />

              {/* Account (protected) */}
              <Route path="/account" element={<AccountLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="customers/:id" element={<CustomerDetailPage />} />
                <Route path="staff" element={<StaffPage />} />
                <Route path="banking" element={<BankingPage />} />
                <Route path="banking/accounts" element={<BankAccountsPage />} />
                <Route
                  path="banking/transactions"
                  element={<TransactionsPage />}
                />
                <Route path="banking/limits" element={<LimitsPage />} />
                <Route path="loans" element={<LoansPage />} />
                <Route
                  path="loans/applications"
                  element={<LoanApplicationsPage />}
                />
                <Route path="loans/active" element={<ActiveLoansPage />} />
                <Route path="loans/products" element={<LoanProductsPage />} />
                <Route path="cards" element={<CardsPage />} />
                <Route path="ussd" element={<UssdPage />} />
                <Route path="whatsapp" element={<WhatsappPage />} />
                <Route path="pos" element={<PosPage />} />
                <Route path="expenses" element={<ExpensesPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="branches" element={<BranchesPage />} />

                {/* Payment gateway */}
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="payment-links" element={<PaymentLinksPage />} />
                <Route path="payouts" element={<PayoutsPage />} />
                <Route
                  path="developers/api-keys"
                  element={<DevApiKeysPage />}
                />
                <Route
                  path="developers/webhooks"
                  element={<DevWebhooksPage />}
                />
                <Route path="developers/sdk" element={<DevSdkPage />} />
                <Route path="developers/logs" element={<DevLogsPage />} />

                {/* Settings nested layout */}
                <Route path="settings" element={<SettingsLayout />}>
                  <Route index element={<Navigate to="profile" replace />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="organisation" element={<OrganisationPage />} />
                  <Route path="documents" element={<DocumentsPage />} />
                  <Route path="security" element={<SecurityPage />} />
                  <Route path="api-keys" element={<ApiKeysPage />} />
                  <Route path="brand" element={<BrandPage />} />
                  <Route path="integrations" element={<IntegrationsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
