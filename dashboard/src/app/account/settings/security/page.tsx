"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Lock, Shield, CheckCircle2 } from "lucide-react";

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

import { useChangePassword } from "@/hooks/mutations/useAccountMutations";
import { IChangePasswordPayload } from "@/types/userAccount.types";

export default function SecuritySettingsPage() {
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword();

  const { register, handleSubmit, reset } = useForm<IChangePasswordPayload>();

  const onSubmit = (data: IChangePasswordPayload) => {
    if (data.new_password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    changePassword(data, {
      onSuccess: () => {
        toast.success("Password changed successfully");
        reset();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to change password");
      },
    });
  };

  return (
    <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden group">
      <CardHeader className="border-b border-border/40 bg-muted/20 pb-6 transition-colors group-hover:bg-red-500/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-500/10 text-red-600">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Security</CardTitle>
            <CardDescription>
              Manage your password and account security.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2.5">
              <Label
                htmlFor="old_password"
                className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
              >
                Current Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground/60" />
                <Input
                  id="old_password"
                  type="password"
                  {...register("old_password", { required: true })}
                  className="pl-10 bg-muted/30 border-transparent focus:border-red-500/20 focus:bg-background transition-all h-11"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="space-y-2.5">
              <Label
                htmlFor="new_password"
                className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
              >
                New Password
              </Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground/60" />
                <Input
                  id="new_password"
                  type="password"
                  {...register("new_password", {
                    required: true,
                    minLength: 8,
                  })}
                  className="pl-10 bg-muted/30 border-transparent focus:border-red-500/20 focus:bg-background transition-all h-11"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-2">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                Must be at least 8 characters long
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/40">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="min-w-[150px] shadow-sm bg-background border border-border hover:bg-muted font-bold h-11 rounded-xl text-foreground"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
