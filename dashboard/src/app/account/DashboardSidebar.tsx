"use client";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { APP_ROUTES } from "@/lib/routes";

import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  ChevronDown,
  Link2,
  ArrowDownToLine,
  Webhook,
  BookOpen,
  KeyRound,
  FileText,
  Wallet,
  CreditCard,
  UserCog,
  Megaphone,
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

type SubNavItem = { title: string; url: string };
type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  subItems?: SubNavItem[];
};
type NavSection = { title: string; items: NavItem[] };

const navigationItems: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: APP_ROUTES.ACCOUNT.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        url: APP_ROUTES.ACCOUNT.ANALYTICS,
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        title: "Transactions",
        url: APP_ROUTES.ACCOUNT.BANKING.TRANSACTIONS,
        icon: CreditCard,
      },
      {
        title: "Payment Links",
        url: APP_ROUTES.ACCOUNT.PAYMENT_LINKS.LIST,
        icon: Link2,
      },
      {
        title: "Payouts",
        url: APP_ROUTES.ACCOUNT.PAYOUTS.LIST,
        icon: ArrowDownToLine,
      },
    ],
  },
  {
    title: "Customers",
    items: [
      {
        title: "Customers",
        url: APP_ROUTES.ACCOUNT.CUSTOMERS.LIST,
        icon: Users,
      },
      {
        title: "Wallets",
        url: APP_ROUTES.ACCOUNT.BANKING.ACCOUNTS,
        icon: Wallet,
      },
    ],
  },
  {
    title: "Developers",
    items: [
      {
        title: "API Keys",
        url: APP_ROUTES.ACCOUNT.DEVELOPERS.API_KEYS,
        icon: KeyRound,
      },
      {
        title: "Webhooks",
        url: APP_ROUTES.ACCOUNT.DEVELOPERS.WEBHOOKS,
        icon: Webhook,
      },
      {
        title: "SDK & Docs",
        url: APP_ROUTES.ACCOUNT.DEVELOPERS.SDK,
        icon: BookOpen,
      },
      {
        title: "Event Logs",
        url: APP_ROUTES.ACCOUNT.DEVELOPERS.LOGS,
        icon: FileText,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Staff",
        url: APP_ROUTES.ACCOUNT.STAFF,
        icon: UserCog,
        subItems: [],
      },
      {
        title: "Notifications",
        url: APP_ROUTES.ACCOUNT.NOTIFICATIONS,
        icon: Megaphone,
        subItems: [],
      },
      {
        title: "Settings",
        url: APP_ROUTES.ACCOUNT.SETTINGS.ROOT,
        icon: Settings,
        subItems: [
          { title: "Profile", url: APP_ROUTES.ACCOUNT.SETTINGS.PROFILE },
          {
            title: "Organisation",
            url: APP_ROUTES.ACCOUNT.SETTINGS.ORGANISATION,
          },
          { title: "Security", url: APP_ROUTES.ACCOUNT.SETTINGS.SECURITY },
          { title: "Documents", url: APP_ROUTES.ACCOUNT.SETTINGS.DOCUMENTS },
        ],
      },
    ],
  },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const userData = useUserStore((state) => state.userData);
  const companyName = userData.organisation.organisation_name;
  const role = userData.role;
  const formattedRole = role.replace(/_/g, " ");

  const { pathname: currentPath } = useLocation();

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
                                    to={subItem.url}
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
                        <Link to={item.url} className={getNavClass(item.url)}>
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
