"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, UserPlus } from "lucide-react";
import { IUser } from "@/types/user.types";
import { ROLES } from "@/auth/roles";
import { useUserStore } from "@/state/userStore";
import { useGetPlatformUsers } from "@/hooks/queries/usePlatformUserQueries";
import { useGetRoles } from "@/hooks/queries/usePlatformQueries";

// Extracted Components
import { StaffTable } from "@/components/features/staff/StaffTable";
import { AddStaffDialog } from "@/components/features/staff/AddStaffDialog";
import { ViewStaffDialog } from "@/components/features/staff/ViewStaffDialog";
import { EditStaffDialog } from "@/components/features/staff/EditStaffDialog";
import { DeleteStaffDialog } from "@/components/features/staff/DeleteStaffDialog";

// Roles Mock for Filter (can be fetched from API too)
const roleOptions = Object.values(ROLES);

export default function Staff() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    (typeof ROLES)[keyof typeof ROLES] | "all"
  >("all");
  const { userData } = useUserStore();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Hook Integration
  const {
    data: staffData,
    isLoading,
    isError,
  } = useGetPlatformUsers({
    page: currentPage,
    limit,
    search: debouncedSearch || undefined,
    role: selectedRole === "all" ? undefined : selectedRole,
  });

  const { data: roles } = useGetRoles("PLATFORM");

  const staffMembers = staffData?.data || [];
  const meta = staffData?.meta
    ? {
        total: staffData.meta.total,
        totalPages: staffData.meta.totalPages,
      }
    : undefined;

  const [selectedStaff, setSelectedStaff] = useState<IUser | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Staff Management
          </h1>
          <p className="text-muted-foreground">
            Manage staff, roles, payroll, and vault operations
          </p>
        </div>
      </div>

      <Tabs defaultValue="staff" className="space-y-6">
        {/* Staff Management Tab */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Staff Members</CardTitle>
                  <CardDescription>
                    Manage staff and their access
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="cursor-pointer"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Staff
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedRole}
                  onValueChange={(val) => {
                    setSelectedRole(
                      val as (typeof ROLES)[keyof typeof ROLES] | "all",
                    );
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.replace("PLATFORM_", "").replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <StaffTable
                staffMembers={staffMembers}
                isLoading={isLoading}
                isError={isError}
                currentPage={currentPage}
                limit={limit}
                meta={meta}
                onPageChange={setCurrentPage}
                onView={(staff) => {
                  setSelectedStaff(staff);
                  setIsViewModalOpen(true);
                }}
                onEdit={(staff) => {
                  setSelectedStaff(staff);
                  setIsEditModalOpen(true);
                }}
                onDelete={(staff) => {
                  setSelectedStaff(staff);
                  setIsDeleteModalOpen(true);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddStaffDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        platformId={userData?.platform_id}
        roles={roles || []}
      />

      <ViewStaffDialog
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        staff={selectedStaff}
      />

      <EditStaffDialog
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        staff={selectedStaff}
      />

      <DeleteStaffDialog
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        staff={selectedStaff}
      />
    </div>
  );
}
