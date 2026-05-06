"use client";

import { useState } from "react";
import {
  ArrowLeft,
  History,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGetCustomerById } from "@/hooks/queries/useCustomerQueries";
import { useGetPlatformCustomerTransactions } from "@/hooks/queries/useTransactionQueries";
import { IGetPlatformTransactionFilters } from "@/types/transaction.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 20;

export default function CustomerTransactionsPage() {
  const navigate = useNavigate();
  const { id = "" } = useParams<{ id: string }>();
  const { data: customerResponse } = useGetCustomerById(id);
  const customer = customerResponse?.data;

  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<"ALL" | "CREDIT" | "DEBIT">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SUCCESSFUL" | "FAILED" | "PENDING">("ALL");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const filters: IGetPlatformTransactionFilters = {
    limit: PAGE_SIZE,
    page,
    ...(typeFilter !== "ALL" ? { type: typeFilter as "CREDIT" | "DEBIT" } : {}),
    ...(statusFilter !== "ALL" ? { status: statusFilter as "SUCCESSFUL" | "FAILED" | "PENDING" } : {}),
    ...(search ? { search } : {}),
  };

  const { data, isLoading, isFetching } = useGetPlatformCustomerTransactions(id, filters);

  const transactions = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = meta?.pages ?? 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const clearSearch = () => {
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  const handleTypeFilter = (t: typeof typeFilter) => {
    setTypeFilter(t);
    setPage(1);
  };

  const handleStatusFilter = (s: typeof statusFilter) => {
    setStatusFilter(s);
    setPage(1);
  };

  const hasActiveFilters = typeFilter !== "ALL" || statusFilter !== "ALL" || !!search;

  const statusStyles = {
    SUCCESSFUL: "text-success bg-success/10 border-success/20",
    FAILED: "text-destructive bg-destructive/10 border-destructive/20",
    PENDING: "text-warning bg-warning/10 border-warning/20",
  } as const;

  const typeLabels = { ALL: "All Types", CREDIT: "Credits", DEBIT: "Debits" };
  const statusLabels = { ALL: "All Status", SUCCESSFUL: "Successful", FAILED: "Failed", PENDING: "Pending" };

  const customerName = customer
    ? `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() || "Customer"
    : "Customer";

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/account/customers/${id}`}>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted/50">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
            <Link to="/account/customers" className="hover:text-primary transition-colors">Customers</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/account/customers/${id}`} className="hover:text-primary transition-colors truncate max-w-[140px]">
              {customerName}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Transactions</span>
          </div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Transaction History
          </h1>
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-bold hidden sm:flex">
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>
      </div>

      {/* Summary stats */}
      {!isLoading && total > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total Transactions",
              value: total.toLocaleString(),
              icon: Activity,
              color: "text-primary bg-primary/10",
            },
            {
              label: "Credits",
              value: transactions.filter((t) => t.type === "CREDIT").length.toLocaleString(),
              icon: TrendingUp,
              color: "text-success bg-success/10",
              note: "on this page",
            },
            {
              label: "Debits",
              value: transactions.filter((t) => t.type === "DEBIT").length.toLocaleString(),
              icon: TrendingDown,
              color: "text-destructive bg-destructive/10",
              note: "on this page",
            },
          ].map(({ label, value, icon: Icon, color, note }) => (
            <Card key={label} className="border-none shadow-premium bg-surface/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium truncate">{label}</p>
                  <p className="text-lg font-black">{value}</p>
                  {note && <p className="text-[10px] text-muted-foreground/60">{note}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters bar */}
      <Card className="border-none shadow-premium bg-surface/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by reference or description..."
                  className="pl-9 h-9 text-xs"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <Button type="submit" size="sm" className="h-9 text-xs font-bold">Search</Button>
            </form>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={typeFilter !== "ALL" ? "default" : "outline"}
                    size="sm"
                    className="h-9 text-xs font-bold gap-1.5"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    {typeLabels[typeFilter]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(["ALL", "CREDIT", "DEBIT"] as const).map((t) => (
                    <DropdownMenuItem
                      key={t}
                      className={`text-xs font-bold ${typeFilter === t ? "text-primary" : ""}`}
                      onClick={() => handleTypeFilter(t)}
                    >
                      {typeLabels[t]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={statusFilter !== "ALL" ? "default" : "outline"}
                    size="sm"
                    className="h-9 text-xs font-bold gap-1.5"
                  >
                    {statusLabels[statusFilter]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(["ALL", "SUCCESSFUL", "FAILED", "PENDING"] as const).map((s) => (
                    <DropdownMenuItem
                      key={s}
                      className={`text-xs font-bold ${statusFilter === s ? "text-primary" : ""}`}
                      onClick={() => handleStatusFilter(s)}
                    >
                      {statusLabels[s]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs font-bold text-destructive hover:text-destructive gap-1"
                  onClick={() => {
                    setTypeFilter("ALL");
                    setStatusFilter("ALL");
                    clearSearch();
                  }}
                >
                  <X className="w-3 h-3" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions list */}
      <Card className="border-none shadow-premium bg-surface/50">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold tracking-normal flex items-center gap-2">
            Transactions
            {isFetching && !isLoading && (
              <span className="text-[10px] font-bold text-muted-foreground animate-pulse">Updating...</span>
            )}
          </CardTitle>
          {total > 0 && (
            <span className="text-xs font-bold text-muted-foreground">
              {total.toLocaleString()} result{total !== 1 ? "s" : ""}
            </span>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y divide-border/30">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-5">
                  <Skeleton className="h-11 w-11 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <div className="space-y-2 items-end flex flex-col">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
              <div className="p-5 bg-muted/30 rounded-full">
                <History className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <p className="font-black text-foreground">
                {hasActiveFilters ? "No transactions match your filters" : "No transactions yet"}
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                {hasActiveFilters
                  ? "Try adjusting your search or filter criteria."
                  : "This customer has no transaction history."}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs font-bold"
                  onClick={() => {
                    setTypeFilter("ALL");
                    setStatusFilter("ALL");
                    clearSearch();
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {transactions.map((tx) => {
                const isCredit = tx.type === "CREDIT";
                const statusStyle =
                  statusStyles[tx.status as keyof typeof statusStyles] ??
                  "text-muted-foreground bg-muted/20 border-muted/20";
                const amount = parseFloat(tx.amount);
                return (
                  <div
                    key={tx.id}
                    onClick={() => navigate(`/account/transactions/${tx.id}`)}
                    className={`flex items-center justify-between px-5 py-4 group/tx transition-all border-l-4 cursor-pointer active:scale-[0.99] ${
                      isCredit
                        ? "border-l-success hover:bg-success/5"
                        : "border-l-destructive hover:bg-destructive/5"
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`p-2.5 rounded-2xl shrink-0 ${
                          isCredit
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {isCredit ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="font-bold text-foreground group-hover/tx:text-primary transition-colors truncate max-w-[260px]">
                          {tx.description || "—"}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                          <span className="font-mono truncate max-w-[140px]">{tx.reference}</span>
                          <span>·</span>
                          <span className="shrink-0">
                            {new Date(tx.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span>·</span>
                          <span className="shrink-0">
                            {new Date(tx.createdAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                      <div
                        className={`text-base font-black ${
                          isCredit ? "text-success" : "text-foreground"
                        }`}
                      >
                        {isCredit ? "+" : "-"}
                        {tx.currency}{" "}
                        {amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <Badge
                        className={`text-[9px] font-black uppercase tracking-widest border ${statusStyle}`}
                        variant="outline"
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="border-t border-border/30 p-4 flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-bold gap-1.5"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      pageNum === page
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-bold gap-1.5"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        {!isLoading && total > 0 && (
          <div className="border-t border-border/30 px-5 py-3 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground font-medium">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Page {page} of {totalPages}
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}
