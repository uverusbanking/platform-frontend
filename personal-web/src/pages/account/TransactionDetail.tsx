import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTransactionDetails } from "@/hooks/queries/useTransactions";
import { formatCurrency, formatDateTime } from "@/lib/currency";
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
import { AppLayout } from "@/components/AppLayout";
import { cn } from "@/lib/utils";

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
      <AppLayout>
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center gap-3 mb-7">
            <Skeleton className="w-10 h-10 rounded-pill shrink-0" />
            <Skeleton className="h-5 w-48 rounded-pill" />
          </div>
          <div
            className="rounded-2xl p-7 space-y-4"
            style={{
              background: "rgb(var(--surface-highest))",
              border: "1px solid rgb(var(--surface-high))",
            }}
          >
            <Skeleton className="w-16 h-16 rounded-pill mx-auto" />
            <Skeleton className="h-10 w-40 rounded-xl mx-auto" />
            <Skeleton className="h-7 w-28 rounded-pill mx-auto" />
          </div>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgb(var(--surface-highest))",
              border: "1px solid rgb(var(--surface-high))",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex justify-between items-center px-5 py-3.5"
                style={{ borderBottom: "1px solid rgb(var(--surface-high))" }}
              >
                <Skeleton className="h-3.5 w-20 rounded-pill" />
                <Skeleton className="h-3.5 w-32 rounded-pill" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-11 rounded-pill" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (fetchError || !txData || !transactionData) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-7">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-pill flex items-center justify-center transition-colors"
              style={{
                background: "rgb(var(--surface-highest))",
                border: "1px solid rgb(var(--surface-high))",
              }}
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <p className="eyebrow mb-0.5">Transaction</p>
              <h1 className="display text-2xl m-0 leading-none">Details</h1>
            </div>
          </div>
          <div
            className="rounded-2xl py-16 px-6 text-center"
            style={{
              background: "rgb(var(--surface-highest))",
              border: "1px solid rgb(var(--surface-high))",
            }}
          >
            <p className="text-sm text-foreground-subtle mb-4">
              {fetchError instanceof Error
                ? fetchError.message
                : "Transaction not found"}
            </p>
            <button
              onClick={() => navigate("/account/transactions")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-semibold bg-foreground text-surface-highest"
            >
              View All Transactions
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const type = transactionData.type;
  const amount = parseFloat(transactionData.amount || "0");
  const isCredit = type.toLowerCase() === "credit";

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
    successful: "rgb(var(--mint-deep))",
    pending: "rgb(var(--warning))",
    failed: "rgb(var(--error))",
    reversed: "rgb(var(--foreground-subtle))",
  }[mappedStatus];

  const receiptRows = [
    { label: "Type", value: isCredit ? "Credit" : "Debit" },
    { label: isCredit ? "From" : "To", value: counterpartyName },
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
    <AppLayout>
      {/* Hidden receipt div — used by html-to-image export; must stay mounted */}
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
              background: "#1a1512",
              padding: "24px 24px 40px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: "-40px",
                top: "-40px",
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                background: "#FF3B30",
                opacity: 0.4,
                filter: "blur(50px)",
              }}
            />
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "13px",
                margin: "0 0 8px",
                position: "relative",
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
                position: "relative",
              }}
            >
              {isCredit ? "+" : "-"}
              {formatCurrency(amount)}
            </p>
            <span
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.15)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "600",
                padding: "4px 12px",
                borderRadius: "999px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                position: "relative",
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
                  borderBottom: "1px solid #f4efe8",
                }}
              >
                <span
                  style={{ color: "#9e9287", fontSize: "13px", flexShrink: 0 }}
                >
                  {label}
                </span>
                <span
                  style={{
                    color: "#1a1512",
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
              background: "#f9f5f0",
              padding: "16px 24px",
              textAlign: "center",
              borderTop: "1px dashed #e2d9cc",
            }}
          >
            <p style={{ color: "#9e9287", fontSize: "11px", margin: 0 }}>
              Generated · {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Back + heading */}
        <div className="flex items-center gap-3 mb-7">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-pill flex items-center justify-center transition-colors hover:bg-surface shrink-0"
            style={{
              background: "rgb(var(--surface-highest))",
              border: "1px solid rgb(var(--surface-high))",
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <p className="eyebrow mb-0.5">Transaction</p>
            <h1 className="display text-[clamp(22px,3vw,36px)] m-0 leading-none">
              Details
            </h1>
          </div>
        </div>

        {/* Amount hero — dark ink card */}
        <div
          className="rounded-2xl p-7 relative overflow-hidden text-center"
          style={{ background: "rgb(var(--foreground))", color: "#fff" }}
        >
          <div
            className="absolute -right-16 -top-16 w-52 h-52 rounded-pill pointer-events-none"
            style={{
              background: "rgb(var(--brand-primary))",
              opacity: 0.4,
              filter: "blur(60px)",
            }}
          />
          <div className="relative">
            <div
              className="w-14 h-14 rounded-pill flex items-center justify-center mx-auto mb-4"
              style={{
                background: isCredit
                  ? "rgba(184,239,193,0.15)"
                  : "rgba(255,59,48,0.15)",
              }}
            >
              {isCredit ? (
                <ArrowDownLeft
                  size={24}
                  style={{ color: "rgb(var(--mint))" }}
                />
              ) : (
                <ArrowUpRight
                  size={24}
                  style={{ color: "rgb(var(--brand-primary))" }}
                />
              )}
            </div>
            <p
              className="num font-bold text-4xl leading-none mb-3"
              style={{ color: isCredit ? "rgb(var(--mint))" : "#ffffff" }}
            >
              {isCredit ? "+" : "-"}
              {formatCurrency(amount)}
            </p>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill text-sm font-semibold"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: statusColor,
              }}
            >
              <StatusIcon size={13} />
              <span className="capitalize">{mappedStatus}</span>
            </div>
          </div>
        </div>

        {/* Detail rows */}
        <div
          className="rounded-2xl overflow-hidden shadow-card"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          {[
            { label: "Type", value: isCredit ? "Credit" : "Debit" },
            { label: "Channel", value: channel },
            ...(counterpartyName
              ? [{ label: isCredit ? "From" : "To", value: counterpartyName }]
              : []),
            ...(counterpartyBank
              ? [{ label: "Bank", value: counterpartyBank }]
              : []),
            ...(counterpartyAccount
              ? [{ label: "Account", value: counterpartyAccount, mono: true }]
              : []),
            ...(narration ? [{ label: "Narration", value: narration }] : []),
            ...(fee > 0 ? [{ label: "Fee", value: formatCurrency(fee) }] : []),
            { label: "Date", value: formatDateTime(transactionData.date) },
          ].map(({ label, value, mono }) => (
            <div
              key={label}
              className="flex justify-between items-start gap-4 px-5 py-3.5"
              style={{ borderBottom: "1px solid rgb(var(--surface-high))" }}
            >
              <span className="text-foreground-subtle text-sm shrink-0">
                {label}
              </span>
              <span
                className={cn(
                  "text-sm font-medium text-right",
                  mono && "font-mono text-xs",
                )}
              >
                {value}
              </span>
            </div>
          ))}

          {/* Reference row with copy */}
          <div className="flex justify-between items-center gap-4 px-5 py-3.5">
            <span className="text-foreground-subtle text-sm shrink-0">
              Reference
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-right text-foreground-subtle">
                {transactionData.reference}
              </span>
              <button
                onClick={copyReference}
                className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors hover:bg-surface"
              >
                <Copy size={12} className="text-foreground-subtle" />
              </button>
            </div>
          </div>
        </div>

        {/* Export actions */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: "Image",
                key: "dl-image" as const,
                icon: ImageDown,
                onClick: downloadImage,
                primary: true,
              },
              {
                label: "PDF",
                key: "dl-pdf" as const,
                icon: FileDown,
                onClick: downloadPdf,
                primary: false,
              },
              {
                label: "Share",
                key: "share" as const,
                icon: Share2,
                onClick: shareReceipt,
                primary: false,
              },
            ].map(({ label, key, icon: Icon, onClick, primary }) => (
              <button
                key={key}
                onClick={onClick}
                disabled={!!isExporting}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-pill text-sm font-semibold transition-colors",
                  primary
                    ? "bg-foreground text-surface-highest hover:opacity-90"
                    : "hover:bg-surface",
                )}
                style={
                  !primary
                    ? {
                        background: "rgb(var(--surface-highest))",
                        border: "1px solid rgb(var(--surface-high))",
                      }
                    : undefined
                }
              >
                {isExporting === key ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-pill animate-spin" />
                ) : (
                  <Icon size={15} />
                )}
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/account/transactions")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-pill text-sm font-semibold transition-colors hover:bg-surface"
            style={{
              background: "rgb(var(--surface-highest))",
              border: "1px solid rgb(var(--surface-high))",
            }}
          >
            Back to History
          </button>

          {!isCredit && mappedStatus === "successful" && (
            <button
              onClick={() => navigate("/account/send")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity"
            >
              Send Again
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default TransactionDetail;
