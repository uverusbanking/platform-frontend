import { ReactNode } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  headerContent?: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <SidebarInset className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-3 bg-background border-b border-border">
            <div className="flex items-center gap-3">
              {/* Mobile: hamburger trigger */}
              <SidebarTrigger className="lg:hidden h-9 w-9 rounded-xl flex items-center justify-center hover:bg-surface transition-colors">
                <Menu className="h-5 w-5 text-foreground" />
                <span className="sr-only">Toggle menu</span>
              </SidebarTrigger>

              {/* Search pill — desktop only */}
              <div className="hidden md:flex items-center gap-2 bg-surface border border-border rounded-pill px-4 py-2 w-64 text-foreground-subtle text-sm cursor-text">
                <Search size={14} className="shrink-0" />
                <span>Search...</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <button
                className="relative h-9 w-9 rounded-xl flex items-center justify-center hover:bg-surface transition-colors"
                onClick={() => navigate("/account/notifications")}
              >
                <Bell size={18} className="text-foreground" />
              </button>

              {/* Avatar */}
              <button
                className="h-9 w-9 rounded-pill bg-foreground text-surface-highest flex items-center justify-center font-bold text-sm shrink-0 hover:opacity-80 transition-opacity"
                onClick={() => navigate("/account/profile")}
              >
                {initials}
              </button>
            </div>
          </header>

          {/* Main content */}
          <main
            className={`flex-1 p-5 md:p-7 lg:px-9 ${isMobile ? "pb-24" : "pb-12"}`}
          >
            {children}
          </main>

          {/* Mobile bottom nav */}
          {isMobile && <BottomNav />}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
