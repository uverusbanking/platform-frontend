"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Lock, ShieldCheck } from "lucide-react";

export function SecurityTab() {
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  return (
    <Card className="border-none shadow-2xl bg-surface/60 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-50 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="pb-8">
        <CardTitle className="text-xl font-bold">Security Settings</CardTitle>
        <CardDescription className="text-sm font-medium">
          Manage your administrative password and account protection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Change Password</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 transition-all font-medium"
              />
            </div>
            <div className="space-y-2 md:col-start-1">
              <Label
                htmlFor="newPassword"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 transition-all font-medium"
              />
            </div>
          </div>
          <Button className="h-12 bg-gradient-primary hover:opacity-90 shadow-fintech font-bold rounded-xl transition-all active:scale-[0.98]">
            Update Secure Password
          </Button>
        </div>

        <Separator className="bg-border/30" />

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            <h3 className="text-lg font-bold">Multi-Factor Authentication</h3>
          </div>
          <div className="flex items-center justify-between p-6 bg-muted/20 border border-border/30 rounded-2xl transition-all hover:bg-muted/30">
            <div className="space-y-1">
              <Label className="text-sm font-bold">Enable 2FA Protection</Label>
              <p className="text-xs text-muted-foreground font-medium">
                Add an institutional layer of security to your administrative
                account
              </p>
            </div>
            <Switch
              checked={twoFactorAuth}
              onCheckedChange={setTwoFactorAuth}
              className="data-[state=checked]:bg-success"
            />
          </div>

          {twoFactorAuth && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <Button
                variant="outline"
                className="h-12 border-primary/30 text-primary font-bold hover:bg-primary/5 rounded-xl transition-all"
              >
                Configure 2FA Provider
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
