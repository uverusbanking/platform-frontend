"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserCog } from "lucide-react";
import { ProfileForm } from "./ProfileForm";
import { useState } from "react";

interface EditProfileDialogProps {
  trigger?: React.ReactNode;
}

export function EditProfileDialog({ trigger }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground rounded-md text-left">
            <UserCog className="size-4" />
            Edit Profile
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-surface border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
          <DialogDescription className="font-medium">
            Update your personal information and account details.
          </DialogDescription>
        </DialogHeader>
        <div className="p-8 pt-4">
          <ProfileForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
