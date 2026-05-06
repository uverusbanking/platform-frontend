"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTransactionDetail } from "@/hooks/queries/useTransactionQueries";
import {
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Building2,
  Hash,
  Calendar,
  Layers,
  ExternalLink,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TransactionDetailModalProps {
  transactionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailModal({
  transactionId,
  isOpen,
  onClose,
}: TransactionDetailModalProps) {
  const { data: response, isLoading } = useGetTransactionDetail(transactionId || "");
  const transaction = response?.data;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const statusIcons = {
    SUCCESSFUL: <CheckCircle2 className="w-4 h-4 text-success" />,
    FAILED: <XCircle className="w-4 h-4 text-destructive" />,
    PENDING: <Clock className="w-4 h-4 text-warning" />,
  };

  const statusStyles = {
    SUCCESSFUL: "bg-success/10 text-success border-success/20",
    FAILED: "bg-destructive/10 text-destructive border-destructive/20",
    PENDING: "bg-warning/10 text-warning border-warning/20",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl bg-surface/80 backdrop-blur-xl rounded-3xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-purple-500 to-indigo-600" />
        
        {isLoading ? (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
            <Skeleton className="h-40 w-full rounded-2xl" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          </div>
        ) : !transaction ? (
          <div className="p-12 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center">
              <Hash className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <p className="font-bold text-muted-foreground">Transaction details not found.</p>
            <Button onClick={onClose} variant="ghost">Close</Button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="p-8 pb-6 border-b border-border/40">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                    <Hash className="w-3 h-3" />
                    Reference
                  </div>
                  <div className="flex items-center gap-2 group">
                    <h2 className="text-xl font-black tracking-tight font-mono">
                      {transaction.reference}
                    </h2>
                    <button 
                      onClick={() => copyToClipboard(transaction.reference, "Reference")}
                      className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <Badge className={cn("px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border shadow-sm flex items-center gap-2", statusStyles[transaction.status])}>
                  {statusIcons[transaction.status]}
                  {transaction.status}
                </Badge>
              </div>

              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                    Amount
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tighter">
                      {transaction.currency} {parseFloat(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase",
                      transaction.type === "CREDIT" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}>
                      {transaction.type === "CREDIT" ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {transaction.type}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center justify-end gap-1.5">
                    <Calendar className="w-3 h-3" />
                    Date & Time
                  </div>
                  <div className="font-bold text-sm">
                    {new Date(transaction.createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Description */}
              <div className="space-y-3">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-primary" />
                  Description
                </div>
                <p className="text-lg font-bold leading-snug">
                  {transaction.description || "No description provided."}
                </p>
              </div>

              {/* Recipient Info (if exists) */}
              {(transaction.recipient || transaction.metadata?.recipient) && (
                <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-primary" />
                    Recipient Details
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 space-y-1">
                      <div className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider">Account Name</div>
                      <div className="font-bold truncate">{(transaction.recipient?.accountName || transaction.metadata?.recipient?.accountName) || "—"}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 space-y-1">
                      <div className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider">Account Number</div>
                      <div className="font-mono font-bold">{(transaction.recipient?.accountNumber || transaction.metadata?.recipient?.accountNumber) || "—"}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 space-y-1">
                      <div className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider">Bank Name</div>
                      <div className="font-bold">{(transaction.recipient?.bankName || transaction.metadata?.recipient?.bankName) || "—"}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 space-y-1">
                      <div className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider">Bank Code</div>
                      <div className="font-mono font-bold">{(transaction.recipient?.bankCode || transaction.metadata?.recipient?.bankCode) || "—"}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ledger Entries */}
              {transaction.ledgerEntries && transaction.ledgerEntries.length > 0 && (
                <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-1.5">
                    <Wallet className="w-3 h-3 text-primary" />
                    Ledger Breakdown
                  </div>
                  <div className="rounded-2xl border border-border/30 overflow-hidden divide-y divide-border/30">
                    {transaction.ledgerEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-4 bg-muted/5 hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            entry.type === "CREDIT" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                          )}>
                            {entry.type === "CREDIT" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold">{entry.wallet.account_name}</div>
                            <div className="text-[10px] font-mono text-muted-foreground">{entry.wallet.account_number}</div>
                          </div>
                        </div>
                        <div className={cn(
                          "font-black text-sm",
                          entry.type === "CREDIT" ? "text-success" : "text-destructive"
                        )}>
                          {entry.type === "CREDIT" ? "+" : "-"}{transaction.currency} {parseFloat(entry.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata / Raw Data Toggle (Optional) */}
              <div className="pt-4 flex justify-between items-center">
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest h-8 px-3 rounded-lg" onClick={() => console.log(transaction.metadata)}>
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View Raw Metadata
                </Button>
                <Button 
                  onClick={onClose}
                  className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] h-10 px-8 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  Close Detail
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
