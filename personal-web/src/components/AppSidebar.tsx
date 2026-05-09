import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  History,
  Send,
  QrCode,
  User,
  Settings,
  Bell,
  LogOut,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { BrandConfigService } from "@shared/core";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { title: "Dashboard", url: "/account/dashboard", icon: Home },
  { title: "Send Money", url: "/account/send", icon: Send },
  { title: "Receive", url: "/account/receive", icon: QrCode },
  { title: "Transactions", url: "/account/transactions", icon: History },
];

const accountNavItems = [
  { title: "Profile", url: "/account/profile", icon: User },
  { title: "Settings", url: "/account/settings", icon: Settings },
  { title: "Notifications", url: "/account/notifications", icon: Bell },
];

const adminNavItems = [{ title: "Admin Panel", url: "/admin", icon: Shield }];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const collapsed = state === "collapsed";
  const brand = BrandConfigService.getConfigSync("personal");

  const isActive = (path: string) => location.pathname === path;

  const isAdmin = user?.user_metadata?.role === "admin";

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth/login");
    } catch {
      // sign out failed silently
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-background"
    >
      {/* Logo */}
      <SidebarHeader className="px-[18px] py-[22px]">
        <div className="flex items-center gap-[10px]">
          <div className="relative shrink-0">
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
              {brand.brandLogoUrl ? (
                <img
                  src={brand.brandLogoUrl}
                  alt={brand.brandName}
                  className="w-4 h-4 object-contain"
                />
              ) : (
                <span className="text-surface-highest font-extrabold text-sm tracking-tighter">
                  {brand.brandName.charAt(0)}
                </span>
              )}
            </div>
            {/* Red notification dot */}
            <span className="absolute -top-[3px] -right-[3px] w-2 h-2 rounded-pill bg-brand-primary" />
          </div>

          {!collapsed && (
            <span className="font-extrabold text-[18px] tracking-[-0.04em] text-foreground leading-none">
              {brand.shortBrandName || brand.brandName}
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-[10px]">
        {/* Main nav */}
        <SidebarGroup className="p-0">
          {!collapsed && (
            <div className="eyebrow mx-3 mt-[18px] mb-[6px]">Main</div>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-[2px]">
              {mainNavItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "h-[40px] rounded-xl px-3 text-sm font-medium transition-colors duration-150",
                        "text-foreground/70 hover:bg-surface hover:text-foreground",
                        active &&
                          "bg-foreground text-surface-highest hover:bg-foreground hover:text-surface-highest",
                      )}
                    >
                      <button
                        onClick={() => navigate(item.url)}
                        className="flex items-center gap-3 w-full"
                      >
                        <item.icon
                          className="h-4 w-4 shrink-0"
                          strokeWidth={active ? 2.5 : 2}
                        />
                        {!collapsed && <span>{item.title}</span>}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account nav */}
        <SidebarGroup className="p-0">
          {!collapsed && (
            <div className="eyebrow mx-3 mt-[18px] mb-[6px]">Account</div>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-[2px]">
              {accountNavItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "h-[40px] rounded-xl px-3 text-sm font-medium transition-colors duration-150",
                        "text-foreground/70 hover:bg-surface hover:text-foreground",
                        active &&
                          "bg-foreground text-surface-highest hover:bg-foreground hover:text-surface-highest",
                      )}
                    >
                      <button
                        onClick={() => navigate(item.url)}
                        className="flex items-center gap-3 w-full"
                      >
                        <item.icon
                          className="h-4 w-4 shrink-0"
                          strokeWidth={active ? 2.5 : 2}
                        />
                        {!collapsed && <span>{item.title}</span>}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin nav */}
        {isAdmin && (
          <SidebarGroup className="p-0">
            {!collapsed && (
              <div className="eyebrow mx-3 mt-[18px] mb-[6px]">Admin</div>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="gap-[2px]">
                {adminNavItems.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={cn(
                          "h-[40px] rounded-xl px-3 text-sm font-medium transition-colors duration-150",
                          "text-foreground/70 hover:bg-surface hover:text-foreground",
                          active &&
                            "bg-foreground text-surface-highest hover:bg-foreground hover:text-surface-highest",
                        )}
                      >
                        <button
                          onClick={() => navigate(item.url)}
                          className="flex items-center gap-3 w-full"
                        >
                          <item.icon
                            className="h-4 w-4 shrink-0"
                            strokeWidth={active ? 2.5 : 2}
                          />
                          {!collapsed && <span>{item.title}</span>}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Sign out footer */}
      <SidebarFooter className="px-[10px] pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={handleSignOut}
              className="h-[40px] rounded-xl px-3 text-sm font-medium text-foreground/50 hover:bg-surface hover:text-error transition-colors duration-150"
            >
              <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
