import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { formatCurrency, formatDate } from "@/lib/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/AppLayout";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  History,
  ChevronRight,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const Transactions = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "CREDIT" | "DEBIT">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: response,
    isLoading,
    error: fetchError,
  } = useTransactions({ page, limit: 20 });

  const transactions = response?.data || [];
  const pagination = response?.meta?.pagination;
  const meta = {
    page: pagination?.page || 1,
    pages: pagination?.total_pages || 0,
    limit: pagination?.per_page || 20,
    total: pagination?.total || 0,
  };

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((tx) => {
          const ledgerEntry = (tx as any).ledger_entries?.[0];
          const type = (ledgerEntry?.type || tx.type || "").toUpperCase();
          return type === filter || (filter === "CREDIT" && type === "WALLET_FUNDING");
        });

  const searchedTransactions = debouncedSearch
    ? filteredTransactions.filter(
        (tx) =>
          tx.reference?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          tx.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          (tx as any).metadata?.narration?.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
    : filteredTransactions;

  const prevPage = () => { if (meta.page > 1) setPage(meta.page - 1); };
  const nextPage = () => { if (meta.page < meta.pages) setPage(meta.page + 1); };

  const groupedTransactions = searchedTransactions.reduce(
    (groups, tx) => {
      const date = formatDate((tx as any).created_at || (tx as any).createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(tx);
      return groups;
    },
    {} as Record<string, typeof searchedTransactions>,
  );

  const filters: { label: string; value: "all" | "CREDIT" | "DEBIT"; icon?: React.ElementType }[] = [
    { label: "All", value: "all" },
    { label: "Received", value: "CREDIT", icon: ArrowDownLeft },
    { label: "Sent", value: "DEBIT", icon: ArrowUpRight },
  ];

  return (
    <AppLayout showHeader={false}>
      {/* Header */}
      <header className="bg-gradient-hero safe-top sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors text-white flex items-center justify-center touch-manipulation"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-lg font-semibold text-white">Transaction History</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" size={16} />
            <Input
              type="text"
              placeholder="Search transactions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-2xl focus-visible:ring-white/30"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 max-w-2xl space-y-4">
        {/* Filter Pills */}
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => { setFilter(f.value); setPage(1); }}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold transition-all",
                filter === f.value
                  ? "bg-primary text-white shadow-sm shadow-primary/30"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
              )}
            >
              {f.icon && <f.icon size={12} />}
              {f.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {fetchError && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
            {fetchError instanceof Error ? fetchError.message : "Failed to fetch transactions"}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="bg-card border border-border rounded-3xl p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-28 rounded-full" />
                  <Skeleton className="h-3 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : searchedTransactions.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl py-14 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <History className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-semibold text-sm mb-1">No transactions found</p>
            <p className="text-xs text-muted-foreground">
              {search
                ? "Try a different search term"
                : filter !== "all"
                  ? `No ${filter === "CREDIT" ? "received" : "sent"} transactions found`
                  : "Your transactions will appear here"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedTransactions).map(([date, txs]) => (
              <div key={date}>
                <p className="text-xs font-medium text-muted-foreground mb-2 px-1">{date}</p>
                <div className="bg-card border border-border rounded-3xl overflow-hidden divide-y divide-border">
                  {txs.map((tx) => {
                    const ledgerEntry = (tx as any).ledger_entries?.[0];
                    const rawType = (ledgerEntry?.type || tx.type || "").toLowerCase();
                    const txType: "credit" | "debit" =
                      rawType === "credit" || rawType === "wallet_funding" ? "credit" : "debit";
                    const amount = parseFloat(ledgerEntry?.amount || tx.amount || "0");
                    const statusKey = tx.status?.toLowerCase() || "";
                    const statusColor =
                      {
                        completed: "text-success",
                        success: "text-success",
                        successful: "text-success",
                        pending: "text-warning",
                        failed: "text-destructive",
                        reversed: "text-destructive",
                      }[statusKey] || "text-muted-foreground";

                    return (
                      <button
                        key={tx.id}
                        className="w-full flex items-center gap-3 p-3.5 hover:bg-accent/50 active:bg-accent transition-colors text-left touch-manipulation"
                        onClick={() => navigate(`/account/transactions/${tx.id}`)}
                      >
                        <div
                          className={cn(
                            "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0",
                            txType === "credit" ? "bg-success/10" : "bg-destructive/10"
                          )}
                        >
                          {txType === "credit"
                            ? <ArrowDownLeft size={18} className="text-success" />
                            : <ArrowUpRight size={18} className="text-destructive" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {tx.description || (tx as any).metadata?.narration || "Transaction"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{tx.reference}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={cn("font-semibold text-sm", txType === "credit" ? "text-success" : "text-foreground")}>
                            {txType === "credit" ? "+" : "-"}{formatCurrency(amount)}
                          </p>
                          <p className={cn("text-[10px] capitalize", statusColor)}>
                            {tx.status || "Pending"}
                          </p>
                        </div>
                        <ChevronRight size={15} className="text-muted-foreground shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {meta.pages > 1 && (
              <div className="py-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => { e.preventDefault(); if (meta.page > 1) { prevPage(); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
                        aria-disabled={meta.page <= 1}
                        className={meta.page <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {meta.pages > 0 && (
                      <PaginationItem>
                        <PaginationLink href="#" isActive={meta.page === 1} onClick={(e) => { e.preventDefault(); setPage(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    {meta.page > 3 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                    {Array.from({ length: 3 }, (_, i) => meta.page - 1 + i)
                      .filter((p) => p > 1 && p < meta.pages)
                      .map((p) => (
                        <PaginationItem key={p}>
                          <PaginationLink href="#" isActive={meta.page === p} onClick={(e) => { e.preventDefault(); setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    {meta.page < meta.pages - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                    {meta.pages > 1 && (
                      <PaginationItem>
                        <PaginationLink href="#" isActive={meta.page === meta.pages} onClick={(e) => { e.preventDefault(); setPage(meta.pages); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                          {meta.pages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => { e.preventDefault(); if (meta.page < meta.pages) { nextPage(); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
                        aria-disabled={meta.page >= meta.pages}
                        className={meta.page >= meta.pages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} transactions
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Transactions;
