import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Bell, HelpCircle, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardLayout() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.force_password_change) return <Navigate to="/change-password" replace />;
  if (user && !user.onboarding_completed) return <Navigate to="/onboarding/new" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between bg-card px-3 sm:px-4 shrink-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <SidebarTrigger />
              <Input
                placeholder="Search transactions..."
                className="h-8 w-40 sm:w-64 text-xs bg-surface-low border-0 rounded-sm placeholder:text-muted-foreground hidden sm:block"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="p-2 rounded-sm hover:bg-surface-low transition-colors">
                <Bell className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-sm hover:bg-surface-low transition-colors hidden sm:block">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </button>
              <div className="flex items-center gap-2 ml-1 sm:ml-2">
                <span className="text-sm font-medium text-foreground hidden sm:inline">
                  {user?.full_name?.split(" ")[0] ?? "Profile"}
                </span>
                <div className="h-8 w-8 rounded-full bg-surface-low flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-3 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
