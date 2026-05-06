import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTransactionDetails } from "@/hooks/queries/useTransactions";
import { formatCurrency, formatDateTime } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  ImageDown,
  FileDown,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { cn } from "@/lib/utils";

const TransactionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<"dl-image" | "dl-pdf" | "share" | null>(null);

  const { data: txData, isLoading, error: fetchError } = useTransactionDetails(id || "");
  const transactionData: TransactionDetailsResponseDto | undefined = txData?.data;

  const copyReference = () => {
    if (transactionData?.reference) {
      navigator.clipboard.writeText(transactionData.reference);
      toast.success("Reference copied!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-gradient-hero safe-top">
          <div className="container mx-auto px-4 py-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10" />
              <Skeleton className="h-6 w-48 bg-white/20 rounded-xl" />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6 space-y-4 max-w-2xl">
          <div className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <Skeleton className="h-9 w-40 rounded-xl" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
          <div className="bg-card border border-border rounded-3xl p-4 space-y-1">
            {["w-10", "w-16", "w-24", "w-20", "w-28", "w-32", "w-36"].map((w, i) => (
              <div key={i} className="flex justify-between items-center py-3.5 border-b border-border last:border-0">
                <Skeleton className={`h-4 ${w} rounded-full`} />
                <Skeleton className="h-4 w-28 rounded-full" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-11 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (fetchError || !txData || !transactionData) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-gradient-hero safe-top">
          <div className="container mx-auto px-4 py-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                <ArrowLeft size={18} />
              </button>
              <h1 className="text-lg font-semibold text-white">Transaction Details</h1>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-12 text-center max-w-2xl">
          <p className="text-muted-foreground">{fetchError instanceof Error ? fetchError.message : "Transaction not found"}</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/account/transactions")}>
            View All Transactions
          </Button>
        </div>
      </div>
    );
  }

  const type = transactionData.type;
  const amount = parseFloat(transactionData.amount || "0");
  const isCredit = type.toLowerCase() === "credit";

  let mappedStatus: "successful" | "pending" | "failed" | "reversed" = "pending";
  const rawStatus = transactionData.status?.toLowerCase();
  if (rawStatus === "completed" || rawStatus === "success" || rawStatus === "successful") {
    mappedStatus = "successful";
  } else if (rawStatus === "failed") {
    mappedStatus = "failed";
  } else if (rawStatus === "reversed") {
    mappedStatus = "reversed";
  }

  const narration = transactionData.description || "Transaction";
  const fee = 0;
  const channel = "Transfer";
  const counterpartyName = transactionData.recipient?.accountName || "Unknown";
  const counterpartyBank = transactionData.recipient?.bankName || "Unknown Bank";
  const counterpartyAccount = transactionData.recipient?.accountNumber;

  const StatusIcon = { successful: CheckCircle, pending: Clock, failed: XCircle, reversed: RotateCcw }[mappedStatus];
  const statusColorClass = {
    successful: "text-success bg-success/10 border-success/20",
    pending: "text-warning bg-warning/10 border-warning/20",
    failed: "text-destructive bg-destructive/10 border-destructive/20",
    reversed: "text-muted-foreground bg-muted border-border",
  }[mappedStatus];

  const receiptRows = [
    { label: "Type", value: isCredit ? "Credit" : "Debit" },
    { label: isCredit ? "From" : "To", value: counterpartyName },
    { label: "Bank", value: counterpartyBank },
    ...(counterpartyAccount ? [{ label: "Account", value: counterpartyAccount }] : []),
    { label: "Narration", value: narration },
    { label: "Date", value: formatDateTime(transactionData.date) },
    { label: "Reference", value: transactionData.reference },
  ];

  const captureReceiptPng = async (): Promise<string> => {
    const el = receiptRef.current;
    if (!el) throw new Error("Receipt element not mounted");
    return toPng(el, { cacheBust: true, pixelRatio: 3 });
  };

  const downloadImage = async () => {
    setIsExporting("dl-image");
    try {
      const dataUrl = await captureReceiptPng();
      const link = document.createElement("a");
      link.download = `receipt-${transactionData.reference}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Receipt image downloaded!");
    } catch (err) {
      toast.error(`Failed to download image: ${(err as Error).message}`);
    } finally {
      setIsExporting(null);
    }
  };

  const downloadPdf = async () => {
    setIsExporting("dl-pdf");
    try {
      const dataUrl = await captureReceiptPng();
      const img = new Image();
      img.src = dataUrl;
      await new Promise<void>((res) => { img.onload = () => res(); });
      const pxRatio = 3;
      const widthPt = (img.naturalWidth / pxRatio) * 0.75;
      const heightPt = (img.naturalHeight / pxRatio) * 0.75;
      const pdf = new jsPDF({ unit: "pt", format: [widthPt, heightPt] });
      pdf.addImage(dataUrl, "PNG", 0, 0, widthPt, heightPt);
      const link = document.createElement("a");
      link.download = `receipt-${transactionData.reference}.pdf`;
      link.href = URL.createObjectURL(pdf.output("blob"));
      link.click();
      toast.success("Receipt PDF downloaded!");
    } catch (err) {
      toast.error(`Failed to download PDF: ${(err as Error).message}`);
    } finally {
      setIsExporting(null);
    }
  };

  const shareReceipt = async () => {
    setIsExporting("share");
    const receiptText = [
      "Transaction Receipt",
      `Amount: ${formatCurrency(amount)}`,
      `Status: ${mappedStatus}`,
      `Date: ${formatDateTime(transactionData.date)}`,
      `Type: ${type}`,
      `Reference: ${transactionData.reference}`,
    ].join("\n");

    try {
      const dataUrl = await captureReceiptPng();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `receipt-${transactionData.reference}.png`, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Transaction Receipt" });
      } else if (navigator.share) {
        await navigator.share({ title: "Transaction Receipt", text: receiptText });
      } else {
        navigator.clipboard.writeText(receiptText);
        toast.success("Receipt copied to clipboard!");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error(`Failed to share: ${(err as Error).message}`);
      }
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden receipt for export */}
      <div style={{ position: "absolute", overflow: "hidden", width: 0, height: 0, top: 0, left: 0 }}>
        <div ref={receiptRef} style={{ width: "360px", background: "#ffffff", fontFamily: "'Inter', 'Segoe UI', sans-serif", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, #0052FF 0%, #0040CC 100%)", padding: "24px 24px 40px", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", margin: "0 0 8px" }}>Transaction Receipt</p>
            <p style={{ color: "#ffffff", fontSize: "32px", fontWeight: "700", margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              {isCredit ? "+" : "-"}{formatCurrency(amount)}
            </p>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", color: "#ffffff", fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {mappedStatus}
            </span>
          </div>
          <div style={{ background: "#ffffff", padding: "20px 24px 8px" }}>
            {receiptRows.map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ color: "#94a3b8", fontSize: "13px", flexShrink: 0 }}>{label}</span>
                <span style={{ color: "#1e293b", fontSize: "13px", fontWeight: "500", textAlign: "right", maxWidth: "60%", wordBreak: "break-all" }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#f8fafc", padding: "16px 24px", textAlign: "center", borderTop: "1px dashed #e2e8f0" }}>
            <p style={{ color: "#94a3b8", fontSize: "11px", margin: 0 }}>
              Generated from Personal Banking · {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-hero safe-top">
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-lg font-semibold text-white">Transaction Details</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-4 max-w-2xl">
        {/* Amount & Status Hero */}
        <div className="bg-card border border-border rounded-3xl py-8 px-6 text-center">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
            isCredit ? "bg-success/10" : "bg-destructive/10"
          )}>
            {isCredit
              ? <ArrowDownLeft size={28} className="text-success" />
              : <ArrowUpRight size={28} className="text-destructive" />}
          </div>
          <p className={cn(
            "text-3xl font-extrabold mb-3 tracking-tight",
            isCredit ? "text-success" : "text-foreground"
          )}>
            {isCredit ? "+" : "-"}{formatCurrency(amount)}
          </p>
          <div className={cn(
            "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-medium",
            statusColorClass
          )}>
            <StatusIcon size={14} />
            <span className="capitalize">{mappedStatus}</span>
          </div>
        </div>

        {/* Detail Rows */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden divide-y divide-border">
          {[
            { label: "Type", value: isCredit ? "Credit" : "Debit" },
            { label: "Channel", value: channel },
            ...(counterpartyName ? [{ label: isCredit ? "From" : "To", value: counterpartyName }] : []),
            ...(counterpartyBank ? [{ label: "Bank", value: counterpartyBank }] : []),
            ...(counterpartyAccount ? [{ label: "Account", value: counterpartyAccount, mono: true }] : []),
            ...(narration ? [{ label: "Narration", value: narration }] : []),
            ...(fee > 0 ? [{ label: "Fee", value: formatCurrency(fee) }] : []),
            { label: "Date", value: formatDateTime(transactionData.date) },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex justify-between items-start gap-4 px-4 py-3.5">
              <span className="text-muted-foreground text-sm shrink-0">{label}</span>
              <span className={cn("text-sm font-medium text-right", mono && "font-mono")}>{value}</span>
            </div>
          ))}

          {/* Reference row with copy */}
          <div className="flex justify-between items-center gap-4 px-4 py-3.5">
            <span className="text-muted-foreground text-sm shrink-0">Reference</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-right">{transactionData.reference}</span>
              <button
                onClick={copyReference}
                className="w-7 h-7 rounded-xl hover:bg-muted flex items-center justify-center transition-colors"
              >
                <Copy size={13} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Image", key: "dl-image" as const, icon: ImageDown, onClick: downloadImage, variant: "gradient" as const },
              { label: "PDF", key: "dl-pdf" as const, icon: FileDown, onClick: downloadPdf, variant: "outline" as const },
              { label: "Share", key: "share" as const, icon: Share2, onClick: shareReceipt, variant: "outline" as const },
            ].map(({ label, key, icon: Icon, onClick, variant }) => (
              <Button key={key} variant={variant} className="w-full rounded-2xl" onClick={onClick} disabled={!!isExporting}>
                {isExporting === key
                  ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
                  : <Icon size={16} className="mr-1.5" />}
                {label}
              </Button>
            ))}
          </div>

          <Button variant="outline" className="w-full rounded-2xl" onClick={() => navigate("/account/transactions")}>
            Back to History
          </Button>

          {!isCredit && mappedStatus === "successful" && (
            <Button variant="gradient" className="w-full rounded-2xl" onClick={() => navigate("/account/send")}>
              Send Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
