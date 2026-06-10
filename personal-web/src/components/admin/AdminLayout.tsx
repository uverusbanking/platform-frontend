import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminSidebar } from "./AdminSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

const ROUTE_TITLES: Record<string, string> = {
  "/admin-dashboard": "Dashboard",
  "/admin-dashboard/users": "User Management",
  "/admin-dashboard/kyc": "KYC Review",
  "/admin-dashboard/tiers": "Tiers & Limits",
  "/admin-dashboard/wallets": "Wallets",
  "/admin-dashboard/transactions": "Transactions",
  "/admin-dashboard/disputes": "Disputes",
  "/admin-dashboard/reports": "Reports",
  "/admin-dashboard/audit-logs": "Audit Logs",
  "/admin-dashboard/admins": "Admin Users",
  "/admin-dashboard/settings": "Settings",
};

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdminAuthenticated, loading } = useAdmin();

  useEffect(() => {
    if (!loading && !isAdminAuthenticated) {
      navigate("/admin-login");
    }
  }, [isAdminAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-pill animate-spin mx-auto mb-4"
            style={{
              borderColor: "rgb(var(--brand-primary))",
              borderTopColor: "transparent",
            }}
          />
          <p className="text-foreground-subtle">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return null;
  }

  const currentPath = location.pathname;
  const pageTitle = ROUTE_TITLES[currentPath] || "Admin";
  const isSubPage = currentPath !== "/admin-dashboard";

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin-dashboard">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              {isSubPage && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
