"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/state/userStore";
import { useUpdateViewMode } from "@/hooks/mutations/useAccountMutations";
import { toast } from "sonner";
import { EditProfileDialog } from "@/components/features/account/settings/EditProfileDialog";
import { UserCog, LogOut } from "lucide-react";

export function DashboardHeader() {
  const _logOutUser = useUserStore((state) => state._logOutUser);
  const userData = useUserStore((state) => state.userData);
  const { mutate: updateViewMode, isPending } = useUpdateViewMode();

  const isSandbox = userData.view_mode === "SANDBOX";

  const handleToggleEnvironment = (checked: boolean) => {
    const newMode = checked ? "SANDBOX" : "LIVE";
    updateViewMode(newMode, {
      onSuccess: () => {
        toast.success(`Switched to ${newMode} mode`);
      },
      onError: () => {
        toast.error("Failed to switch environment");
      },
    });
  };

  const fullName = `${userData.first_name} ${userData.last_name}`;
  const initial = userData.first_name
    ? userData.first_name[0].toUpperCase()
    : "U";

  return (
    <header
      className="h-16 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60`
 sticky top-0 z-50"
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* App Name & Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search customers, transactions..."
              className="pl-10 bg-surface-elevated/50 border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-error"></Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-2 p-2">
                  <div className="p-3 rounded-md bg-warning-light border-l-4 border-l-warning">
                    <p className="text-sm font-medium">New loan application</p>
                    <p className="text-xs text-muted-foreground">
                      John Doe submitted a loan request for ₦500,000
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-info border-l-4 border-l-primary">
                    <p className="text-sm font-medium">
                      Large transaction alert
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Transaction of ₦2,000,000 requires approval
                    </p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {fullName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
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
                  onClick={() => _logOutUser()}
                >
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
