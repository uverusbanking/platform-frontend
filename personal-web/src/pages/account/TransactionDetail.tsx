import { useNavigate, useParams } from "react-router-dom";
import { useTransactionDetails } from "@/hooks/queries/useTransactions";
import { formatCurrency, formatDateTime } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TransactionDetailsResponseDto } from "@/types";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  Share2,
  Download,
} from "lucide-react";
import { toast } from "sonner";

const TransactionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: txData,
    isLoading,
    error: fetchError,
  } = useTransactionDetails(id || "");

  const transactionData: TransactionDetailsResponseDto | undefined =
    txData?.data;

  const copyReference = () => {
    if (transactionData?.reference) {
      navigator.clipboard.writeText(transactionData.reference);
      toast.success("Reference copied!");
    }
  };

  const shareReceipt = async () => {
    if (!transactionData) return;

    const receiptText = `
Transaction Receipt
-------------------
Amount: ${formatCurrency(amount)}
Status: ${mappedStatus.toUpperCase()}
Date: ${formatDateTime(transactionData.createdAt)}
Type: ${type.toUpperCase()}
Recipient: ${counterpartyName}
Bank: ${counterpartyBank}
Reference: ${transactionData.reference}
Description: ${narration}
-------------------
Generated from Personal Banking
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Transaction Receipt",
          text: receiptText,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyReference();
          toast.success("Receipt details copied to clipboard!");
        }
      }
    } else {
      navigator.clipboard.writeText(receiptText);
      toast.success("Receipt details copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading details...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !txData || !transactionData) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-gradient-hero safe-top">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold text-white">
                Transaction Details
              </h1>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">
            {fetchError instanceof Error
              ? fetchError.message
              : "Transaction not found"}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/account/transactions")}
          >
            View All Transactions
          </Button>
        </div>
      </div>
    );
  }

  // Map Ledger Entry Data
  const type = transactionData.type === "WALLET_FUNDING" ? "credit" : "debit";
  const amount = parseFloat(transactionData.amount || "0");

  // Map status
  let mappedStatus: "successful" | "pending" | "failed" | "reversed" =
    "pending";
  const rawStatus = transactionData.status?.toLowerCase();

  if (
    rawStatus === "completed" ||
    rawStatus === "success" ||
    rawStatus === "successful"
  ) {
    mappedStatus = "successful";
  } else if (rawStatus === "failed") {
    mappedStatus = "failed";
  } else if (rawStatus === "reversed") {
    mappedStatus = "reversed";
  }

  const narration = transactionData.description || "Transaction";
  const fee = 0; // Fee not available in current structure
  const channel = "Transfer"; // Channel not available in current structure

  // Counterparty info
  const counterpartyName = transactionData.recipient?.accountName || "Unknown";
  const counterpartyBank =
    transactionData.recipient?.bankName || "Unknown Bank";
  const counterpartyAccount = transactionData.recipient?.accountNumber;

  const StatusIcon = {
    successful: CheckCircle,
    pending: Clock,
    failed: XCircle,
    reversed: RotateCcw,
  }[mappedStatus];

  const statusColor = {
    successful: "text-success bg-success/10",
    pending: "text-warning bg-warning/10",
    failed: "text-destructive bg-destructive/10",
    reversed: "text-muted-foreground bg-muted",
  }[mappedStatus];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero safe-top">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold text-white">
              Transaction Details
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-4 max-w-2xl">
        {/* Amount & Status Card */}
        <Card>
          <CardContent className="py-8 text-center">
            <div
              className={`w-16 h-16 rounded-full ${
                type === "credit" ? "bg-success/10" : "bg-destructive/10"
              } flex items-center justify-center mx-auto mb-4`}
            >
              {type === "credit" ? (
                <ArrowDownLeft size={32} className="text-success" />
              ) : (
                <ArrowUpRight size={32} className="text-destructive" />
              )}
            </div>

            <p
              className={`text-3xl font-bold mb-2 ${
                type === "credit" ? "text-success" : "text-foreground"
              }`}
            >
              {type === "credit" ? "+" : "-"}
              {formatCurrency(amount)}
            </p>

            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusColor}`}
            >
              <StatusIcon size={16} />
              <span className="text-sm font-medium capitalize">
                {mappedStatus}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card>
          <CardContent className="divide-y divide-border">
            <div className="flex justify-between py-4">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium capitalize">{type}</span>
            </div>

            <div className="flex justify-between py-4">
              <span className="text-muted-foreground">Channel</span>
              <span className="font-medium capitalize">
                {channel.replace("_", " ")}
              </span>
            </div>

            {counterpartyName && (
              <div className="flex justify-between py-4">
                <span className="text-muted-foreground">
                  {type === "credit" ? "From" : "To"}
                </span>
                <span className="font-medium">{counterpartyName}</span>
              </div>
            )}

            {counterpartyBank && (
              <div className="flex justify-between py-4">
                <span className="text-muted-foreground">Bank</span>
                <span className="font-medium">{counterpartyBank}</span>
              </div>
            )}

            {counterpartyAccount && (
              <div className="flex justify-between py-4">
                <span className="text-muted-foreground">Account</span>
                <span className="font-medium font-mono">
                  {counterpartyAccount}
                </span>
              </div>
            )}

            {narration && (
              <div className="flex justify-between py-4">
                <span className="text-muted-foreground">Narration</span>
                <span className="font-medium text-right max-w-[60%]">
                  {narration}
                </span>
              </div>
            )}

            {fee > 0 && (
              <div className="flex justify-between py-4">
                <span className="text-muted-foreground">Fee</span>
                <span className="font-medium">{formatCurrency(fee)}</span>
              </div>
            )}

            <div className="flex justify-between py-4">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                {formatDateTime(transactionData.createdAt)}
              </span>
            </div>

            <div className="flex justify-between items-center py-4">
              <span className="text-muted-foreground">Reference</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">
                  {transactionData.reference}
                </span>
                <button
                  onClick={copyReference}
                  className="p-1.5 rounded hover:bg-muted transition-colors"
                >
                  <Copy size={14} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="gradient" className="w-full" onClick={shareReceipt}>
            <Share2 size={18} className="mr-2" />
            Share Receipt
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/account/transactions")}
          >
            Back to History
          </Button>
          {type === "debit" && mappedStatus === "successful" && (
            <Button
              variant="gradient"
              className="w-full"
              onClick={() => navigate("/account/send")}
            >
              Send Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
