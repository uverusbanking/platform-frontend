import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import type { TransactionDetailsResponseDto } from "@/types";

interface TransactionCardProps {
  transaction: TransactionDetailsResponseDto;
}

const statusColor: Record<string, string> = {
  successful: "rgb(var(--mint-deep))",
  success: "rgb(var(--mint-deep))",
  completed: "rgb(var(--mint-deep))",
  pending: "rgb(var(--warning))",
  failed: "rgb(var(--error))",
  reversed: "rgb(var(--error))",
};

export const TransactionCard = ({ transaction: tx }: TransactionCardProps) => {
  const navigate = useNavigate();
  const amount = parseFloat(tx.amount || "0");
  const isCredit = tx.type.toUpperCase() === "CREDIT";
  const rawStatus = tx.status?.toLowerCase() || "pending";
  const mappedStatus =
    rawStatus === "completed" || rawStatus === "success"
      ? "successful"
      : rawStatus;
  const displayText = tx.description || "Transaction";

  return (
    <button
      className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-surface"
      onClick={() => navigate(`/account/transactions/${tx.id}`)}
    >
      <div
        className="w-10 h-10 rounded-pill flex items-center justify-center shrink-0"
        style={{
          background: isCredit ? "rgb(var(--mint))" : "rgb(var(--soft))",
        }}
      >
        {isCredit ? (
          <ArrowDownLeft size={16} style={{ color: "rgb(var(--mint-deep))" }} />
        ) : (
          <ArrowUpRight
            size={16}
            style={{ color: "rgb(var(--brand-primary))" }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{displayText}</p>
        <p className="text-xs text-foreground-subtle truncate">
          {tx.reference || ""}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p
          className="num font-bold text-sm"
          style={{
            color: isCredit
              ? "rgb(var(--mint-deep))"
              : "rgb(var(--foreground))",
          }}
        >
          {isCredit ? "+" : "-"}
          {formatCurrency(amount)}
        </p>
        <p
          className="text-[10px] capitalize"
          style={{
            color: statusColor[mappedStatus] || "rgb(var(--foreground-subtle))",
          }}
        >
          {mappedStatus}
        </p>
      </div>
    </button>
  );
};
