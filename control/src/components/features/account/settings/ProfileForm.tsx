"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUpdateProfile } from "@/hooks/endpoints/useAccount";
import { IUpdateProfilePayload } from "@/types/user.types";
import { useUserStore } from "@/state/userStore";
import { profileSchema } from "@/lib/schemas/profile/profile.schema";
import { Gender } from "@/types/enums";

interface ProfileFormProps {
  onSuccess?: () => void;
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const { userData } = useUserStore();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setValue,
  } = useForm<IUpdateProfilePayload>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (userData) {
      reset({
        first_name: userData.first_name,
        last_name: userData.last_name,
        middle_name: userData.middle_name || "",
        phone_number: userData.phone_number,
        gender: userData.gender || "MALE",
      });
    }
  }, [userData, reset]);

  const onSubmit = (data: IUpdateProfilePayload) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        reset(data);
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update profile");
      },
    });
  };

  if (!userData) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group cursor-pointer">
            <Avatar className="h-28 w-28 border-4 border-background ring-4 ring-muted shadow-lg group-hover:ring-primary/20 transition-all">
              <AvatarImage src="" />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground font-bold">
                {userData?.first_name?.[0]}
                {userData?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg border-2 border-background hover:scale-110 transition-transform cursor-pointer">
              <Camera className="h-4 w-4" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-foreground">
              {userData?.first_name} {userData?.last_name}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {userData?.role?.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid gap-6 flex-1 w-full md:grid-cols-2">
          <div className="space-y-2.5">
            <Label
              htmlFor="first_name"
              className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
            >
              First Name
            </Label>
            <Input
              id="first_name"
              {...register("first_name")}
              aria-invalid={!!errors.first_name}
              aria-describedby="first_name-error"
              className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all h-11"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1" id="first_name-error">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div className="space-y-2.5">
            <Label
              htmlFor="last_name"
              className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
            >
              Last Name
            </Label>
            <Input
              id="last_name"
              {...register("last_name")}
              aria-invalid={!!errors.last_name}
              aria-describedby="last_name-error"
              className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all h-11"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1" id="last_name-error">
                {errors.last_name.message}
              </p>
            )}
          </div>
          <div className="space-y-2.5">
            <Label
              htmlFor="middle_name"
              className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
            >
              Middle Name
            </Label>
            <Input
              id="middle_name"
              {...register("middle_name")}
              aria-invalid={!!errors.middle_name}
              aria-describedby="middle_name-error"
              className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all h-11"
            />
            {errors.middle_name && (
              <p className="text-red-500 text-sm mt-1" id="middle_name-error">
                {errors.middle_name.message}
              </p>
            )}
          </div>
          <div className="space-y-2.5">
            <Label
              htmlFor="gender"
              className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
            >
              Gender
            </Label>
            <Select
              onValueChange={(val) =>
                setValue("gender", val as Gender, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              defaultValue={userData?.gender || "MALE"}
            >
              <SelectTrigger
                id="gender"
                aria-invalid={!!errors.gender}
                aria-describedby="gender-error"
                className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all h-11"
              >
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1" id="gender-error">
                {errors.gender.message}
              </p>
            )}
          </div>
          <div className="space-y-2.5 md:col-span-2">
            <Label
              htmlFor="phone"
              className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              {...register("phone_number")}
              aria-invalid={!!errors.phone_number}
              aria-describedby="phone-error"
              className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all h-11 font-mono"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm mt-1" id="phone-error">
                {errors.phone_number.message}
              </p>
            )}
          </div>
          <div className="space-y-2.5 md:col-span-2">
            <Label
              htmlFor="email"
              className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
            >
              Personal Email
            </Label>
            <Input
              id="email"
              value={userData?.email || ""}
              disabled
              className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all h-11 text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/40">
        <Button
          type="submit"
          disabled={isUpdatingProfile || !isDirty}
          className="min-w-[150px] font-bold h-11 rounded-xl cursor-pointer"
        >
          {isUpdatingProfile ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
