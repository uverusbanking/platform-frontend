"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Copy, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getApiErrorMessage } from "@/utils/apiClient";
import { ApiKeyEnvironment } from "@/types/apiKeys.types";
import { createApiKeySchema } from "@/lib/schemas/settings/apikeys/apiKeySchema";
import { useCreateApiKey } from "@/hooks/mutations/useApiKeysMutations";

interface CreateApiKeyDialogProps {
  open: boolean;
  defaultEnvironment: ApiKeyEnvironment;
  onOpenChange: (open: boolean, shouldRefresh: boolean) => void;
}

export function CreateApiKeyDialog({
  open,
  defaultEnvironment,
  onOpenChange,
}: CreateApiKeyDialogProps) {
  const { mutateAsync: createApiKey, isPending: isCreating } =
    useCreateApiKey();

  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState<ApiKeyEnvironment>(
    defaultEnvironment || "LIVE",
  );

  const resetDialog = () => {
    setGeneratedSecret(null);
    setName("");
    setEnvironment(defaultEnvironment || "LIVE");
  };

  const closeDialog = (shouldRefresh: boolean) => {
    onOpenChange(false, shouldRefresh);
    resetDialog();
  };

  const payload = {
    name: name,
    environment: environment,
  };

  const handleCreate = async () => {
    const result = createApiKeySchema.safeParse({
      name,
      environment,
    });

    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      toast.error(firstError);
      return;
    }

    await createApiKey(payload, {
      onSuccess: (data) => {
        setGeneratedSecret(data.data.keySecret);
        setName("");
        toast.success("API key created successfully");
      },
      onError: (error) => {
        const message = getApiErrorMessage(error, "Failed to create API key");
        toast.error(message);
      },
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard", {
        icon: <CheckCircle2 className="h-4 w-4 text-success" />,
      });
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          closeDialog(Boolean(generatedSecret));
          return;
        }
        onOpenChange(true, false);
        setEnvironment(defaultEnvironment || "LIVE");
      }}
    >
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Generate a new key for secure API access.
          </DialogDescription>
        </DialogHeader>

        {!generatedSecret ? (
          <div className="space-y-6">
            <div className="space-y-2.5">
              <Label
                htmlFor="api-key-name"
                className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
              >
                Name
              </Label>
              <Input
                id="api-key-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Production Web Client"
                className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all h-11"
              />
            </div>
            <div className="space-y-2.5">
              <Label
                htmlFor="api-key-environment"
                className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
              >
                Environment
              </Label>
              <Select
                value={environment}
                onValueChange={(value) =>
                  setEnvironment(value as ApiKeyEnvironment)
                }
              >
                <SelectTrigger
                  id="api-key-environment"
                  className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all h-11"
                >
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIVE">LIVE</SelectItem>
                  <SelectItem value="SANDBOX">SANDBOX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div className="space-y-1">
                <p className="font-semibold">Copy your key now</p>
                <p className="text-sm text-muted-foreground">
                  You won&apos;t be able to see this key again.
                </p>
              </div>
            </div>
            <div className="relative">
              <code className="block w-full rounded-xl border border-border/60 bg-muted/20 px-4 py-4 pr-14 font-mono text-xs break-all">
                {generatedSecret}
              </code>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => handleCopy(generatedSecret)}
                aria-label="Copy API key"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          {generatedSecret ? (
            <Button
              onClick={() => closeDialog(true)}
              className="bg-gradient-primary hover:opacity-90 shadow-fintech font-bold"
            >
              Done
            </Button>
          ) : (
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => closeDialog(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreate}
                disabled={isCreating}
                className="bg-gradient-primary hover:opacity-90 shadow-fintech font-bold"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create API Key"
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
