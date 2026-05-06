import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import type { TransactionDetailsResponseDto } from "@/types";

interface TransactionCardProps {
  transaction: TransactionDetailsResponseDto;
}

export const TransactionCard = ({ transaction: tx }: TransactionCardProps) => {
  const navigate = useNavigate();
  const amount = parseFloat(tx.amount || "0");

  // Map status - check transaction status directly
  let mappedStatus = "pending";
  const rawStatus = tx.status?.toLowerCase();

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

  // Get description
  const displayText = tx.description || "Transaction";

  return (
    <button
      className="w-full flex items-center gap-3 p-3 sm:p-4 hover:bg-muted/50 active:bg-muted transition-colors cursor-pointer text-left touch-manipulation"
      onClick={() => navigate(`/account/transactions/${tx.id}`)}
    >
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${
          tx.type.toUpperCase() === "CREDIT"
            ? "bg-success/10"
            : "bg-destructive/10"
        }`}
      >
        {tx.type.toUpperCase() === "CREDIT" ? (
          <>
            <ArrowDownLeft size={16} className="text-success sm:hidden" />
            <ArrowDownLeft size={18} className="text-success hidden sm:block" />
          </>
        ) : (
          <>
            <ArrowUpRight size={16} className="text-destructive sm:hidden" />
            <ArrowUpRight
              size={18}
              className="text-destructive hidden sm:block"
            />
          </>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm sm:text-base truncate">
          {displayText}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground"></p>
      </div>
      <div className="text-right shrink-0">
        <p
          className={`font-semibold text-sm sm:text-base ${
            tx.type.toLowerCase() === "credit"
              ? "text-success"
              : "text-foreground"
          }`}
        >
          {tx.type.toLowerCase() === "credit" ? "+" : "-"}
          {formatCurrency(amount)}
        </p>
        <p
          className={`text-[10px] sm:text-xs capitalize ${
            {
              successful: "text-success",
              success: "text-success",
              completed: "text-success",
              pending: "text-warning",
              failed: "text-destructive",
              reversed: "text-destructive",
            }[mappedStatus] || "text-muted-foreground"
          }`}
        >
          {mappedStatus}
        </p>
      </div>
    </button>
  );
};
