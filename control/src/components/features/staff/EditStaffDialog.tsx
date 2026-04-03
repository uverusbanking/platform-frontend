"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IUser, UserStatus } from "@/types/user.types";
import { Gender } from "@/types/enums";
import { ROLES } from "@/auth/roles";
import { useUpdatePlatformUser } from "@/hooks/mutations/usePlatformUserMutations";
import { staffSchema } from "@/lib/schemas/staff/staff.schema";

// Validation Schema (omitting email and password for edit)
const EditStaffFormSchema = staffSchema.omit({ email: true, password: true });

type EditStaffFormValues = z.infer<typeof EditStaffFormSchema>;

interface EditStaffDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  staff: IUser | null;
}

export function EditStaffDialog({
  isOpen,
  onOpenChange,
  staff,
}: EditStaffDialogProps) {
  const { mutateAsync: updateStaffMutation } = useUpdatePlatformUser();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditStaffFormValues>({
    resolver: zodResolver(EditStaffFormSchema),
  });

  useEffect(() => {
    if (staff && isOpen) {
      reset({
        first_name: staff.first_name,
        last_name: staff.last_name,
        middle_name: staff.middle_name || "",
        phone_number: staff.phone_number,
        role: staff.role,
        gender: staff.gender,
        status: staff.status,
      });
    }
  }, [staff, isOpen, reset]);

  const onSubmit = async (data: EditStaffFormValues) => {
    try {
      if (!staff) return;

      const payload = {
        userId: staff.id,
        ...data,
        middle_name: data.middle_name || "",
      };

      await updateStaffMutation(payload, {
        onSuccess: () => {
          toast.success("Staff member updated successfully");
          onOpenChange(false);
        },
        onError: (error: unknown) => {
          const errMsg =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to update staff member";
          toast.error(errMsg);
        },
      });
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update details for {staff?.first_name} {staff?.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_first_name">First Name</Label>
              <Input
                id="edit_first_name"
                placeholder="John"
                {...register("first_name")}
              />
              {errors.first_name && (
                <p className="text-xs text-destructive">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_last_name">Last Name</Label>
              <Input
                id="edit_last_name"
                placeholder="Doe"
                {...register("last_name")}
              />
              {errors.last_name && (
                <p className="text-xs text-destructive">
                  {errors.last_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_middle_name">Middle Name</Label>
              <Input
                id="edit_middle_name"
                placeholder="Anne"
                {...register("middle_name")}
              />
              {errors.middle_name && (
                <p className="text-xs text-destructive">
                  {errors.middle_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_phone_number">Phone Number</Label>
              <Input
                id="edit_phone_number"
                placeholder="+234 800 000 0000"
                {...register("phone_number")}
              />
              {errors.phone_number && (
                <p className="text-xs text-destructive">
                  {errors.phone_number.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_role">Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit_role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ROLES).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.replace("PLATFORM_", "").replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-xs text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_gender">Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit_gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Gender).map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <p className="text-xs text-destructive">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit_status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(UserStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Staff...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
