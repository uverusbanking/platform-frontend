"use client";

import { useState } from "react";
import { Loader2, Unlock, UnlockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGetHeldTransactions } from "@/hooks/queries/useWalletQueries";
import {
  useReleaseSingleHeldTransaction,
  useReleaseAllHeldTransactions,
} from "@/hooks/mutations/useWalletMutations";
import { getApiErrorMessage } from "@/utils/apiClient";

interface HeldTransactionsListProps {
  walletId: string;
}

export function HeldTransactionsList({ walletId }: HeldTransactionsListProps) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetHeldTransactions(
    walletId,
    page,
    limit,
  );

  const { mutate: releaseSingle, isPending: isReleasingSingle } =
    useReleaseSingleHeldTransaction();
  const { mutate: releaseAll, isPending: isReleasingAll } =
    useReleaseAllHeldTransactions();

  const handleReleaseSingle = (transactionId: string) => {
    releaseSingle(
      { walletId, transactionId },
      {
        onSuccess: () => {
          toast.success("Transaction released successfully");
        },
        onError: (error) => {
          const message = getApiErrorMessage(
            error,
            "Failed to release transaction",
          );
          toast.error(message);
        },
      },
    );
  };

  const handleReleaseAll = () => {
    releaseAll(
      { walletId },
      {
        onSuccess: () => {
          toast.success("All held transactions released successfully");
          setPage(1);
        },
        onError: (error) => {
          const message = getApiErrorMessage(
            error,
            "Failed to release all transactions",
          );
          toast.error(message);
        },
      },
    );
  };

  const formatAmount = (metadata: { amount?: string | number }) => {
    const raw = metadata?.amount;
    if (raw == null) return "---";
    const num = Number(raw);
    if (isNaN(num)) return String(raw);
    return `₦${num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const transactions = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-lg font-black tracking-tight text-foreground">
            Held Transactions
          </h3>
          <p className="text-xs font-medium text-muted-foreground/60">
            Incoming deposits held due to funding freeze
            {meta ? ` — ${meta.total} total` : ""}
          </p>
        </div>

        {transactions.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 font-bold border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                disabled={isReleasingAll || isFetching}
              >
                {isReleasingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UnlockKeyhole className="w-4 h-4" />
                )}
                Release All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Release all held transactions?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will credit all{" "}
                  <span className="font-bold">{meta?.total ?? "held"}</span>{" "}
                  transaction(s) to the wallet balance immediately. The wallet
                  will remain frozen — only the held funds are released.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReleaseAll}>
                  Release All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-black text-[11px] uppercase tracking-widest text-foreground/60">
                Date
              </TableHead>
              <TableHead className="font-black text-[11px] uppercase tracking-widest text-foreground/60">
                Amount
              </TableHead>
              <TableHead className="font-black text-[11px] uppercase tracking-widest text-foreground/60">
                Reference
              </TableHead>
              <TableHead className="font-black text-[11px] uppercase tracking-widest text-foreground/60">
                Description
              </TableHead>
              <TableHead className="font-black text-[11px] uppercase tracking-widest text-foreground/60">
                Status
              </TableHead>
              <TableHead className="font-black text-[11px] uppercase tracking-widest text-foreground/60 text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-sm font-semibold text-muted-foreground/50"
                >
                  No held transactions found for this wallet.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((trx) => (
                <TableRow key={trx.id} className="hover:bg-muted/20">
                  <TableCell className="text-sm font-semibold text-foreground/80">
                    {formatDate(trx.created_at)}
                  </TableCell>
                  <TableCell className="text-sm font-bold text-foreground">
                    {formatAmount(trx.metadata)}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground/70">
                    {trx.reference || "---"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground/70 max-w-[180px] truncate">
                    {trx.description || "---"}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-black text-[10px] uppercase">
                      Held
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 font-bold text-xs border-success/30 text-success hover:bg-success/5 hover:text-success"
                      disabled={isReleasingSingle || isReleasingAll}
                      onClick={() => handleReleaseSingle(trx.id)}
                    >
                      {isReleasingSingle ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Unlock className="w-3 h-3" />
                      )}
                      Release
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs font-semibold text-muted-foreground/60">
            Page {meta?.page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="font-bold text-xs"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="font-bold text-xs"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
