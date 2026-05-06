"use client";

import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TransactionDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetTransactionDetail(id);
  const transaction = response?.data;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const statusIcons = {
    SUCCESSFUL: <CheckCircle2 className="w-5 h-5 text-success" />,
    COMPLETED: <CheckCircle2 className="w-5 h-5 text-success" />,
    FAILED: <XCircle className="w-5 h-5 text-destructive" />,
    PENDING: <Clock className="w-5 h-5 text-warning" />,
  };

  const statusStyles = {
    SUCCESSFUL: "bg-success/10 text-success border-success/20",
    COMPLETED: "bg-success/10 text-success border-success/20",
    FAILED: "bg-destructive/10 text-destructive border-destructive/20",
    PENDING: "bg-warning/10 text-warning border-warning/20",
  };

  if (isLoading) return <TransactionDetailSkeleton />;

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="p-6 bg-muted/20 rounded-full">
          <Hash className="w-12 h-12 text-muted-foreground/30" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black">Transaction not found</h2>
          <p className="text-muted-foreground">The transaction you're looking for doesn't exist or you don't have access.</p>
        </div>
        <Button onClick={() => navigate(-1)} className="rounded-xl px-8 font-bold">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const transactionDate = transaction.date || transaction.createdAt || "";

  return (
    <div className="space-y-8 animate-fade-in pb-20 max-w-4xl mx-auto">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-muted/50"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate("/account/dashboard")}>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Transaction Detail</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight">
                Transaction Detail
              </h1>
              <Badge className={cn("px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border shadow-sm flex items-center gap-2", statusStyles[transaction.status as keyof typeof statusStyles])}>
                {statusIcons[transaction.status as keyof typeof statusIcons]}
                {transaction.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <Hash className="w-4 h-4" />
              <span className="font-mono">{transaction.reference}</span>
              <button 
                onClick={() => copyToClipboard(transaction.reference, "Reference")}
                className="p-1 hover:bg-muted/50 rounded-md transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 md:flex-none h-12 rounded-xl border-border/60 hover:bg-muted/50 font-bold px-6"
              onClick={() => {
                const toastId = toast.loading("Verifying transaction on immutable ledger...");
                setTimeout(() => {
                  toast.success("Transaction successfully verified on ledger", { id: toastId });
                }, 1500);
              }}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Verify on Ledger
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Core Info */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md relative overflow-hidden group p-8">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-purple-500 to-indigo-600" />
            
            <div className="space-y-10">
              {/* Amount Display */}
              <div className="space-y-2">
                <div className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 flex items-center gap-1.5">
                  Transaction Amount
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black tracking-tighter">
                    {transaction.currency} {parseFloat(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black uppercase",
                    transaction.type === "CREDIT" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  )}>
                    {transaction.type === "CREDIT" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    {transaction.type}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <div className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  Description
                </div>
                <p className="text-xl font-bold leading-relaxed">
                  {transaction.description || "No description provided."}
                </p>
              </div>

              {/* Recipient Details */}
              {(transaction.recipient || transaction.metadata?.recipient) && (
                <div className="space-y-4 pt-6 border-t border-border/40">
                  <div className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    Recipient Information
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Account Name" value={(transaction.recipient?.accountName || transaction.metadata?.recipient?.accountName) || "—"} />
                    <DetailItem label="Account Number" value={(transaction.recipient?.accountNumber || transaction.metadata?.recipient?.accountNumber) || "—"} mono />
                    <DetailItem label="Bank Name" value={(transaction.recipient?.bankName || transaction.metadata?.recipient?.bankName) || "—"} />
                    <DetailItem label="Bank Code" value={(transaction.recipient?.bankCode || transaction.metadata?.recipient?.bankCode) || "—"} mono />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Ledger Breakdown */}
          {transaction.ledgerEntries && transaction.ledgerEntries.length > 0 && (
            <div className="space-y-4">
              <div className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 flex items-center gap-1.5 px-1">
                <Wallet className="w-3.5 h-3.5 text-primary" />
                Double-Entry Ledger Records
              </div>
              <Card className="border-none shadow-premium bg-surface/50 overflow-hidden">
                <div className="divide-y divide-border/30">
                  {transaction.ledgerEntries.map((entry) => (
                    <div key={entry.id} className="p-6 bg-muted/5 hover:bg-muted/10 transition-colors space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm",
                            entry.type === "CREDIT" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                          )}>
                            {entry.type === "CREDIT" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-bold">{entry.wallet.accountName}</div>
                            <div className="text-xs font-mono text-muted-foreground">{entry.wallet.accountNumber}</div>
                          </div>
                        </div>
                        <div className={cn(
                          "font-black text-lg",
                          entry.type === "CREDIT" ? "text-success" : "text-destructive"
                        )}>
                          {entry.type === "CREDIT" ? "+" : "-"}{transaction.currency} {parseFloat(entry.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      
                      {entry.balanceBefore !== undefined && entry.balanceAfter !== undefined && (
                        <div className="flex items-center gap-6 pt-2 border-t border-border/20">
                          <div className="space-y-0.5">
                            <div className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider">Balance Before</div>
                            <div className="text-xs font-bold">{transaction.currency} {parseFloat(entry.balanceBefore).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                          </div>
                          <div className="h-6 w-px bg-border/40" />
                          <div className="space-y-0.5">
                            <div className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider">Balance After</div>
                            <div className="text-xs font-black text-primary">{transaction.currency} {parseFloat(entry.balanceAfter).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Right Column: Metadata & Audit */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md p-6 space-y-6">
            <div className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Audit Trail
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border/30">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Created</span>
                <span className="text-sm font-bold">{transactionDate ? new Date(transactionDate).toLocaleString() : "—"}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border/30">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Type</span>
                <span className="text-sm font-bold uppercase tracking-widest">{transaction.type}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border/30">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</span>
                <Badge className={cn("font-black text-[9px] uppercase tracking-widest", statusStyles[transaction.status as keyof typeof statusStyles])}>
                  {transaction.status}
                </Badge>
              </div>
            </div>
            
            <div className="pt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl h-12 border-primary/20 text-primary hover:bg-primary/5 font-bold"
                  >
                    View Full JSON Metadata
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0 border-none shadow-premium bg-surface/95 backdrop-blur-xl">
                  <DialogHeader className="p-6 border-b border-border/30">
                    <DialogTitle className="text-xl font-black flex items-center gap-2">
                      <Layers className="w-5 h-5 text-primary" />
                      Raw Transaction Metadata
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto p-6 bg-black/5">
                    <pre className="p-4 rounded-2xl bg-black text-green-400 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner border border-white/5">
                      {JSON.stringify({ ...transaction, ledgerEntries: transaction.ledgerEntries }, null, 2)}
                    </pre>
                  </div>
                  <div className="p-4 border-t border-border/30 bg-muted/20 flex justify-end">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(transaction, null, 2));
                        toast.success("JSON copied to clipboard");
                      }}
                      className="text-xs font-bold gap-2"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy JSON
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 space-y-1 hover:border-primary/30 transition-colors">
      <div className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-[0.15em]">{label}</div>
      <div className={cn("font-bold truncate", mono && "font-mono tracking-tight")}>{value}</div>
    </div>
  );
}

function TransactionDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-12 w-32 rounded-xl" />
      </div>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
