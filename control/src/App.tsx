import { CSSProperties, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { InactivityProvider } from "@/contexts/InactivityContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { queryClient } from "@/lib/queryClient";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import LoadingDataComponent from "@/components/LoadingData2";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardSidebar } from "@/app/account/DashboardSidebar";
import { DashboardHeader } from "@/app/account/DashboardHeader";
import SettingsLayout from "@/app/account/settings/layout";

// Auth pages
import Login from "@/app/login/page";
import ForgotPassword from "@/app/(auth)/forgot-password/page";
import Verify from "@/app/(auth)/verify/[session_id]/page";

// Account pages
import DashboardPage from "@/app/account/dashboard/page";
import CustomersPage from "@/app/account/customers/page";
import CustomerDetailPage from "@/app/account/customers/[id]/page";
import OrganisationsPage from "@/app/account/organisations/page";
import OrganisationDetailPage from "@/app/account/organisations/[id]/page";
import StaffPage from "@/app/account/staff/page";
import NotificationsPage from "@/app/account/notifications/page";
import ReportsPage from "@/app/account/reports/page";
import BranchesPage from "@/app/account/branches/page";
import CardsPage from "@/app/account/cards/page";
import LoansPage from "@/app/account/loans/page";
import LoanApplicationsPage from "@/app/account/loans/applications/page";
import ActiveLoansPage from "@/app/account/loans/active/page";
import LoanProductsPage from "@/app/account/loans/products/page";
import BankingPage from "@/app/account/banking/page";
import BankingAccountsPage from "@/app/account/banking/accounts/page";
import BankingTransactionsPage from "@/app/account/banking/transactions/page";
import BankingLimitsPage from "@/app/account/banking/limits/page";
import PosPage from "@/app/account/pos/page";
import ExpensesPage from "@/app/account/expenses/page";
import UssdPage from "@/app/account/ussd/page";
import WhatsappPage from "@/app/account/whatsapp/page";
import SettingsProfilePage from "@/app/account/settings/profile/page";
import SettingsSecurityPage from "@/app/account/settings/security/page";
import SettingsDevelopersPage from "@/app/account/settings/developers/page";

// 404
import NotFound from "@/app/not-found";

function RootLayout() {
  const { reAuthUser, isLoading } = useCheckAuth();

  useEffect(() => {
    const initPersistence = async () => {
      try {
        const { persistQueryClient } = await import(
          "@tanstack/react-query-persist-client"
        );
        const { createSyncStoragePersister } = await import(
          "@tanstack/query-sync-storage-persister"
        );
        const localStoragePersister = createSyncStoragePersister({
          storage: window.localStorage,
        });
        persistQueryClient({
          queryClient,
          persister: localStoragePersister,
          maxAge: 1000 * 60 * 60 * 24,
        });
      } catch (error) {
        console.error("Failed to initialize React Query persistence:", error);
      }
    };

    initPersistence();
    void reAuthUser();
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
            "--sidebar-width": "16rem",
            "--sidebar-width-icon": "4rem",
          } as CSSProperties
        }
      >
        <div className="min-h-screen flex w-full bg-gradient-surface">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <InactivityProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<RootLayout />}>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/verify/:session_id" element={<Verify />} />

                  <Route path="/account" element={<AccountLayout />}>
                    <Route
                      index
                      element={<Navigate to="dashboard" replace />}
                    />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route
                      path="customers/:id"
                      element={<CustomerDetailPage />}
                    />
                    <Route
                      path="organisations"
                      element={<OrganisationsPage />}
                    />
                    <Route
                      path="organisations/:id"
                      element={<OrganisationDetailPage />}
                    />
                    <Route path="staff" element={<StaffPage />} />
                    <Route
                      path="notifications"
                      element={<NotificationsPage />}
                    />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="branches" element={<BranchesPage />} />
                    <Route path="cards" element={<CardsPage />} />
                    <Route path="loans" element={<LoansPage />} />
                    <Route
                      path="loans/applications"
                      element={<LoanApplicationsPage />}
                    />
                    <Route
                      path="loans/active"
                      element={<ActiveLoansPage />}
                    />
                    <Route
                      path="loans/products"
                      element={<LoanProductsPage />}
                    />
                    <Route path="banking" element={<BankingPage />} />
                    <Route
                      path="banking/accounts"
                      element={<BankingAccountsPage />}
                    />
                    <Route
                      path="banking/transactions"
                      element={<BankingTransactionsPage />}
                    />
                    <Route
                      path="banking/limits"
                      element={<BankingLimitsPage />}
                    />
                    <Route path="pos" element={<PosPage />} />
                    <Route path="expenses" element={<ExpensesPage />} />
                    <Route path="ussd" element={<UssdPage />} />
                    <Route path="whatsapp" element={<WhatsappPage />} />

                    <Route path="settings" element={<SettingsLayout />}>
                      <Route
                        index
                        element={
                          <Navigate to="/account/settings/profile" replace />
                        }
                      />
                      <Route
                        path="profile"
                        element={<SettingsProfilePage />}
                      />
                      <Route
                        path="security"
                        element={<SettingsSecurityPage />}
                      />
                      <Route
                        path="developers"
                        element={<SettingsDevelopersPage />}
                      />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </InactivityProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
