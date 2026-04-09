"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/utils/apiClient";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDeleteApiKey } from "@/hooks/mutations/useApiKeysMutations";

interface RevokeApiKeyDialogProps {
  open: boolean;
  keyId?: string | null;
  keyName?: string | null;
  onOpenChange: (open: boolean) => void;
  onRevoked: () => void;
}

export function RevokeApiKeyDialog({
  open,
  keyId,
  keyName,
  onOpenChange,
  onRevoked,
}: RevokeApiKeyDialogProps) {
  const [name, setName] = useState<string>("");
  const { mutateAsync: deleteApiKey, isPending: isDeleting } =
    useDeleteApiKey();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setName("");
    }
    onOpenChange(nextOpen);
  };

  const normalized = (s: string) => s.trim();

  const canRevoke =
    !!keyId &&
    !!keyName &&
    !isDeleting &&
    normalized(name) === normalized(keyName);

  const confirmRevoke = async () => {
    if (!keyId || !keyName) return;

    try {
      await deleteApiKey(keyId);
      setName("");
      toast.success("API key revoked successfully");
      onRevoked();
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to revoke API key");
      toast.error(message);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke API key?</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately disable the key and revoke access for any
            integrations using it.
            <span className="block font-semibold mt-4">
              To confirm, type {`"${keyName}"`} in the box below
            </span>
            <Input
              id="api-key-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-red-500 hover:border-red-500 focus:border-red-500"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              confirmRevoke();
            }}
            disabled={!canRevoke}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Revoking...
              </>
            ) : (
              "Revoke Key"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
