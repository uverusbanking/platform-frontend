"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IUser } from "@/types/user.types";
import { useDeletePlatformUser } from "@/hooks/mutations/usePlatformUserMutations";

interface DeleteStaffDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  staff: IUser | null;
}

export function DeleteStaffDialog({
  isOpen,
  onOpenChange,
  staff,
}: DeleteStaffDialogProps) {
  const { mutateAsync: deleteStaffMutation } = useDeletePlatformUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!staff) return;
    setIsDeleting(true);

    deleteStaffMutation(staff.id, {
      onSuccess: () => {
        toast.success("Staff member deleted successfully");
        onOpenChange(false);
        setIsDeleting(false);
      },
      onError: (error: unknown) => {
        const errMsg =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to delete staff member";
        toast.error(errMsg);
        setIsDeleting(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Staff Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {staff?.first_name}{" "}
            {staff?.last_name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Staff"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
