"use client";

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
import { UserStatus } from "@/types/user.types";
import { Gender } from "@/types/enums";
import { ROLES } from "@/auth/roles";
import { useCreatePlatformUser } from "@/hooks/mutations/usePlatformUserMutations";
import { useGetEncryptionPublicKey } from "@/hooks/endpoints/useAuth";
import { encryptPassword } from "@shared/core";
import { IRole } from "@/types/user.types";
import { staffSchema } from "@/lib/schemas/staff/staff.schema";

// Validation Schema
export const StaffFormSchema = staffSchema;

type StaffFormValues = z.infer<typeof StaffFormSchema>;

interface AddStaffDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  platformId?: string;
  roles: IRole[];
}

export function AddStaffDialog({
  isOpen,
  onOpenChange,
  platformId,
  roles,
}: AddStaffDialogProps) {
  const { data: publicKey } = useGetEncryptionPublicKey();
  const { mutateAsync: addStaffMutation, isPending: isAddingStaff } =
    useCreatePlatformUser();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(StaffFormSchema),
    defaultValues: {
      middle_name: "",
      gender: Gender.MALE,
      role: ROLES.PLATFORM_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const onSubmit = async (data: StaffFormValues) => {
    if (!publicKey) {
      toast.error("Encryption key not found");
      return;
    }

    if (!platformId) {
      toast.error("Could not find platform ID. Please try logging in again.");
      return;
    }

    const encryptedPassword = await encryptPassword(
      data.password,
      publicKey.public_key,
    );

    const payload = {
      ...data,
      middle_name: data.middle_name || "",
      password: encryptedPassword,
      platform_id: platformId,
      status: UserStatus.ACTIVE,
    };

    await addStaffMutation(payload, {
      onSuccess: () => {
        toast.success("Staff member added successfully");
        onOpenChange(false);
        reset();
      },
      onError: (error: unknown) => {
        const errMsg =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to add staff member";
        toast.error(errMsg);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>Enter staff member details</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
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
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
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
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input
                id="middle_name"
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@platpay.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="role">
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
              <Label htmlFor="gender">Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="gender">
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
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || isAddingStaff}>
              {isAddingStaff ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Staff...
                </>
              ) : (
                "Add Staff Member"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
