"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, User, Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUserStore } from "@/state/userStore";
import { useUpdateProfile } from "@/hooks/mutations/useAccountMutations";
import { IUpdateProfilePayload } from "@/types/userAccount.types";

export default function ProfileSettingsPage() {
  const { userData } = useUserStore();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
    setValue,
  } = useForm<IUpdateProfilePayload>();

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
    <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden">
      <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your personal identifying information.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-8">
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
                  className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all h-11"
                />
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
                  className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all h-11"
                />
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
                  className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all h-11"
                />
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor="gender"
                  className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                >
                  Gender
                </Label>
                <Select
                  onValueChange={(val) => setValue("gender", val)}
                  defaultValue={userData?.gender || "MALE"}
                >
                  <SelectTrigger className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all h-11">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                  className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all h-11 font-mono"
                />
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
              className="min-w-[150px] shadow-fintech bg-gradient-primary font-bold h-11 rounded-xl"
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
      </CardContent>
    </Card>
  );
}
