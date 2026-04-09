"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";


import {
  LayoutDashboard,
  Building2,
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
import { BrandIcon } from "@/components/layouts/layout/BrandIcon";

const navigationItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/account/dashboard", icon: LayoutDashboard },
      { title: "Analytics", url: "/account/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Branches", url: "/account/branches", icon: Building2 },
      { title: "Customers", url: "/account/customers", icon: Users },
      { title: "Staff & Vault", url: "/account/staff", icon: UserCog },
    ],
  },
  {
    title: "Financial Services",
    items: [
      {
        title: "E-Banking",
        url: "/account/banking",
        icon: Wallet,
        subItems: [
          { title: "Accounts", url: "/account/banking/accounts" },
          { title: "Transactions", url: "/account/banking/transactions" },
          { title: "Transfer Limits", url: "/account/banking/limits" },
        ],
      },
      {
        title: "Loans",
        url: "/account/loans",
        icon: PiggyBank,
        subItems: [
          { title: "Loan Applications", url: "/account/loans/applications" },
          { title: "Active Loans", url: "/account/loans/active" },
          { title: "Loan Products", url: "/account/loans/products" },
        ],
      },
      { title: "Cards", url: "/account/cards", icon: CreditCard },
      { title: "USSD Banking", url: "/account/ussd", icon: Phone },
      {
        title: "WhatsApp Banking",
        url: "/account/whatsapp",
        icon: MessageSquare,
      },
      { title: "POS Management", url: "/account/pos", icon: Terminal },
      { title: "Expenses", url: "/account/expenses", icon: Receipt },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Notifications",
        url: "/account/notifications",
        icon: Megaphone,
      },
      { title: "Reports", url: "/account/reports", icon: BarChart3 },
      { title: "Settings", url: "/account/settings", icon: Settings },
    ],
  },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname: currentPath } = useLocation();
  // const params = useSearchParams();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const isActive = (path: string) => {
    if (path === "/account/dashboard")
      return currentPath === "/account/dashboard";
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const active = isActive(path);
    return active
      ? "bg-primary text-primary-foreground font-medium shadow-fintech"
      : "hover:bg-sidebar-accent/50 transition-colors";
  };

  const toggleSubMenu = (key: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-4">
          <BrandIcon containerClassName="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary">Uverus</span>
              <span className="text-xs text-muted-foreground">
                Platform Admin
              </span>
            </div>
          )}
        </div>
        <div className="px-4 pb-4">
          <SidebarTrigger className="ml-auto" />
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
              <SidebarMenu className="flex flex-col gap-1">
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
                            <div className="ml-6 mt-1 flex flex-col gap-1">
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
