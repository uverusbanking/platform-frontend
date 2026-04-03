"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IUser, UserStatus } from "@/types/user.types";

interface ViewStaffDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  staff: IUser | null;
}

export function ViewStaffDialog({
  isOpen,
  onOpenChange,
  staff,
}: ViewStaffDialogProps) {
  if (!staff) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl" data-testid="view-staff-title">
            Staff Member Details
          </DialogTitle>
          <DialogDescription>
            {staff.first_name} {staff.last_name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-2">
          {/* Personal Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Personal Information
            </h4>
            <div className="grid gap-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="font-medium">
                  {staff.first_name} {staff.last_name}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="font-medium text-sm">{staff.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Phone</span>
                <span className="font-medium">{staff.phone_number}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Gender</span>
                <span className="font-medium capitalize">
                  {staff.gender?.toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Role & Status */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Role & Status
            </h4>
            <div className="grid gap-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant="outline" className="capitalize">
                  {staff.role
                    ?.replace("PLATFORM_", "")
                    .replace(/_/g, " ")
                    .toLowerCase()}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant={
                    staff.status === UserStatus.ACTIVE ? "default" : "secondary"
                  }
                >
                  {staff.status.toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
