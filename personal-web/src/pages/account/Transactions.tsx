import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { formatCurrency, formatDate } from "@/lib/currency";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppLayout } from "@/components/AppLayout";
import { TransactionList } from "@/components/TransactionList";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  History,
  ChevronRight
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Transactions = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'CREDIT' | 'DEBIT'>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search to avoid API calls on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Use the transactions hook
  const {
    data: response,
    isLoading,
    error: fetchError,
  } = useTransactions({
    page,
    limit: 20
  });

  // Extract data from the correct response structure
  const transactions = response?.data || [];
  const pagination = response?.meta?.pagination;
  const meta = {
    page: pagination?.page || 1,
    pages: pagination?.total_pages || 0,
    limit: pagination?.per_page || 20,
    total: pagination?.total || 0
  };

  // Filter transactions based on selected filter
  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(tx => {
      const ledgerEntry = tx.ledger_entries?.[0];
      return ledgerEntry?.type === filter;
    });

  // Search through transactions
  const searchedTransactions = debouncedSearch
    ? filteredTransactions.filter(tx =>
      tx.reference?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      tx.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      tx.metadata?.narration?.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    : filteredTransactions;

  // Pagination functions
  const prevPage = () => {
    if (meta.page > 1) {
      setPage(meta.page - 1);
    }
  };

  const nextPage = () => {
    if (meta.page < meta.pages) {
      setPage(meta.page + 1);
    }
  };

  // Group transactions by date
  const groupedTransactions = searchedTransactions.reduce(
    (groups, tx) => {
      const date = formatDate(tx?.created_at || (tx as any).createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(tx);
      return groups;
    },
    {} as Record<string, typeof searchedTransactions>,
  );

  return (
    <AppLayout showHeader={false}>
      {/* Header */}
      <header className="bg-gradient-hero safe-top sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-4xl">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors text-white touch-manipulation"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-white">
              Transaction History
            </h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 sm:h-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 max-w-4xl">
        {/* Filter Tabs */}
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as "all" | "CREDIT" | "DEBIT")}
          className="mb-4"
        >
          <TabsList className="grid w-full grid-cols-3 h-10 sm:h-9">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="CREDIT" className="gap-1 text-xs sm:text-sm">
              <ArrowDownLeft size={14} />
              Received
            </TabsTrigger>
            <TabsTrigger value="DEBIT" className="gap-1 text-xs sm:text-sm">
              <ArrowUpRight size={14} />
              Sent
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Error State */}
        {fetchError && (
          <Card className="mb-4">
            <CardContent className="py-6 text-center">
              <p className="text-sm text-destructive">
                {fetchError instanceof Error
                  ? fetchError.message
                  : "Failed to fetch transactions"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Transactions List */}
        {isLoading ? (
          <Card>
            <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : searchedTransactions.length === 0 ? (
          <Card>
            <CardContent className="py-10 sm:py-12 text-center">
              <History className="w-14 h-14 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                No transactions found
              </h3>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Try a different search term"
                  : filter !== 'all'
                    ? `No ${filter === 'CREDIT' ? 'received' : 'sent'} transactions found`
                    : "Your transactions will appear here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedTransactions).map(([date, txs]) => (
              <div key={date}>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 px-1">
                  {date}
                </p>
                <Card>
                  <CardContent className="p-0 divide-y divide-border">
                    {txs.map((tx) => {
                      // Get the first ledger entry to determine transaction type and amount
                      const ledgerEntry = tx.ledger_entries[0];
                      const rawType = typeof ledgerEntry?.type === 'string' ? ledgerEntry.type.toLowerCase() : undefined;
                      const txType: 'credit' | 'debit' = rawType === 'credit' ? 'credit' : 'debit';
                      const amount = parseFloat(ledgerEntry?.amount || '0');

                      return (
                        <button
                          key={tx.id}
                          className="w-full flex items-center gap-3 p-3 sm:p-4 hover:bg-muted/50 active:bg-muted transition-colors text-left touch-manipulation"
                          onClick={() => navigate(`/account/transactions/${tx.id}`)}
                        >
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${txType === 'credit' ? 'bg-success/10' : 'bg-destructive/10'
                            }`}>
                            {txType === 'credit' ? (
                              <ArrowDownLeft size={16} className="text-success sm:hidden" />
                            ) : (
                              <ArrowUpRight size={16} className="text-destructive sm:hidden" />
                            )}
                            {txType === 'credit' ? (
                              <ArrowDownLeft size={18} className="text-success hidden sm:block" />
                            ) : (
                              <ArrowUpRight size={18} className="text-destructive hidden sm:block" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-base truncate">
                              {tx.description || tx.metadata?.narration || 'Transaction'}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {tx.reference}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={`font-semibold text-sm sm:text-base ${txType === 'credit' ? 'text-success' : 'text-foreground'
                              }`}>
                              {txType === 'credit' ? '+' : '-'}{formatCurrency(amount)}
                            </p>
                            <p className={`text-[10px] sm:text-xs capitalize 
                              ${{
                                'completed': 'text-success',
                                'success': 'text-success',
                                'successful': 'text-success',
                                'pending': 'text-warning',
                                'failed': 'text-destructive',
                                'reversed': 'text-destructive'
                              }[tx.status?.toLowerCase() || ''] || 'text-muted-foreground'}`}>
                              {tx.status || 'Pending'}
                            </p>
                          </div>
                          <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* Pagination info */}
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
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        aria-disabled={meta.page <= 1}
                        className={meta.page <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {/* First Page */}
                    {meta.pages > 0 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={meta.page === 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Ellipsis Start */}
                    {meta.page > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Middle Pages */}
                    {Array.from({ length: 3 }, (_, i) => meta.page - 1 + i)
                      .filter(p => p > 1 && p < meta.pages)
                      .map(p => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href="#"
                            isActive={meta.page === p}
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(p);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    {/* Ellipsis End */}
                    {meta.page < meta.pages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Last Page */}
                    {meta.pages > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={meta.page === meta.pages}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(meta.pages);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
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
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        aria-disabled={meta.page >= meta.pages}
                        className={meta.page >= meta.pages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <div className="text-center text-xs text-muted-foreground mt-2">
                  Showing {(meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} transactions
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Transactions;
