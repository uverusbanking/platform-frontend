"use client";

import { useMemo, useState } from "react";
import { formatDate } from "@/lib/formatDate";
import { AlertCircle, Key, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserStore } from "@/state/userStore";
import { useGetApiKeys } from "@/hooks/queries/useApiKeysQueries";
import { ApiKeyEnvironment, IApiKey } from "@/types/apiKeys.types";
import { CreateApiKeyDialog } from "@/components/settings/api-keys/CreateApiKeyDialog";
import { RevokeApiKeyDialog } from "@/components/settings/api-keys/RevokeApiKeyDialog";

const TableSkeletonRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-40" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-28" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-28" />
    </TableCell>
    <TableCell className="text-right">
      <Skeleton className="h-8 w-8 ml-auto rounded-md" />
    </TableCell>
  </TableRow>
);

export default function ApiKeysSettingsPage() {
  const { userData } = useUserStore();
  const { data, isLoading, isError, refetch } = useGetApiKeys();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const defaultEnvironment: ApiKeyEnvironment = userData?.view_mode || "LIVE";

  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<IApiKey | null>(null);

  const keys = useMemo(() => {
    const list = Array.isArray(data?.data) ? data?.data : [];
    return list;
  }, [data]);

  const handleRevoke = (key: IApiKey) => {
    setSelectedKey(key);
    setIsRevokeDialogOpen(true);
  };

  const handleRevoked = () => {
    setIsRevokeDialogOpen(false);
    setSelectedKey(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
          <div>
            <CardTitle className="text-lg font-bold"> API Keys</CardTitle>
            <CardDescription>
              Manage keys for accessing the API.
            </CardDescription>
          </div>
        </div>
        <Button
          className="bg-gradient-primary hover:opacity-90 shadow-fintech font-bold rounded-xl px-6"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Key className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </div>

      <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden">
        <CardContent className="pt-6">
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableSkeletonRow key={`skeleton-${index}`} />
                  ))
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <AlertCircle className="h-6 w-6 text-error" />
                        <div className="space-y-1">
                          <p className="font-semibold">
                            Unable to load API keys
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Please try again.
                          </p>
                        </div>
                        <Button variant="outline" onClick={() => refetch()}>
                          Retry
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : keys.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="p-3 rounded-xl bg-muted/30">
                          <Key className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold">No API keys yet</p>
                          <p className="text-sm text-muted-foreground">
                            Create a key to start authenticating requests.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(true)}
                        >
                          Create API Key
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  keys.map((key: IApiKey) => {
                    const prefix = key.key_prefix;
                    const createdAt = key.created_at;
                    const lastUsedAt = key.last_used_at;

                    return (
                      <TableRow
                        key={key.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <TableCell className="font-medium w-full">
                          {key.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              key.environment === "LIVE"
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-warning/10 text-warning border-warning/20"
                            }
                          >
                            {key.environment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted/50 px-3 py-1.5 rounded-md font-mono border border-border/30">
                            {prefix ? `${prefix}******` : "******"}
                          </code>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(createdAt)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {lastUsedAt ? formatDate(lastUsedAt) : "Never"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-error hover:bg-error/10"
                            onClick={() => handleRevoke(key)}
                            aria-label="Revoke API key"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CreateApiKeyDialog
        open={isCreateDialogOpen}
        defaultEnvironment={defaultEnvironment}
        onOpenChange={(open, shouldRefresh) => {
          setIsCreateDialogOpen(open);
          if (shouldRefresh) {
            refetch();
          }
        }}
      />

      <RevokeApiKeyDialog
        open={isRevokeDialogOpen}
        keyId={selectedKey?.id}
        keyName={selectedKey?.name}
        onOpenChange={(open) => {
          setIsRevokeDialogOpen(open);
          if (!open) {
            setSelectedKey(null);
          }
        }}
        onRevoked={handleRevoked}
      />
    </div>
  );
}
