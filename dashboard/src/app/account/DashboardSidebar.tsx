"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_ROUTES } from "@/lib/routes";

import {
  LayoutDashboard,
  Users,
  Megaphone,
  PiggyBank,
  CreditCard,
  Receipt,
  UserCog,
  Settings,
  BarChart3,
  Wallet,
  ChevronDown,
  Phone,
  MessageSquare,
  Terminal,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useUserStore } from "@/state/userStore";
import { BrandIcon } from "@/components/shared/BrandIcon";

const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: APP_ROUTES.ACCOUNT.DASHBOARD,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      // { title: "Branches", url: APP_ROUTES.ACCOUNT.BRANCHES, icon: Building2 },
      {
        title: "Customers",
        url: APP_ROUTES.ACCOUNT.CUSTOMERS.LIST,
        icon: Users,
      },
      { title: "Staff", url: APP_ROUTES.ACCOUNT.STAFF, icon: UserCog },
    ],
  },
  {
    title: "Financial Services",
    items: [
      {
        title: "E-Banking",
        url: APP_ROUTES.ACCOUNT.BANKING.ROOT,
        icon: Wallet,
        subItems: [
          { title: "Accounts", url: APP_ROUTES.ACCOUNT.BANKING.ACCOUNTS },
          {
            title: "Transactions",
            url: APP_ROUTES.ACCOUNT.BANKING.TRANSACTIONS,
          },
          { title: "Transfer Limits", url: APP_ROUTES.ACCOUNT.BANKING.LIMITS },
        ],
      },
      {
        title: "Loans",
        url: APP_ROUTES.ACCOUNT.LOANS.ROOT,
        icon: PiggyBank,
        subItems: [
          {
            title: "Loan Applications",
            url: APP_ROUTES.ACCOUNT.LOANS.APPLICATIONS,
          },
          { title: "Active Loans", url: APP_ROUTES.ACCOUNT.LOANS.ACTIVE },
          { title: "Loan Products", url: APP_ROUTES.ACCOUNT.LOANS.PRODUCTS },
        ],
      },
      { title: "Cards", url: APP_ROUTES.ACCOUNT.CARDS, icon: CreditCard },
      { title: "USSD Banking", url: APP_ROUTES.ACCOUNT.USSD, icon: Phone },
      {
        title: "WhatsApp Banking",
        url: APP_ROUTES.ACCOUNT.WHATSAPP,
        icon: MessageSquare,
      },
      { title: "POS Management", url: APP_ROUTES.ACCOUNT.POS, icon: Terminal },
      { title: "Expenses", url: APP_ROUTES.ACCOUNT.EXPENSES, icon: Receipt },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Notifications",
        url: APP_ROUTES.ACCOUNT.NOTIFICATIONS,
        icon: Megaphone,
      },
      { title: "Reports", url: APP_ROUTES.ACCOUNT.REPORTS, icon: BarChart3 },
      {
        title: "Settings",
        url: APP_ROUTES.ACCOUNT.SETTINGS.ROOT,
        icon: Settings,
      },
    ],
  },
];

export function DashboardSidebar() {
  // const pathname = usePathname();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const userData = useUserStore((state) => state.userData);
  const companyName = userData.organisation.organisation_name;
  const role = userData.role;
  const formattedRole = role.replace(/_/g, " ");

  const currentPath = usePathname();
  // const params = useSearchParams();

  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const isActive = (path: string) => {
    if (path === APP_ROUTES.ACCOUNT.DASHBOARD)
      return currentPath === APP_ROUTES.ACCOUNT.DASHBOARD;
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const active = isActive(path);
    return active
      ? "bg-primary/15 text-primary font-bold shadow-sm relative overflow-hidden"
      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200 border-transparent";
  };

  const toggleSubMenu = (key: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-80"} collapsible="icon">
      {/* <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BrandIcon />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight">
                  {companyName}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {formattedRole}
                </span>
              </div>
            )}
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader> */}

      <SidebarHeader
        className={
          collapsed
            ? "border-b border-sidebar-border px-3 py-3"
            : "border-b border-sidebar-border px-4 py-4"
        }
      >
        <div
          className={
            collapsed
              ? "flex flex-col items-center gap-3"
              : "flex items-center justify-between gap-3"
          }
        >
          <div className="flex items-center gap-3">
            <BrandIcon
              containerClassName={
                collapsed
                  ? "w-8 h-8 rounded-xl shadow-lg flex items-center justify-center ring-1 ring-white/10"
                  : undefined
              }
            />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight">
                  {companyName}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {formattedRole}
                </span>
              </div>
            )}
          </div>
          <SidebarTrigger className={collapsed ? "mx-auto" : "shrink-0"} />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                {section.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => {
                  const hasSubItems =
                    "subItems" in item &&
                    item.subItems &&
                    item.subItems.length > 0;
                  const menuKey = `${section.title}-${item.title}`;
                  const isOpen = openSubMenus[menuKey];

                  if (hasSubItems && !collapsed) {
                    return (
                      <Collapsible
                        key={item.title}
                        open={isOpen}
                        onOpenChange={() => toggleSubMenu(menuKey)}
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              className={getNavClass(item.url)}
                            >
                              <item.icon className="w-5 h-5" />
                              <span className="flex-1">{item.title}</span>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="ml-6 mt-1 space-y-1">
                              {item.subItems.map((subItem) => (
                                <SidebarMenuButton
                                  key={subItem.title}
                                  asChild
                                  size="sm"
                                >
                                  <Link
                                    href={subItem.url}
                                    className={getNavClass(subItem.url)}
                                  >
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url} className={getNavClass(item.url)}>
                          <item.icon className="w-5 h-5" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
