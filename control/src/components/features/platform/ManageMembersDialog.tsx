"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  UserMinus,
  Mail,
  Phone,
  Clock,
  Search,
  UserPlus,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetOrganisationUsers } from "@/hooks/queries/useOrganisationQueries";
import { IOrganisationMember } from "@/types/organisation.types";
import { useGetRoles } from "@/hooks/queries/usePlatformQueries";
import {
  useAddOrganisationUser,
  useUpdateOrganisationUser,
  useDeleteOrganisationUser,
} from "@/hooks/mutations/useOrganisationMutations";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Gender } from "@/types/enums";

interface ManageMembersDialogProps {
  organisationId: string;
  organisationName: string;
  initialMembers?: IOrganisationMember[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ManageMembersDialog({
  organisationId,
  organisationName,
  initialMembers,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ManageMembersDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen;

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMode, setIsAddMode] = useState(false);

  // Skip the separate fetch when the org detail response already includes members.
  // Passing empty string exploits the hook's built-in `enabled: !!organisationId` guard.
  const { data: usersData, isLoading: isLoadingUsers } =
    useGetOrganisationUsers({
      organisationId: initialMembers ? "" : organisationId,
    });

  // Fetch dynamic roles from API
  const { data: roles = [], isLoading: isLoadingRoles } =
    useGetRoles("PLATFORM");

  const memberList = initialMembers ?? usersData?.users ?? [];

  const users = memberList.filter(
    (u) =>
      u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const { mutateAsync: addUser, isPending: isAdding } =
    useAddOrganisationUser();
  const { mutateAsync: updateUser, isPending: isUpdating } =
    useUpdateOrganisationUser();
  const { mutateAsync: deleteUser, isPending: isDeleting } =
    useDeleteOrganisationUser();

  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone_number: "",
    role: "",
    gender: Gender.OTHER,
    password: "",
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addUser({ ...newUser, organisationId });
      setIsAddMode(false);
      setNewUser({
        first_name: "",
        last_name: "",
        middle_name: "",
        email: "",
        phone_number: "",
        role: "",
        gender: Gender.OTHER,
        password: "",
      });
    } catch (error) {
      console.error("Failed to add user", error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUser({ userId, role: newRole });
    } catch (error) {
      console.error("Failed to update user role", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error("Failed to delete user", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl sm:rounded-2xl">
        <DialogHeader className="p-8 border-b border-border/40 bg-muted/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  Manage Members
                </DialogTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  {organisationName} Staff Control
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsAddMode(!isAddMode)}
              variant={isAddMode ? "ghost" : "default"}
              className="rounded-xl font-bold"
            >
              {isAddMode ? (
                <X className="w-4 h-4 mr-2" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {isAddMode ? "Cancel" : "Add Member"}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col relative">
          {/* Add Member Overlay/Form */}
          {isAddMode && (
            <div className="absolute inset-0 z-50 bg-background animate-in slide-in-from-top duration-300 flex flex-col p-8 space-y-8 overflow-y-auto">
              <div className="space-y-1">
                <h3 className="text-xl font-bold">
                  Registration of New Member
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fill in the details below to grant platform access.
                </p>
              </div>

              <form onSubmit={handleAddUser} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      placeholder="John"
                      value={newUser.first_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, first_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middle_name">Middle Name</Label>
                    <Input
                      id="middle_name"
                      placeholder="Michael"
                      value={newUser.middle_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, middle_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      placeholder="Doe"
                      value={newUser.last_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, last_name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="j.doe@company.io"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+234 812 345 6789"
                      value={newUser.phone_number}
                      onChange={(e) =>
                        setNewUser({ ...newUser, phone_number: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={newUser.gender}
                      onValueChange={(val) =>
                        setNewUser({ ...newUser, gender: val as Gender })
                      }
                    >
                      <SelectTrigger id="gender" className="w-full font-medium">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Assigned Role *</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(val) =>
                        setNewUser({ ...newUser, role: val })
                      }
                      disabled={isLoadingRoles}
                    >
                      <SelectTrigger id="role" className="w-full font-medium">
                        <SelectValue
                          placeholder={
                            isLoadingRoles ? "Loading roles..." : "Select role"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Initial Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter secure password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 8 characters. User will be required to change on
                    first login.
                  </p>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    type="submit"
                    className="rounded-xl px-8 font-bold"
                    disabled={isAdding}
                  >
                    {isAdding ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Register Member
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-xl px-8"
                    onClick={() => setIsAddMode(false)}
                  >
                    Go Back
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Members List Search Toolbar */}
          <div className="px-8 py-4 border-b border-border/40 bg-muted/5 flex items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search members by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-border/60 rounded-xl"
              />
            </div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
              {users.length} Total Users
            </div>
          </div>

          {/* Users Grid/List */}
          <div className="flex-1 overflow-y-auto p-8">
            {isLoadingUsers ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 border border-border/40 rounded-2xl"
                  >
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : users.length > 0 ? (
              <div className="grid gap-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="group relative bg-card hover:bg-muted/30 border border-border/40 rounded-2xl p-4 transition-all hover:shadow-md flex items-center justify-between overflow-hidden"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 text-primary">
                        <AvatarFallback className="font-bold uppercase">
                          {user.first_name[0]}
                          {user.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {user.first_name} {user.last_name}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-bold uppercase px-1.5 py-0 h-5 bg-muted/50"
                          >
                            {user.role}
                          </Badge>
                          {user.status === "ACTIVE" ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <span className="opacity-30">•</span>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone_number}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl hover:bg-primary/10 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-64 p-3 rounded-2xl border-border/50 shadow-2xl backdrop-blur-lg bg-background/95"
                        >
                          <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pb-3 px-2">
                            Member Actions
                          </DropdownMenuLabel>

                          <div className="space-y-3">
                            {/* Role Management Section */}
                            <div className="bg-muted/30 rounded-xl p-3 space-y-2">
                              <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                                <Shield className="w-3 h-3" />
                                Change Role
                              </Label>
                              <div className="grid grid-cols-3 gap-1.5">
                                {roles.map((role) => (
                                  <Button
                                    key={role.value}
                                    size="sm"
                                    variant={
                                      user.role === role.value
                                        ? "default"
                                        : "outline"
                                    }
                                    className={`h-8 text-[10px] font-bold px-2 rounded-lg transition-all ${
                                      user.role === role.value
                                        ? "shadow-md shadow-primary/20"
                                        : "hover:border-primary/50"
                                    }`}
                                    onClick={() =>
                                      handleRoleChange(user.id, role.value)
                                    }
                                    disabled={isUpdating || isLoadingRoles}
                                  >
                                    {isUpdating && user.role === role.value ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      role.name
                                    )}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            <DropdownMenuSeparator className="bg-border/40" />

                            {/* Status Actions */}
                            <div className="space-y-1">
                              <DropdownMenuItem
                                className="rounded-xl h-11 cursor-pointer gap-3 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 focus:bg-amber-500/10 transition-colors"
                                disabled={isUpdating}
                              >
                                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                  <Shield className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-bold text-sm">
                                    Suspend Access
                                  </span>
                                  <p className="text-[10px] text-muted-foreground">
                                    Temporarily disable
                                  </p>
                                </div>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="rounded-xl h-11 cursor-pointer gap-3 text-red-600 dark:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 transition-colors"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={isDeleting}
                              >
                                <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                  {isDeleting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <UserMinus className="h-4 w-4" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <span className="font-bold text-sm">
                                    Remove Member
                                  </span>
                                  <p className="text-[10px] text-muted-foreground">
                                    Permanent deletion
                                  </p>
                                </div>
                              </DropdownMenuItem>
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-20">
                <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
                  <Users className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">No staff members found</h4>
                  <p className="text-sm max-w-xs">
                    There are no members registration for this organisation yet.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-xl font-bold"
                  onClick={() => setIsAddMode(true)}
                >
                  Register First Member
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-muted/20 border-t border-border/40 flex justify-between items-center whitespace-nowrap overflow-x-auto gap-8">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground leading-relaxed">
            <ShieldCheck className="w-3.5 h-3.5 text-primary/60" />
            <p>
              Changes to member roles or access are logged for auditing
              purposes.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              <Clock className="w-3.5 h-3.5" /> Security Sync: Active
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
