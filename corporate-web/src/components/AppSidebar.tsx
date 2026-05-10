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
  Wrench,
} from "lucide-react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { BrandConfigService } from "@shared/core";
import { cn } from "@/lib/utils";
import type { PermissionCategory } from "@/types/roles";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  requiredCategory?: PermissionCategory;
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

  const navItemClass = (isActive: boolean) =>
    cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full",
      isActive ? "text-white" : "hover:bg-surface-high",
    );

  return (
    <Sidebar
      collapsible="icon"
      style={{ borderRight: "1px solid rgb(var(--border))" }}
    >
      <SidebarContent>
        {/* Brand header */}
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex flex-col px-2 py-4 gap-4">
              {!collapsed ? (
                <div className="flex items-center gap-3">
                  <div
                    className="logo-mark h-10 w-10 rounded-xl shrink-0"
                    style={{ background: "rgb(var(--brand-primary) / 0.12)" }}
                  >
                    {brand.brandLogoUrl ? (
                      <img
                        src={brand.brandLogoUrl}
                        alt={brand.brandName}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <Building2
                        className="h-5 w-5"
                        style={{ color: "rgb(var(--brand-primary))" }}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span
                        className="font-bold text-sm truncate"
                        style={{
                          fontFamily: "Manrope, sans-serif",
                          color: "rgb(var(--foreground))",
                        }}
                      >
                        {brand.brandName}
                      </span>
                      <ChevronDown
                        className="h-3.5 w-3.5 shrink-0"
                        style={{ color: "rgb(var(--foreground-subtle))" }}
                      />
                    </div>
                    <span
                      className="text-xs truncate block"
                      style={{ color: "rgb(var(--foreground-subtle))" }}
                    >
                      {user?.full_name ?? "User"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div
                    className="logo-mark h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgb(var(--brand-primary) / 0.12)" }}
                  >
                    {brand.brandLogoUrl ? (
                      <img
                        src={brand.brandLogoUrl}
                        alt={brand.brandName}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <Building2
                        className="h-5 w-5"
                        style={{ color: "rgb(var(--brand-primary))" }}
                      />
                    )}
                  </div>
                </div>
              )}

              {!collapsed && role === "owner" && (
                <button
                  onClick={() => navigate("/onboarding/new")}
                  className="btn-pill btn-primary w-full justify-center text-xs"
                >
                  Complete Onboarding
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            {!collapsed && <p className="eyebrow px-3 pb-2">Overview</p>}
            <nav className="flex flex-col gap-0.5 px-2">
              {visibleMain.map((item) => {
                const isActive =
                  item.url === "/dashboard"
                    ? location.pathname === "/dashboard"
                    : location.pathname.startsWith(item.url);
                return (
                  <RouterNavLink
                    key={item.url}
                    to={item.url}
                    end={item.url === "/dashboard"}
                    className={navItemClass(isActive)}
                    style={
                      isActive
                        ? { background: "rgb(var(--foreground))" }
                        : undefined
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </RouterNavLink>
                );
              })}
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Administration */}
        {visibleAdmin.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              {!collapsed ? (
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className="eyebrow px-3 pb-2 flex items-center justify-between w-full hover:opacity-70 transition-opacity"
                >
                  Administration
                  <Wrench
                    className="h-3 w-3"
                    style={{ color: "rgb(var(--foreground-subtle))" }}
                  />
                </button>
              ) : null}
              {(adminOpen || collapsed) && (
                <nav className="flex flex-col gap-0.5 px-2">
                  {visibleAdmin.map((item) => {
                    const isActive = location.pathname.startsWith(item.url);
                    return (
                      <RouterNavLink
                        key={item.url}
                        to={item.url}
                        className={navItemClass(isActive)}
                        style={
                          isActive
                            ? { background: "rgb(var(--foreground))" }
                            : undefined
                        }
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </RouterNavLink>
                    );
                  })}
                </nav>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter style={{ borderTop: "1px solid rgb(var(--border))" }}>
        <div className="p-3">
          {!collapsed && user && (
            <div className="px-1 py-2 mb-2">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "rgb(var(--foreground))" }}
              >
                {user.full_name ?? user.email}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "rgb(var(--foreground-subtle))" }}
              >
                {user.email}
              </p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm w-full transition-colors hover:bg-surface"
            style={{ color: "rgb(var(--foreground-subtle))" }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
