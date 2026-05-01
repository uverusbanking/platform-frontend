import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTransactionDetails } from "@/hooks/queries/useTransactions";
import { formatCurrency, formatDateTime } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  ImageDown,
  FileDown,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const TransactionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<
    "dl-image" | "dl-pdf" | "share" | null
  >(null);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Skeleton Header */}
        <header className="bg-gradient-hero safe-top">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-white/10 w-9 h-9" />
              <Skeleton className="h-6 w-48 bg-white/20 rounded-md" />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6 space-y-4 max-w-2xl">
          {/* Skeleton Amount & Status Card */}
          <Card>
            <CardContent className="py-8 flex flex-col items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-9 w-40 rounded-md" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </CardContent>
          </Card>

          {/* Skeleton Detail Rows */}
          <Card>
            <CardContent className="divide-y divide-border">
              {["w-10", "w-16", "w-24", "w-20", "w-28", "w-32", "w-36"].map(
                (labelW, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-4"
                  >
                    <Skeleton className={`h-4 ${labelW} rounded`} />
                    <Skeleton className="h-4 w-28 rounded" />
                  </div>
                ),
              )}
            </CardContent>
          </Card>

          {/* Skeleton Actions */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
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

  const type = transactionData.type;
  const amount = parseFloat(transactionData.amount || "0");

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
  const fee = 0;
  const channel = "Transfer";
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

  const receiptRows = [
    {
      label: "Type",
      value: type.toLowerCase() === "credit" ? "Credit" : "Debit",
    },
    {
      label: type.toLowerCase() === "credit" ? "From" : "To",
      value: counterpartyName,
    },
    { label: "Bank", value: counterpartyBank },
    ...(counterpartyAccount
      ? [{ label: "Account", value: counterpartyAccount }]
      : []),
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
      await new Promise<void>((res) => {
        img.onload = () => res();
      });
      const pxRatio = 3;
      const widthPt = (img.naturalWidth / pxRatio) * 0.75;
      const heightPt = (img.naturalHeight / pxRatio) * 0.75;
      const pdf = new jsPDF({ unit: "pt", format: [widthPt, heightPt] });
      pdf.addImage(dataUrl, "PNG", 0, 0, widthPt, heightPt);
      const pdfBlob = pdf.output("blob");
      const link = document.createElement("a");
      link.download = `receipt-${transactionData.reference}.pdf`;
      link.href = URL.createObjectURL(pdfBlob);
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
      const file = new File(
        [blob],
        `receipt-${transactionData.reference}.png`,
        { type: "image/png" },
      );

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Transaction Receipt" });
      } else if (navigator.share) {
        await navigator.share({
          title: "Transaction Receipt",
          text: receiptText,
        });
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
      {/* Hidden receipt card — zero-size wrapper keeps it rendered but invisible */}
      <div
        style={{
          position: "absolute",
          overflow: "hidden",
          width: 0,
          height: 0,
          top: 0,
          left: 0,
        }}
      >
        <div
          ref={receiptRef}
          style={{
            width: "360px",
            background: "#ffffff",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0052FF 0%, #0040CC 100%)",
              padding: "24px 24px 40px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "13px",
                margin: "0 0 8px",
              }}
            >
              Transaction Receipt
            </p>
            <p
              style={{
                color: "#ffffff",
                fontSize: "32px",
                fontWeight: "700",
                margin: "0 0 12px",
                letterSpacing: "-0.5px",
              }}
            >
              {type.toLowerCase() === "credit" ? "+" : "-"}
              {formatCurrency(amount)}
            </p>
            <span
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.2)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "600",
                padding: "4px 12px",
                borderRadius: "20px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {mappedStatus}
            </span>
          </div>

          <div style={{ background: "#ffffff", padding: "20px 24px 8px" }}>
            {receiptRows.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <span
                  style={{ color: "#94a3b8", fontSize: "13px", flexShrink: 0 }}
                >
                  {label}
                </span>
                <span
                  style={{
                    color: "#1e293b",
                    fontSize: "13px",
                    fontWeight: "500",
                    textAlign: "right",
                    maxWidth: "60%",
                    wordBreak: "break-all",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#f8fafc",
              padding: "16px 24px",
              textAlign: "center",
              borderTop: "1px dashed #e2e8f0",
            }}
          >
            <p style={{ color: "#94a3b8", fontSize: "11px", margin: 0 }}>
              Generated from Personal Banking ·{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

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
              className={`w-16 h-16 rounded-full ${type.toLowerCase() === "credit" ? "bg-success/10" : "bg-destructive/10"} flex items-center justify-center mx-auto mb-4`}
            >
              {type.toLowerCase() === "credit" ? (
                <ArrowDownLeft size={32} className="text-success" />
              ) : (
                <ArrowUpRight size={32} className="text-destructive" />
              )}
            </div>
            <p
              className={`text-3xl font-bold mb-2 ${type.toLowerCase() === "credit" ? "text-success" : "text-foreground"}`}
            >
              {type.toLowerCase() === "credit" ? "+" : "-"}
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
                  {type.toLowerCase() === "credit" ? "From" : "To"}
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
                {formatDateTime(transactionData.date)}
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
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="gradient"
              className="w-full"
              onClick={downloadImage}
              disabled={!!isExporting}
            >
              {isExporting === "dl-image" ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <ImageDown size={18} className="mr-1" />
              )}
              Image
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={downloadPdf}
              disabled={!!isExporting}
            >
              {isExporting === "dl-pdf" ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <FileDown size={18} className="mr-1" />
              )}
              PDF
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={shareReceipt}
              disabled={!!isExporting}
            >
              {isExporting === "share" ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Share2 size={18} className="mr-1" />
              )}
              Share
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/account/transactions")}
          >
            Back to History
          </Button>

          {type.toLowerCase() === "debit" && mappedStatus === "successful" && (
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
