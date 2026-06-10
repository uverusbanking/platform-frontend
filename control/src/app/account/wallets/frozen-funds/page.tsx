"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Snowflake,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  Lock,
  LockOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFrozenFunds } from "@/hooks/queries/usePlatformQueries";
import { formatCurrency } from "@/lib/currency";

function FrozenFundsSkeleton() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-44" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-36" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-8 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function FrozenFundsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetFrozenFunds({ page, limit });
  const entries = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-8 animate-fade-in pb-12 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Snowflake className="w-5 h-5 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Frozen Funds</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            All platform wallets with frozen transfer or funding restrictions.
          </p>
        </div>
        {meta && (
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="text-sm px-4 py-1.5 font-bold rounded-xl"
            >
              {meta.total} frozen {meta.total === 1 ? "wallet" : "wallets"}
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-none shadow-premium bg-blue-500/5 backdrop-blur-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Snowflake className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Total Frozen
              </p>
              <p className="text-2xl font-black">
                {isLoading ? "—" : (meta?.total ?? 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-premium bg-orange-500/5 backdrop-blur-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <ArrowUpDown className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Transfer Frozen
              </p>
              <p className="text-2xl font-black">
                {isLoading
                  ? "—"
                  : entries.filter((e) => e.is_transfer_frozen).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-premium bg-red-500/5 backdrop-blur-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Funding Frozen
              </p>
              <p className="text-2xl font-black">
                {isLoading
                  ? "—"
                  : entries.filter((e) => e.is_funding_frozen).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-none h-14">
                  <TableHead className="pl-6 font-bold text-foreground/70 uppercase text-[11px] tracking-widest">
                    Customer
                  </TableHead>
                  <TableHead className="font-bold text-foreground/70 uppercase text-[11px] tracking-widest">
                    Account Number
                  </TableHead>
                  <TableHead className="font-bold text-foreground/70 uppercase text-[11px] tracking-widest">
                    Balance
                  </TableHead>
                  <TableHead className="font-bold text-foreground/70 uppercase text-[11px] tracking-widest">
                    Transfer
                  </TableHead>
                  <TableHead className="font-bold text-foreground/70 uppercase text-[11px] tracking-widest">
                    Funding
                  </TableHead>
                  <TableHead className="font-bold text-foreground/70 uppercase text-[11px] tracking-widest">
                    Organisation
                  </TableHead>
                  <TableHead className="pr-6 text-right font-bold text-foreground/70 uppercase text-[11px] tracking-widest">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <FrozenFundsSkeleton />
                ) : entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Snowflake className="w-12 h-12 opacity-20" />
                        <p className="font-bold">No frozen funds found</p>
                        <p className="text-sm">
                          All wallets are currently unrestricted.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => (
                    <TableRow
                      key={entry.id}
                      className="group/row hover:bg-muted/40 transition-all h-20 border-b border-border/30"
                    >
                      <TableCell className="pl-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-base">
                            {entry.customer_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {entry.customer_email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono font-bold tracking-widest text-sm">
                          {entry.account_number}
                        </span>
                      </TableCell>
                      <TableCell className="font-black text-base">
                        {formatCurrency(Number(entry.balance), entry.currency)}
                      </TableCell>
                      <TableCell>
                        {entry.is_transfer_frozen ? (
                          <Badge className="bg-orange-500/10 text-orange-600 border-none gap-1.5 font-bold text-[11px]">
                            <Lock className="w-3 h-3" /> Frozen
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-200 gap-1.5 font-bold text-[11px]"
                          >
                            <LockOpen className="w-3 h-3" /> Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.is_funding_frozen ? (
                          <Badge className="bg-red-500/10 text-red-600 border-none gap-1.5 font-bold text-[11px]">
                            <Lock className="w-3 h-3" /> Frozen
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-200 gap-1.5 font-bold text-[11px]"
                          >
                            <LockOpen className="w-3 h-3" /> Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-primary/5 text-primary/70 border-none font-bold text-[10px]"
                        >
                          {entry.organisation?.organisation_name ?? "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-56 p-2 rounded-xl shadow-xl"
                          >
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-2 px-3">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/account/customers/${entry.customer_id}`,
                                )
                              }
                              className="rounded-lg h-10 cursor-pointer gap-2"
                            >
                              <Eye className="h-4 w-4 text-primary" />
                              <span className="font-semibold">
                                View Customer
                              </span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-5 bg-muted/20 border-t border-border/30">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Page {page} of {meta.totalPages} &middot; {meta.total} total
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="rounded-lg font-bold"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === meta.totalPages}
                className="rounded-lg font-bold"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
