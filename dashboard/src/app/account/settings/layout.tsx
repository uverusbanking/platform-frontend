"use client";

import { Link, useLocation, Outlet } from "react-router-dom";
import { User, Building, Lock, FileText, Key, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsNav = [
  {
    id: "profile",
    label: "Profile Settings",
    href: "/account/settings/profile",
    icon: User,
  },
  {
    id: "organisation",
    label: "Organisation Settings",
    href: "/account/settings/organisation",
    icon: Building,
  },
  {
    id: "documents",
    label: "Documents",
    href: "/account/settings/documents",
    icon: FileText,
  },
  {
    id: "security",
    label: "Security",
    href: "/account/settings/security",
    icon: Lock,
  },
  {
    id: "api-key",
    label: "API keys",
    href: "/account/settings/api-keys",
    icon: Key,
  },
  {
    id: "brand",
    label: "Brand Settings",
    href: "/account/settings/brand",
    icon: Palette,
  },
];

export default function SettingsLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-transparent pb-12 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 pb-8 border-b border-border/40">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Manage your personal profile, secure your account, and update your
            company information.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-[240px_1fr] mt-8">
          {/* Sticky Sidebar Navigation */}
          <div className="hidden md:block">
            <nav className="flex flex-col gap-2 sticky top-6">
              {settingsNav.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/account/settings/profile" &&
                    pathname === "/account/settings");
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-left group",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-fintech"
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-transform group-hover:scale-110",
                        isActive ? "opacity-100" : "opacity-70",
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {settingsNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/account/settings/profile" &&
                  pathname === "/account/settings");
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
