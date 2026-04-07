import { useState } from "react";
import {
  LayoutDashboard,
  CircleDot,
  ArrowLeftRight,
  Layers,
  Settings,
  LogOut,
  Building2,
  ArrowRight,
  Shield,
  ChevronDown,
  ChevronRight,
  Wrench,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BrandConfigService } from "@shared/core";
import type { PermissionCategory } from "@/types/roles";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  /** Required permission category — item hidden if user has no access */
  requiredCategory?: PermissionCategory;
  /** Required specific action id */
  requiredAction?: string;
}

const mainNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  {
    title: "Payments",
    url: "/payments",
    icon: CircleDot,
    requiredCategory: "transactions",
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: ArrowLeftRight,
    requiredCategory: "transactions",
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Layers,
    requiredCategory: "accounts",
  },
];

const adminSubNav: NavItem[] = [
  {
    title: "User Management",
    url: "/users",
    icon: Building2,
    requiredCategory: "users",
    requiredAction: "usr_invite",
  },
  {
    title: "Roles & Permissions",
    url: "/roles",
    icon: Shield,
    requiredCategory: "users",
    requiredAction: "usr_roles",
  },
  {
    title: "Approval Rules",
    url: "/settings/approval-rules",
    icon: Settings,
    requiredCategory: "approvals",
    requiredAction: "apr_config",
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { can, canAccessCategory, role } = usePermissions();
  const brand = BrandConfigService.getConfigSync("corporate");

  const initials =
    user?.full_name
      ?.split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() ?? "SV";

  const isVisible = (item: NavItem) => {
    if (item.requiredAction) return can(item.requiredAction);
    if (item.requiredCategory) return canAccessCategory(item.requiredCategory);
    return true;
  };

  const visibleMain = mainNav.filter(isVisible);
  const visibleAdmin = adminSubNav.filter(isVisible);

  const isAdminActive = visibleAdmin.some((i) =>
    location.pathname.startsWith(i.url),
  );
  const [adminOpen, setAdminOpen] = useState(isAdminActive);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Brand + User + Onboarding */}
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex flex-col px-2 py-4 gap-4">
              {!collapsed ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-sidebar-primary">
                      {initials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span
                        className="font-semibold text-sm text-sidebar-foreground truncate"
                        style={{ fontFamily: "Manrope, sans-serif" }}
                      >
                        {brand.brandName}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </div>
                    <span className="text-xs text-muted-foreground truncate block">
                      {user?.full_name ?? "User"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Building2 className="h-7 w-7 text-sidebar-primary" />
                </div>
              )}
              {!collapsed && role === "owner" && (
                <Button
                  size="sm"
                  onClick={() => navigate("/onboarding/new")}
                  className="w-full h-9 rounded-sm text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
                >
                  Complete Onboarding
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && (
                        <span className="flex-1">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Administration group — only show if user has any admin items */}
              {visibleAdmin.length > 0 && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setAdminOpen(!adminOpen)}
                      className={`hover:bg-sidebar-accent/50 cursor-pointer ${isAdminActive ? "text-sidebar-primary font-medium" : ""}`}
                    >
                      <Wrench className="mr-2 h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">Administration</span>
                          <ChevronRight
                            className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${adminOpen ? "rotate-90" : ""}`}
                          />
                        </>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {adminOpen &&
                    !collapsed &&
                    visibleAdmin.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.url}
                            className="hover:bg-sidebar-accent/50 pl-8"
                            activeClassName="text-sidebar-primary font-medium"
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            <span className="flex-1">{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-2 p-2">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            onClick={logout}
            className="text-sidebar-foreground hover:bg-sidebar-accent justify-start"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sign out</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
