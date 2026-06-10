import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Search, User } from "lucide-react";

export default function DashboardLayout() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.force_password_change)
    return <Navigate to="/change-password" replace />;
  if (user && !user.onboarding_completed)
    return <Navigate to="/onboarding/new" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header
            className="h-16 flex items-center justify-between px-4 sm:px-6 shrink-0"
            style={{
              background: "rgb(var(--background))",
              borderBottom: "1px solid rgb(var(--border))",
            }}
          >
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              <div
                className="hidden sm:flex items-center gap-2 h-9 px-3.5 rounded-pill"
                style={{ background: "rgb(var(--surface))", minWidth: 220 }}
              >
                <Search
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: "rgb(var(--foreground-subtle))" }}
                />
                <input
                  placeholder="Search transactions..."
                  className="bg-transparent text-xs outline-none flex-1 placeholder:text-foreground-subtle"
                  style={{ color: "rgb(var(--foreground))" }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                className="h-9 w-9 flex items-center justify-center rounded-pill transition-colors hover:bg-surface"
                style={{ color: "rgb(var(--foreground-subtle))" }}
              >
                <Bell className="h-4 w-4" />
              </button>
              <div
                className="flex items-center gap-2 ml-1 pl-2"
                style={{ borderLeft: "1px solid rgb(var(--border))" }}
              >
                <span
                  className="text-sm font-medium hidden sm:inline"
                  style={{ color: "rgb(var(--foreground))" }}
                >
                  {user?.full_name?.split(" ")[0] ?? "Account"}
                </span>
                <div
                  className="h-8 w-8 rounded-pill flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "rgb(var(--brand-primary) / 0.12)",
                    color: "rgb(var(--brand-primary))",
                  }}
                >
                  {user?.full_name?.[0]?.toUpperCase() ?? (
                    <User className="h-4 w-4" />
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main
            className="flex-1 overflow-auto pb-20 sm:pb-0"
            style={{ padding: "28px 36px" }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
