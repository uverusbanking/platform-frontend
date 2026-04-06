import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import BottomNav from '@/components/BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  headerContent?: ReactNode;
}

export function AppLayout({ children, showHeader = true, headerContent }: AppLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full">
        {/* Sidebar (hidden by default on mobile, shown via toggle) */}
        <AppSidebar />

        <SidebarInset className="flex-1">
          {/* Header with Sidebar Trigger */}
          {showHeader && (
            <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
              <SidebarTrigger className="-ml-1">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </SidebarTrigger>
              {headerContent}
            </header>
          )}

          {/* Mobile-only floating toggle when header is hidden */}
          {!showHeader && isMobile && (
            <div className="fixed top-4 left-4 z-50">
              <SidebarTrigger className="h-10 w-10 rounded-full bg-background/95 backdrop-blur border border-border shadow-lg flex items-center justify-center">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </SidebarTrigger>
            </div>
          )}

          {/* Desktop-only floating toggle when header is hidden */}
          {!showHeader && !isMobile && (
            <div className="fixed top-4 left-4 z-50">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background/95 backdrop-blur border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle sidebar</span>
              </SidebarTrigger>
            </div>
          )}

          {/* Main Content with padding for mobile bottom nav */}
          <main className={`flex-1 ${isMobile ? 'pb-20' : ''}`}>
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          {isMobile && <BottomNav />}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
