"use client";

import { useState } from "react";
import { useUserStore } from "@/state/userStore";
import {
  useGetApiKeys,
  useAddApiKey,
  useDeleteApiKey,
} from "@/hooks/endpoints/useCompanyHook";
import { toast } from "sonner";
import {
  Loader2,
  Copy,
  Trash2,
  Key,
  Calendar,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/utils/apiClient";

export function DevelopersTab() {
  const queryClient = useQueryClient();
  const { userData } = useUserStore();
  const { data: apiKeys, isLoading: isLoadingKeys } = useGetApiKeys(
    userData.view_mode,
  );
  const { mutateAsync: addApiKey, isPending: isAddingKey } = useAddApiKey();
  const { mutateAsync: deleteApiKey, isPending: isDeletingKey } =
    useDeleteApiKey();

  const [newKeyName, setNewKeyName] = useState("");
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }

    try {
      const response = await addApiKey({
        name: newKeyName,
        environment: userData.view_mode,
      });

      if (response.status && response.data) {
        // Refresh keys
        queryClient.invalidateQueries({ queryKey: ["api-keys"] });

        // Store generated key to show it once
        setGeneratedKey(response.data.key);
        setNewKeyName("");
        setIsApiKeyDialogOpen(false);

        toast.success("API key generated successfully");

        // Note: We don't close the modal immediately here because
        // the user needs to copy the secret key. The "Done" button
        // in the UI handles closing the modal.
      }
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to generate API key");
      toast.error(message);
    }
  };

  const handleDeleteClick = (id: string) => {
    setKeyToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!keyToDelete) return;

    try {
      await deleteApiKey({ id: keyToDelete, environment: userData.view_mode });
      toast.success("API key revoked successfully");
      setIsDeleteDialogOpen(false);
      setKeyToDelete(null);
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to revoke API key");
      toast.error(message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", {
      icon: <CheckCircle2 className="h-4 w-4 text-success" />,
    });
  };

  return (
    <Card className="border-none shadow-2xl bg-surface/60 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-50 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-bold">API Access Keys</CardTitle>
            <Badge
              variant="outline"
              className={
                userData.view_mode === "LIVE"
                  ? "bg-success/10 text-success border-success/20 font-bold px-3 py-1 rounded-lg"
                  : "bg-warning/10 text-warning border-warning/20 font-bold px-3 py-1 rounded-lg"
              }
            >
              {userData.view_mode}
            </Badge>
          </div>
          <CardDescription className="text-sm font-medium">
            Manage institutional access keys for secure application integration
          </CardDescription>
        </div>
        <Dialog
          open={isApiKeyDialogOpen}
          onOpenChange={(open) => {
            setIsApiKeyDialogOpen(open);
            if (!open) {
              setGeneratedKey(null);
              setNewKeyName("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Key className="mr-2 h-4 w-4" />
              Generate New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] rounded-2xl overflow-hidden p-0 bg-white">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-80" />
            <DialogHeader className="pt-10 px-8">
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                Generate API Key
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground pt-2">
                Create a secure access key for the{" "}
                <span className="text-primary font-bold">
                  {userData.view_mode}
                </span>{" "}
                environment.
              </DialogDescription>
            </DialogHeader>

            {!generatedKey ? (
              <div className="px-8 py-6 space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="key-name"
                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
                  >
                    Key Identifier
                  </Label>
                  <Input
                    id="key-name"
                    placeholder="e.g. Production Web Client"
                    className="h-14 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-2xl px-6 transition-all font-medium"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground font-medium pl-1">
                    Give your key a descriptive name to track its usage across
                    institutional services.
                  </p>
                </div>
              </div>
            ) : (
              <div className="px-8 py-8 space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-3xl flex items-center justify-center mb-2 shadow-inner">
                  <ShieldCheck className="h-8 w-8 text-success" />
                </div>
                <div className="space-y-3">
                  <p className="text-lg font-bold">
                    Key Generated Successfully
                  </p>
                  <p className="text-xs text-muted-foreground px-4 font-medium leading-relaxed">
                    Please copy this key immediately. For institutional security
                    reasons, we cannot show it to you again.
                  </p>
                </div>

                <div className="relative group">
                  <code className="block p-5 rounded-2xl bg-muted/40 border-2 border-dashed border-primary/20 text-xs font-mono break-all pr-14 text-left leading-relaxed shadow-inner overflow-hidden">
                    {generatedKey}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-primary/10 transition-all rounded-xl"
                    onClick={() => copyToClipboard(generatedKey)}
                  >
                    <Copy className="h-4 w-4 text-primary" />
                  </Button>
                </div>

                <div className="flex items-start gap-3 p-4 bg-error/5 border border-error/10 rounded-2xl text-left">
                  <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="h-4 w-4 text-error" />
                  </div>
                  <p className="text-[10px] text-error/80 leading-normal font-medium">
                    Store this institutional key in an encrypted environment.
                    Never share it or commit it to internal source control.
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="bg-muted/30 px-8 py-8 sm:justify-center border-t border-border/20">
              {generatedKey ? (
                <Button
                  onClick={() => setIsApiKeyDialogOpen(false)}
                  className="w-full h-14 bg-gradient-primary shadow-fintech font-bold rounded-2xl transition-all"
                >
                  I&apos;ve Secured My Key
                </Button>
              ) : (
                <div className="flex gap-4 w-full">
                  <Button
                    variant="outline"
                    onClick={() => setIsApiKeyDialogOpen(false)}
                    className="flex-1 h-14 border-border/50 font-bold rounded-2xl transition-all hover:bg-muted/50"
                    disabled={isAddingKey}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateKey}
                    disabled={isAddingKey}
                    className="flex-1 h-14 bg-gradient-primary shadow-fintech font-bold rounded-2xl transition-all active:scale-[0.98]"
                  >
                    {isAddingKey ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Key"
                    )}
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {isLoadingKeys ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Synchronizing access keys...
            </p>
          </div>
        ) : apiKeys?.data && apiKeys.data.length > 0 ? (
          <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4">Identifier</TableHead>
                  <TableHead>Secret Key</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right pr-6">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.data.map((key) => (
                  <TableRow
                    key={key.id}
                    className="group hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-semibold text-foreground/80 py-4">
                      {key.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-[11px] bg-muted/50 px-3 py-1.5 rounded-md font-mono border border-border/30">
                          {key.key
                            ? `${key.key.substring(0, 10)}...`
                            : "••••••••••••••••••••"}
                        </code>
                        {key.key && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
                            onClick={() => copyToClipboard(key.key)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 opacity-60" />
                        {format(new Date(key.created_at), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100"
                        onClick={() => handleDeleteClick(key.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-5 border-2 border-dashed border-border/60 rounded-2xl bg-muted/5">
            <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm">
              <Key className="h-8 w-8 text-primary/50" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold">No API keys found</h3>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                Generate an API key to start authenticating your requests in the{" "}
                <span className="font-semibold text-primary">
                  {userData.view_mode.toLowerCase()}
                </span>{" "}
                environment.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsApiKeyDialogOpen(true)}
            >
              Get Started
            </Button>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently revoke the API
              key and any applications using it will lose access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingKey}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingKey}
            >
              {isDeletingKey ? (
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
    </Card>
  );
}
