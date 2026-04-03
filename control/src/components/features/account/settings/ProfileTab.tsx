"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "./ProfileForm";
import { User } from "lucide-react";

export function ProfileTab() {
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
        <ProfileForm />
      </CardContent>
    </Card>
  );
}
