import { useLocation, useNavigate } from "react-router-dom";
import { useAdmin, AdminPermission } from "@/contexts/AdminContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  ShieldCheck,
  Wallet,
  History,
  FileCheck,
  Settings2,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  BarChart3,
  UserCog,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: AdminPermission;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", url: "/admin-dashboard", icon: LayoutDashboard },
  {
    title: "Users",
    url: "/admin-dashboard/users",
    icon: Users,
    permission: "view_users",
  },
  {
    title: "KYC Review",
    url: "/admin-dashboard/kyc",
    icon: FileCheck,
    permission: "view_kyc",
  },
  {
    title: "Tiers & Limits",
    url: "/admin-dashboard/tiers",
    icon: ShieldCheck,
    permission: "view_tiers",
  },
];

const operationsNavItems: NavItem[] = [
  {
    title: "Wallets",
    url: "/admin-dashboard/wallets",
    icon: Wallet,
    permission: "view_wallets",
  },
  {
    title: "Transactions",
    url: "/admin-dashboard/transactions",
    icon: History,
    permission: "view_transactions",
  },
  {
    title: "Disputes",
    url: "/admin-dashboard/disputes",
    icon: AlertTriangle,
    permission: "view_users",
  },
];

const systemNavItems: NavItem[] = [
  {
    title: "Reports",
    url: "/admin-dashboard/reports",
    icon: BarChart3,
    permission: "view_logs",
  },
  {
    title: "Audit Logs",
    url: "/admin-dashboard/audit-logs",
    icon: ClipboardList,
    permission: "view_logs",
  },
  {
    title: "Admin Users",
    url: "/admin-dashboard/admins",
    icon: UserCog,
    permission: "manage_admins",
  },
  {
    title: "Settings",
    url: "/admin-dashboard/settings",
    icon: Settings2,
    permission: "manage_admins",
  },
];

const ROLE_LABELS: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  super_admin: { label: "Super Admin", variant: "destructive" },
  operations_admin: { label: "Operations", variant: "default" },
  compliance_admin: { label: "Compliance", variant: "secondary" },
  support_admin: { label: "Support", variant: "outline" },
  read_only_admin: { label: "Read Only", variant: "outline" },
};

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { adminUser, hasPermission } = useAdmin();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin-dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin-login");
  };

  const filterByPermission = (items: NavItem[]) =>
    items.filter((item) => !item.permission || hasPermission(item.permission));

  const roleInfo = adminUser?.role ? ROLE_LABELS[adminUser.role] : null;

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgb(var(--foreground))" }}
          >
            <ShieldCheck className="text-white h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-bold text-lg text-foreground">Admin Panel</h1>
              {roleInfo && (
                <Badge variant={roleInfo.variant} className="text-xs mt-1">
                  {roleInfo.label}
                </Badge>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterByPermission(mainNavItems).map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <a
                      href={item.url}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.url);
                      }}
                      className="flex items-center gap-3"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                      {item.badge && !collapsed && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Operations Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterByPermission(operationsNavItems).map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <a
                      href={item.url}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.url);
                      }}
                      className="flex items-center gap-3"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterByPermission(systemNavItems).map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <a
                      href={item.url}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.url);
                      }}
                      className="flex items-center gap-3"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        {!collapsed && adminUser && (
          <div className="px-3 py-2 mb-2 text-sm">
            <p className="font-medium truncate">
              {adminUser.full_name || adminUser.email}
            </p>
            <p className="text-xs text-foreground-subtle truncate">
              {adminUser.email}
            </p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              tooltip="Sign Out"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
