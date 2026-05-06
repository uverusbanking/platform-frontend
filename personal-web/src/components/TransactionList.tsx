import { TransactionCard } from "./TransactionCard";
import type { TransactionDetailsResponseDto } from "@/types";

interface TransactionListProps {
  transactions: TransactionDetailsResponseDto[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  return (
    <div className="divide-y divide-border">
      {transactions.map((tx) => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
    </div>
  );
};
