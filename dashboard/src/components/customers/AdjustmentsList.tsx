"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { getAdjustments } from "@/hooks/endpoints/useWallet";
import { IAdjustment, AdjustmentType } from "@/types/adjustment.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AdjustmentsListProps {
  walletId: string;
}

const ADJUSTMENT_LABELS: Record<AdjustmentType, string> = {
  EXTERNAL_DEBIT: "External Debit",
  EXTERNAL_CREDIT: "External Credit",
  FEE: "Fee",
  CORRECTION: "Correction",
  REVERSAL: "Reversal",
};

function AdjustmentTypeBadge({ type }: { type: AdjustmentType | null }) {
  if (!type) return <span className="text-muted-foreground">—</span>;
  const variants: Record<AdjustmentType, string> = {
    EXTERNAL_DEBIT: "bg-orange-100 text-orange-700 border-orange-200",
    EXTERNAL_CREDIT: "bg-emerald-100 text-emerald-700 border-emerald-200",
    FEE: "bg-yellow-100 text-yellow-700 border-yellow-200",
    CORRECTION: "bg-blue-100 text-blue-700 border-blue-200",
    REVERSAL: "bg-purple-100 text-purple-700 border-purple-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[type]}`}
    >
      {ADJUSTMENT_LABELS[type]}
    </span>
  );
}

function DirectionBadge({
  direction,
}: {
  direction: "CREDIT" | "DEBIT" | null;
}) {
  if (!direction) return <span className="text-muted-foreground">—</span>;
  return (
    <Badge
      variant="outline"
      className={
        direction === "CREDIT"
          ? "border-emerald-500 text-emerald-600"
          : "border-destructive text-destructive"
      }
    >
      {direction}
    </Badge>
  );
}

function AdjustmentRow({ item }: { item: IAdjustment }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b hover:bg-muted/30 cursor-pointer"
        onClick={() => setExpanded((p) => !p)}
      >
        <td className="px-4 py-3">
          <AdjustmentTypeBadge type={item.adjustment_type} />
        </td>
        <td className="px-4 py-3">
          <DirectionBadge direction={item.direction} />
        </td>
        <td className="px-4 py-3 font-mono text-sm">
          {item.amount ? `₦${Number(item.amount).toLocaleString()}` : "—"}
        </td>
        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
          {item.balance_before
            ? `₦${Number(item.balance_before).toLocaleString()}`
            : "—"}
          {" → "}
          {item.balance_after
            ? `₦${Number(item.balance_after).toLocaleString()}`
            : "—"}
        </td>
        <td className="px-4 py-3 text-sm max-w-[200px] truncate">
          {item.narration ?? "—"}
        </td>
        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
          {item.effective_at
            ? new Date(item.effective_at).toLocaleDateString()
            : new Date(item.created_at).toLocaleDateString()}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-muted/20 border-b">
          <td colSpan={6} className="px-4 py-3">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">
              <div>
                <span className="text-muted-foreground">Reference: </span>
                <span className="font-mono">{item.reference}</span>
              </div>
              {item.provider_reference && (
                <div>
                  <span className="text-muted-foreground">Provider Ref: </span>
                  <span className="font-mono">{item.provider_reference}</span>
                </div>
              )}
              {item.fee_type && (
                <div>
                  <span className="text-muted-foreground">Fee Type: </span>
                  <span>{item.fee_type.replace(/_/g, " ")}</span>
                </div>
              )}
              {item.correction_reason && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Reason: </span>
                  <span>{item.correction_reason}</span>
                </div>
              )}
              {item.original_reference && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Original Ref: </span>
                  <span className="font-mono">{item.original_reference}</span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Recorded: </span>
                <span>{new Date(item.created_at).toLocaleString()}</span>
              </div>
              {item.effective_at && (
                <div>
                  <span className="text-muted-foreground">Effective: </span>
                  <span>{new Date(item.effective_at).toLocaleString()}</span>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function AdjustmentsList({ walletId }: AdjustmentsListProps) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.ADJUSTMENTS, walletId, page],
    queryFn: () => getAdjustments(walletId, { page, limit }),
  });

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground py-4 text-center">
        Loading adjustments...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-destructive py-4 text-center">
        Failed to load adjustments.
      </div>
    );
  }

  const items = data?.data ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Ledger Adjustments
        </h3>
        {total > 0 && (
          <span className="text-xs text-muted-foreground">{total} total</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground py-6 text-center border rounded-md">
          No ledger adjustments have been made to this wallet.
        </div>
      ) : (
        <>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Direction</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Balance</th>
                  <th className="px-4 py-2 text-left">Narration</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <AdjustmentRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">
                Page {page} of {pages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
