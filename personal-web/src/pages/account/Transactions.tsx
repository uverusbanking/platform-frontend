import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { formatCurrency, formatDate } from "@/lib/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/AppLayout";
import {
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
          const ledgerEntry = (tx as Record<string, unknown>).ledger_entries as
            | Array<{ type?: string }>
            | undefined;
          const type = (
            (ledgerEntry?.[0]?.type as string) ||
            (tx as Record<string, string>).type ||
            ""
          ).toUpperCase();
          return (
            type === filter ||
            (filter === "CREDIT" && type === "WALLET_FUNDING")
          );
        });

  const searchedTransactions = debouncedSearch
    ? filteredTransactions.filter(
        (tx) =>
          tx.reference?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          tx.description
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          (tx as Record<string, Record<string, string>>).metadata?.narration
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()),
      )
    : filteredTransactions;

  const prevPage = () => {
    if (meta.page > 1) setPage(meta.page - 1);
  };
  const nextPage = () => {
    if (meta.page < meta.pages) setPage(meta.page + 1);
  };

  const groupedTransactions = searchedTransactions.reduce(
    (groups, tx) => {
      const date = formatDate(
        (tx as Record<string, string>).created_at ||
          (tx as Record<string, string>).createdAt,
      );
      if (!groups[date]) groups[date] = [];
      groups[date].push(tx);
      return groups;
    },
    {} as Record<string, typeof searchedTransactions>,
  );

  const filters: {
    label: string;
    value: "all" | "CREDIT" | "DEBIT";
    icon?: React.ElementType;
  }[] = [
    { label: "All", value: "all" },
    { label: "Received", value: "CREDIT", icon: ArrowDownLeft },
    { label: "Sent", value: "DEBIT", icon: ArrowUpRight },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div>
          <p className="eyebrow mb-2">Activity</p>
          <h1 className="display text-[clamp(26px,3.5vw,44px)] m-0 leading-none">
            Transaction{" "}
            <span
              className="serif-italic"
              style={{ color: "rgb(var(--brand-primary))" }}
            >
              history.
            </span>
          </h1>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-pill w-full sm:w-72 text-sm"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          <Search size={14} className="text-foreground-subtle shrink-0" />
          <Input
            type="text"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none shadow-none p-0 h-auto bg-transparent focus-visible:ring-0 text-sm placeholder:text-foreground-subtle"
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-5">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setFilter(f.value);
              setPage(1);
            }}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-pill text-xs font-semibold transition-colors",
              filter === f.value
                ? "bg-foreground text-surface-highest"
                : "text-foreground-subtle hover:text-foreground hover:bg-surface",
            )}
            style={
              filter !== f.value
                ? {
                    background: "rgb(var(--surface-highest))",
                    border: "1px solid rgb(var(--surface-high))",
                  }
                : undefined
            }
          >
            {f.icon && <f.icon size={12} />}
            {f.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {fetchError && (
        <div
          className="p-4 rounded-2xl text-sm text-center mb-4"
          style={{
            background: "rgb(var(--soft))",
            border: "1px solid rgb(var(--brand-primary) / 0.2)",
            color: "rgb(var(--brand-primary))",
          }}
        >
          {fetchError instanceof Error
            ? fetchError.message
            : "Failed to fetch transactions"}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div
          className="rounded-2xl p-5 space-y-4 shadow-card"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-pill shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-28 rounded-pill" />
                <Skeleton className="h-3 w-16 rounded-pill" />
              </div>
              <Skeleton className="h-4 w-20 rounded-pill" />
            </div>
          ))}
        </div>
      ) : searchedTransactions.length === 0 ? (
        <div
          className="rounded-2xl py-16 px-6 text-center shadow-card"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          <div
            className="w-12 h-12 rounded-pill flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgb(var(--surface))" }}
          >
            <History className="w-6 h-6 text-foreground-subtle" />
          </div>
          <p className="font-semibold text-sm mb-1">No transactions found</p>
          <p className="text-xs text-foreground-subtle">
            {search
              ? "Try a different search term"
              : filter !== "all"
                ? `No ${filter === "CREDIT" ? "received" : "sent"} transactions`
                : "Your transactions will appear here"}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(groupedTransactions).map(([date, txs]) => (
            <div key={date}>
              <p className="eyebrow mb-2 px-1">{date}</p>
              <div
                className="rounded-2xl overflow-hidden shadow-card"
                style={{
                  background: "rgb(var(--surface-highest))",
                  border: "1px solid rgb(var(--surface-high))",
                }}
              >
                {txs.map((tx, idx) => {
                  const ledgerEntry = (
                    (tx as Record<string, unknown>).ledger_entries as
                      | Array<{ type?: string; amount?: string }>
                      | undefined
                  )?.[0];
                  const rawType = (
                    (ledgerEntry?.type as string) ||
                    (tx as Record<string, string>).type ||
                    ""
                  ).toLowerCase();
                  const txType: "credit" | "debit" =
                    rawType === "credit" || rawType === "wallet_funding"
                      ? "credit"
                      : "debit";
                  const amount = parseFloat(
                    (ledgerEntry?.amount as string) ||
                      (tx as Record<string, string>).amount ||
                      "0",
                  );
                  const statusKey = tx.status?.toLowerCase() || "";
                  const statusColor =
                    {
                      completed: "rgb(var(--mint-deep))",
                      success: "rgb(var(--mint-deep))",
                      successful: "rgb(var(--mint-deep))",
                      pending: "rgb(var(--warning))",
                      failed: "rgb(var(--error))",
                      reversed: "rgb(var(--error))",
                    }[statusKey] || "rgb(var(--foreground-subtle))";

                  return (
                    <button
                      key={tx.id}
                      className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-surface"
                      style={
                        idx < txs.length - 1
                          ? {
                              borderBottom:
                                "1px solid rgb(var(--surface-high))",
                            }
                          : undefined
                      }
                      onClick={() => navigate(`/account/transactions/${tx.id}`)}
                    >
                      <div
                        className="w-10 h-10 rounded-pill flex items-center justify-center shrink-0"
                        style={{
                          background:
                            txType === "credit"
                              ? "rgb(var(--mint))"
                              : "rgb(var(--soft))",
                        }}
                      >
                        {txType === "credit" ? (
                          <ArrowDownLeft
                            size={16}
                            style={{ color: "rgb(var(--mint-deep))" }}
                          />
                        ) : (
                          <ArrowUpRight
                            size={16}
                            style={{ color: "rgb(var(--brand-primary))" }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {tx.description ||
                            (tx as Record<string, Record<string, string>>)
                              .metadata?.narration ||
                            "Transaction"}
                        </p>
                        <p className="text-xs text-foreground-subtle truncate">
                          {tx.reference}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className="num font-bold text-sm"
                          style={{
                            color:
                              txType === "credit"
                                ? "rgb(var(--mint-deep))"
                                : "rgb(var(--foreground))",
                          }}
                        >
                          {txType === "credit" ? "+" : "-"}
                          {formatCurrency(amount)}
                        </p>
                        <p
                          className="text-[10px] capitalize"
                          style={{ color: statusColor }}
                        >
                          {tx.status || "Pending"}
                        </p>
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-foreground-subtle shrink-0"
                      />
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
                      onClick={(e) => {
                        e.preventDefault();
                        if (meta.page > 1) {
                          prevPage();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      aria-disabled={meta.page <= 1}
                      className={
                        meta.page <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                  {meta.pages > 0 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={meta.page === 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {meta.page > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  {Array.from({ length: 3 }, (_, i) => meta.page - 1 + i)
                    .filter((p) => p > 1 && p < meta.pages)
                    .map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={meta.page === p}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(p);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  {meta.page < meta.pages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  {meta.pages > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={meta.page === meta.pages}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(meta.pages);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        {meta.pages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (meta.page < meta.pages) {
                          nextPage();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      aria-disabled={meta.page >= meta.pages}
                      className={
                        meta.page >= meta.pages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <p className="text-center text-xs text-foreground-subtle mt-2">
                Showing {(meta.page - 1) * meta.limit + 1}–
                {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
                transactions
              </p>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default Transactions;
