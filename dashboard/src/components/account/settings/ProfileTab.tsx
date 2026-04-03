"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUserStore } from "@/state/userStore";
import { useUpdateProfile } from "@/hooks/endpoints/useAccountHook";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { profileSchema } from "@/lib/schemas/profile/profile.schema";
import { Gender } from "@/types/enums";

const ProfileSchema = profileSchema;

type ProfileValues = z.infer<typeof ProfileSchema>;

const resolveGender = (value?: string): Gender | undefined => {
  if (
    value === Gender.MALE ||
    value === Gender.FEMALE ||
    value === Gender.OTHER
  ) {
    return value;
  }
  return undefined;
};

export function ProfileTab() {
  const { userData } = useUserStore();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      middle_name: userData.middle_name || "",
      phone_number: userData.phone_number || "",
      gender: resolveGender(userData.gender) ?? Gender.MALE,
    },
  });

  useEffect(() => {
    if (userData) {
      profileForm.reset({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        middle_name: userData.middle_name || "",
        phone_number: userData.phone_number || "",
        gender: resolveGender(userData.gender) ?? Gender.MALE,
      });
    }
  }, [userData, profileForm]);

  const onProfileSubmit = async (data: ProfileValues) => {
    try {
      await updateProfile(data, {
        onSuccess: () => {
          toast.success("Profile updated successfully");
        },
        onError: (error: unknown) => {
          const errMsg =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to update profile";
          toast.error(errMsg);
        },
      });
    } catch {
      // Error handled by mutation onError
    }
  };

  return (
    <Card className="border-none shadow-2xl bg-surface/60 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-50 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="pb-8">
        <CardTitle className="text-xl font-bold">Profile Information</CardTitle>
        <CardDescription className="text-sm font-medium">
          Update your administrative credentials and personal details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={profileForm.handleSubmit(onProfileSubmit)}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="first_name"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                First Name
              </Label>
              <Input
                id="first_name"
                placeholder="John"
                {...profileForm.register("first_name")}
                className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 transition-all font-medium"
              />
              {profileForm.formState.errors.first_name && (
                <p className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <span className="w-1 h-1 rounded-full bg-error" />
                  {profileForm.formState.errors.first_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="last_name"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Last Name
              </Label>
              <Input
                id="last_name"
                placeholder="Doe"
                {...profileForm.register("last_name")}
                className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 transition-all font-medium"
              />
              {profileForm.formState.errors.last_name && (
                <p className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <span className="w-1 h-1 rounded-full bg-error" />
                  {profileForm.formState.errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="middle_name"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Middle Name (Optional)
              </Label>
              <Input
                id="middle_name"
                placeholder="Michael"
                {...profileForm.register("middle_name")}
                className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="gender"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Gender
              </Label>
              <Controller
                name="gender"
                control={profileForm.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="gender"
                      className="h-12 bg-muted/30 border-border/40 focus:ring-primary/10 rounded-xl px-4 transition-all font-medium"
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface/90 backdrop-blur-xl border-border/40 rounded-xl">
                      <SelectItem value="MALE" className="rounded-lg">
                        Male
                      </SelectItem>
                      <SelectItem value="FEMALE" className="rounded-lg">
                        Female
                      </SelectItem>
                      <SelectItem value="OTHER" className="rounded-lg">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {profileForm.formState.errors.gender && (
                <p className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <span className="w-1 h-1 rounded-full bg-error" />
                  {profileForm.formState.errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Email Address (Read-only)
              </Label>
              <Input
                id="email"
                type="email"
                value={userData.email || ""}
                readOnly
                disabled
                className="h-12 bg-muted/20 border-border/30 rounded-xl px-4 font-medium opacity-60 text-muted-foreground cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="phone_number"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Phone Number
              </Label>
              <Input
                id="phone_number"
                placeholder="+234 800 000 0000"
                {...profileForm.register("phone_number")}
                className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 transition-all font-medium"
              />
              {profileForm.formState.errors.phone_number && (
                <p className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <span className="w-1 h-1 rounded-full bg-error" />
                  {profileForm.formState.errors.phone_number.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="px-8 h-12 bg-gradient-primary hover:opacity-90 shadow-fintech font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Synchronizing...
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
