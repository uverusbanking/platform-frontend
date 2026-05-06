"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  Users,
  Megaphone,
  UserCog,
  Settings,
  BarChart3,
  ChevronDown,
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
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useUserStore } from "@/state/userStore";
import { EditProfileDialog } from "@/components/features/account/settings/EditProfileDialog";
import { BrandIcon } from "@/components/layouts/layout/BrandIcon";
import { LucideIcon } from "lucide-react";

interface SubItem {
  title: string;
  url: string;
}

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  subItems?: SubItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const getNavigationItems = (): NavSection[] => [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/account/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Organisations",
        url: "/account/organisations",
        icon: Building2,
      },
      {
        title: "Customers",
        url: "/account/customers",
        icon: Users,
      },
      { title: "Platform Users", url: "/account/staff", icon: UserCog },
    ],
  },
  // {
  //   title: "Financial Services",
  //   items: [
  //     {
  //       title: "E-Banking",
  //       url: "/account/banking",
  //       icon: Wallet,
  //       subItems: [
  //         { title: "Accounts", url: "/account/banking/accounts" },
  //         { title: "Transactions", url: "/account/banking/transactions" },
  //         { title: "Transfer Limits", url: "/account/banking/limits" },
  //       ]
  //     },
  //     {
  //       title: "Loans",
  //       url: "/account/loans",
  //       icon: PiggyBank,
  //       subItems: [
  //         { title: "Loan Applications", url: "/account/loans/applications" },
  //         { title: "Active Loans", url: "/account/loans/active" },
  //         { title: "Loan Products", url: "/account/loans/products" },
  //       ]
  //     },
  //     { title: "Cards", url: "/account/cards", icon: CreditCard },
  //     { title: "USSD Banking", url: "/account/ussd", icon: Phone },
  //     { title: "WhatsApp Banking", url: "/account/whatsapp", icon: MessageSquare },
  //     { title: "POS Management", url: "/account/pos", icon: Terminal },
  //     { title: "Expenses", url: "/account/expenses", icon: Receipt },
  //   ],
  // },
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
  const userData = useUserStore((state) => state.userData);
  const collapsed = state === "collapsed";

  const { pathname: currentPath } = useLocation();
  const navigationItems = getNavigationItems();

  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const isActive = (path: string) => {
    if (path === "/account/dashboard")
      return currentPath === "/account/dashboard";
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
    <Sidebar collapsible="icon">
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
                  Uverus
                </span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Platform Admin
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
                                className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""
                                  }`}
                              />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="ml-6 mt-1 space-y-1">
                              {item.subItems?.map((subItem) => (
                                <SidebarMenuButton
                                  key={subItem.title}
                                  asChild
                                  size="sm"
                                >
                                  <Link
                                    to={subItem.url}
                                    className={getNavClass(subItem.url)}
                                  >
                                    <span className="relative z-10">
                                      {subItem.title}
                                    </span>
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
                          <item.icon className="w-5 h-5 relative z-10" />
                          {!collapsed && (
                            <span className="relative z-10">{item.title}</span>
                          )}
                          {!collapsed && isActive(item.url) && (
                            <item.icon className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10 text-primary rotate-12 transition-all" />
                          )}
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

      <SidebarFooter className="border-t border-sidebar-border/50 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                  {userData.first_name?.[0]}
                  {userData.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden animate-in fade-in slide-in-from-left-2">
                <span className="truncate font-semibold">
                  {userData.first_name} {userData.last_name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {userData.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg shadow-xl border-border/50"
            side={collapsed ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <EditProfileDialog
              trigger={
                <DropdownMenuItem
                  className="cursor-pointer gap-2 focus:bg-primary/5 focus:text-primary transition-colors"
                  onSelect={(e) => e.preventDefault()}
                >
                  <UserCog className="size-4" />
                  Edit Profile
                </DropdownMenuItem>
              }
            />
            <DropdownMenuItem
              className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/5 transition-colors"
              onClick={() => useUserStore.getState()._logOutUser()}
            >
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
