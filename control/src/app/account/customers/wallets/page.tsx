"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Wallet,
  Download,
  Building2,
  MoreHorizontal,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPlatformCustomerWallets, useGetOrganisations } from "@/hooks/queries/usePlatformQueries";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

function CustomerWalletSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function PlatformCustomerWallets() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [page, setPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const limit = 10;

  const { data: organisationsData } = useGetOrganisations({ page: 1, limit: 100 });
  const organisations = organisationsData?.data || [];

  const { data: customerData, isLoading } = useGetPlatformCustomerWallets({
    page,
    limit,
    search: searchTerm,
    status: selectedStatus === "all" ? undefined : selectedStatus,
    organisation_id: selectedOrg === "all" ? undefined : selectedOrg,
  });

  const customers = customerData?.data || [];
  const meta = customerData?.meta;

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleNextPage = () => {
    if (meta && page < meta.totalPages) setPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Customer Wallets</h1>
          <p className="text-muted-foreground text-lg">Manage all customer wallets across the platform.</p>
        </div>
        <Button variant="outline" className="rounded-xl px-5 h-12 font-bold">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-30 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Filters & Search</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group/search">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within/search:text-primary transition-colors" />
              <Input
                placeholder="Search name, email, or account number..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="pl-11 h-12 bg-muted/20 border-border/40 rounded-xl font-medium"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={selectedStatus} onValueChange={(val) => { setSelectedStatus(val); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-40 h-12 bg-muted/20 border-border/40 rounded-xl font-medium">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="FROZEN">Frozen</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedOrg} onValueChange={(val) => { setSelectedOrg(val); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-56 h-12 bg-muted/20 border-border/40 rounded-xl font-medium">
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="Organisation" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organisations</SelectItem>
                  {organisations.map(org => (
                    <SelectItem key={org.id} value={org.id}>{org.organisation_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-none h-14">
                  <TableHead className="pl-6 font-bold text-foreground/70 uppercase text-[11px] tracking-widest">Customer</TableHead>
                  <TableHead className="font-bold text-foreground/70 uppercase text-[11px] tracking-widest">Account Details</TableHead>
                  <TableHead className="font-bold text-foreground/70 uppercase text-[11px] tracking-widest">Organisation</TableHead>
                  <TableHead className="font-bold text-foreground/70 uppercase text-[11px] tracking-widest">Wallets</TableHead>
                  <TableHead className="font-bold text-foreground/70 uppercase text-[11px] tracking-widest">Total Balance</TableHead>
                  <TableHead className="pr-6 text-right font-bold text-foreground/70 uppercase text-[11px] tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <CustomerWalletSkeleton />
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Wallet className="w-12 h-12 opacity-20" />
                        <p className="font-bold">No customers found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => {
                    const totalBalance = customer.wallets.reduce((acc, w) => acc + Number(w.balance), 0);
                    const isExpanded = expandedRows.has(customer.id);
                    
                    return (
                      <>
                        <TableRow 
                          key={customer.id} 
                          className={cn(
                            "group/row hover:bg-muted/40 transition-all h-20 cursor-pointer border-b border-border/30",
                            isExpanded && "bg-muted/20"
                          )}
                          onClick={() => toggleRow(customer.id)}
                        >
                          <TableCell className="pl-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-base">{customer.first_name} {customer.last_name}</span>
                              <span className="text-xs text-muted-foreground">{customer.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {customer.wallets.length > 0 ? (
                              <div className="flex flex-col">
                                <span className="font-mono font-bold tracking-widest text-sm">
                                  {customer.wallets[0].account_number}
                                </span>
                                {customer.wallets.length > 1 && (
                                  <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">
                                    Primary Wallet
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs italic">No wallets</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/5 text-primary/70 border-none font-bold text-[10px]">
                              {customer.organisation?.organisation_name || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="font-black">
                                {customer.wallets.length}
                              </Badge>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                            </div>
                          </TableCell>
                          <TableCell className="font-black text-lg">
                            {formatCurrency(totalBalance, customer.wallets[0]?.currency || "NGN")}
                          </TableCell>
                          <TableCell className="pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10">
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl">
                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-2 px-3">Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => navigate(`/account/customers/${customer.id}`)}
                                  className="rounded-lg h-10 cursor-pointer gap-2"
                                >
                                  <Eye className="h-4 w-4 text-primary" />
                                  <span className="font-semibold">View Customer</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        
                        {isExpanded && (
                          <TableRow className="bg-muted/5 border-none hover:bg-muted/5">
                            <TableCell colSpan={6} className="p-0">
                              <div className="px-6 py-4 bg-muted/10 border-x border-border/30 animate-in slide-in-from-top-1 duration-200">
                                <div className="rounded-xl border border-border/40 overflow-hidden bg-surface shadow-sm">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-muted/50 hover:bg-muted/50 h-10">
                                        <TableHead className="font-bold text-[10px] uppercase pl-4">Account Number</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase">Currency</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase">Balance</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase">Status</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase pr-4 text-right">Created At</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {customer.wallets.map((wallet) => (
                                        <TableRow key={wallet.id} className="h-12 border-b border-border/20 last:border-none">
                                          <TableCell className="pl-4 font-mono font-bold">{wallet.account_number}</TableCell>
                                          <TableCell className="font-bold text-xs">{wallet.currency}</TableCell>
                                          <TableCell className="font-black">{formatCurrency(wallet.balance, wallet.currency)}</TableCell>
                                          <TableCell>
                                            <StatusBadge status={wallet.status} />
                                          </TableCell>
                                          <TableCell className="pr-4 text-right text-xs text-muted-foreground">
                                            {new Date(wallet.created_at).toLocaleDateString()}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-5 bg-muted/20 border-t border-border/30">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Viewing page {page} of {meta.totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={page === 1}
                className="rounded-lg font-bold"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
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
