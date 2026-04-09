"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  // Download,
  Plus,
  Eye,
  // Edit,
  // Trash2,
  MoreHorizontal,
  // Link as LinkIcon,
  Users,
  UserCheck,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { AddCustomerDialog } from "@/components/features/customers/AddCustomerDialog";

import { ICustomer } from "@/types/customer.types";
import { CreateCustomerPaymentLinkDialog } from "@/components/features/customers/CreateCustomerPaymentLinkDialog";
import { useUserStore } from "@/state/userStore";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCustomers,
  useGetCustomerStats,
} from "@/hooks/queries/useCustomerQueries";
import { KPICard } from "@/components/features/dashboard/KPICard";
import { KPICardSkeleton } from "@/components/features/dashboard/KPICardSkeleton";

function CustomerSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent">
          <TableCell className="w-[300px]">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[140px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-[60px] rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-[70px] rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-8 ml-auto rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function EmptyCustomers({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-primary rounded-full blur opacity-25 animate-pulse" />
        <div className="relative p-6 rounded-full bg-surface border border-border shadow-xl">
          <Users className="h-12 w-12 text-primary/60" />
        </div>
      </div>
      <div className="space-y-2 max-w-[320px]">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          No customers found
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          It looks like no customers have been added yet.
        </p>
        <Button onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Enroll First Customer
        </Button>
      </div>
    </div>
  );
}

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  // const [selectedBranch, setSelectedBranch] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [paymentLinkCustomer, setPaymentLinkCustomer] =
    useState<ICustomer | null>(null);
  const navigate = useNavigate();

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 10;

  const { userData } = useUserStore();
  const { data: customerStats, isLoading: isStatsLoading } =
    useGetCustomerStats();

  const { data: customerData, isLoading } = useGetCustomers({
    page,
    limit,
    environment: userData.view_mode || "LIVE",
    search: searchTerm,
    status: selectedStatus === "all" ? undefined : selectedStatus,
  });

  const stats = customerStats?.data
    ? {
        totalCustomers: customerStats.data.totalCustomers.toLocaleString(),
        totalActiveCustomers:
          customerStats.data.totalActiveCustomers.toLocaleString(),
        totalPendingCustomers:
          customerStats.data.totalPendingCustomers.toLocaleString(),
      }
    : {
        totalCustomers: "NIL",
        totalActiveCustomers: "NIL",
        totalPendingCustomers: "NIL",
      };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20 transition-colors font-medium">
            Active
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20 transition-colors font-medium">
            Pending
          </Badge>
        );
      case "BLOCKED":
        return (
          <Badge className="bg-error/10 text-error border-error/20 hover:bg-error/20 transition-colors font-medium">
            Blocked
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="font-medium">
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  const customers = customerData?.data ?? [];

  const meta = customerData?.meta?.pagination;

  const handleNextPage = () => {
    if (meta && page < meta.total_pages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Customers
              </h1>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    userData.view_mode === "LIVE"
                      ? "bg-success/10 text-success border-success/30 px-3 py-1 font-bold tracking-wide"
                      : "bg-warning/10 text-warning border-warning/30 px-3 py-1 font-bold tracking-wide"
                  }
                >
                  {userData.view_mode}
                </Badge>
                {meta && (
                  <Badge
                    variant="secondary"
                    className="bg-muted/50 text-muted-foreground font-medium px-2.5"
                  >
                    {meta.total} total
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-muted-foreground text-lg font-medium max-w-xl">
              Your customer ecosystem, centralized. Manage identities, monitor
              growth, and handle verifications.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* <Button
              variant="outline"
              className="flex-1 md:flex-none border-border/60 hover:bg-muted/50 transition-all font-semibold rounded-xl px-5">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button> */}
            <Button
              className="flex-1 md:flex-none font-bold rounded-xl px-6 cursor-pointer"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Enroll Customer
            </Button>
          </div>
        </div>
        {/* KPI Cards */}
        {isStatsLoading ? (
          <KPICardSkeleton count={3} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <KPICard
              title="Total Customers"
              value={stats.totalCustomers}
              change="NIL%"
              changeType="positive"
              description="vs last month"
              icon={ShieldCheck}
            />
            <KPICard
              title="Active Customers"
              value={stats.totalActiveCustomers}
              change="NIL%"
              changeType="positive"
              description="vs last month"
              icon={UserCheck}
            />
            <KPICard
              title="Pending Customers"
              value={stats.totalPendingCustomers}
              change="NIL%"
              changeType="positive"
              description="vs last month"
              icon={AlertCircle}
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6">
        {/* Filters Card */}
        <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-30 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Filters & Search
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 group/search">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within/search:text-primary transition-colors" />
                <Input
                  placeholder="Search by name, email, or BVN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 h-12 bg-muted/20 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl transition-all font-medium"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-40 h-12 bg-muted/20 border-border/40 rounded-xl font-medium">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                {/* <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-full sm:w-40 h-12 bg-muted/20 border-border/40 rounded-xl font-medium">
                    <SelectValue placeholder="Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="Lagos HQ">Lagos HQ</SelectItem>
                    <SelectItem value="Abuja">Abuja</SelectItem>
                    <SelectItem value="Kano">Kano</SelectItem>
                    <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-none h-14">
                    <TableHead className="pl-6 font-bold text-foreground/70 uppercase tracking-tighter text-[11px]">
                      Customer Profile
                    </TableHead>
                    <TableHead className="font-bold text-foreground/70 uppercase tracking-tighter text-[11px]">
                      Contact Info
                    </TableHead>
                    <TableHead className="font-bold text-foreground/70 uppercase tracking-tighter text-[11px]">
                      Affiliation
                    </TableHead>
                    <TableHead className="font-bold text-foreground/70 uppercase tracking-tighter text-[11px]">
                      KYC Tier
                    </TableHead>
                    <TableHead className="font-bold text-foreground/70 uppercase tracking-tighter text-[11px]">
                      Asset Balance
                    </TableHead>
                    <TableHead className="font-bold text-foreground/70 uppercase tracking-tighter text-[11px]">
                      Status
                    </TableHead>
                    <TableHead className="font-bold text-foreground/70 uppercase tracking-tighter text-[11px]">
                      Enrollment
                    </TableHead>
                    <TableHead className="pr-6 text-right font-bold text-foreground/70 uppercase tracking-tighter text-[11px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <CustomerSkeleton />
                  ) : customers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-auto border-none hover:bg-transparent"
                      >
                        <EmptyCustomers onAdd={() => setShowAddDialog(true)} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        className="group border-b border-border/30 hover:bg-muted/40 transition-all cursor-pointer h-20"
                        onClick={() =>
                          navigate(`/account/customers/${customer.id}`)
                        }
                      >
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3.5">
                            <Avatar className="h-11 w-11 border-2 border-background ring-2 ring-primary/5 shadow-sm transition-transform group-hover:scale-105">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.first_name}`}
                              />
                              <AvatarFallback className="bg-primary/5 text-primary font-bold text-xs uppercase">
                                {customer.first_name[0]}
                                {customer.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <div className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                {customer.first_name} {customer.last_name}
                              </div>
                              <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5 leading-none mt-1">
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1 h-4 leading-none border-border/60 text-muted-foreground/80 font-mono"
                                >
                                  BVN: {customer.kyc?.bvn || "UNLINKED"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-semibold opacity-85">
                              {customer.email}
                            </div>
                            <div className="text-[11px] text-muted-foreground flex items-center gap-1 text-xs">
                              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                              {customer.phone_number}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-primary/5 text-primary/70 border-none font-bold text-[10px] py-0.5 shadow-none"
                          >
                            Organisation Client
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="font-bold text-sm">
                              Tier {customer.kyc_level}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono font-bold text-sm">
                            ₦0.00
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell className="text-muted-foreground font-medium text-xs whitespace-nowrap">
                          {new Date(customer.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </TableCell>
                        <TableCell
                          className="pr-6 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 p-2 rounded-xl border-border/50 shadow-xl overflow-hidden backdrop-blur-lg"
                            >
                              <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-2 px-3">
                                Case Management
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onSelect={() =>
                                  navigate(
                                    `/account/customers/${customer.id}`,
                                  )
                                }
                                className="rounded-lg h-10 cursor-pointer gap-2"
                              >
                                <Eye className="h-4 w-4 text-primary/70" />
                                <span className="font-semibold">
                                  Review Profile
                                </span>
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem className="rounded-lg h-10 cursor-pointer gap-2">
                                <Edit className="h-4 w-4 text-warning/70" />
                                <span className="font-semibold">
                                  Modify Data
                                </span>
                              </DropdownMenuItem> */}
                              {/* <DropdownMenuItem
                                onSelect={() =>
                                  setPaymentLinkCustomer(customer)
                                }
                                className="rounded-lg h-10 cursor-pointer gap-2">
                                <LinkIcon className="h-4 w-4 text-success/70" />
                                <span className="font-semibold">
                                  Payment Request
                                </span>
                              </DropdownMenuItem> */}
                              <DropdownMenuSeparator className="bg-border/40 my-1" />
                              {/* <DropdownMenuItem className="rounded-lg h-10 cursor-pointer gap-2 text-error hover:bg-error/10 hover:text-error transition-colors">
                                <Trash2 className="h-4 w-4" />
                                <span className="font-bold">
                                  Restrict Access
                                </span>
                              </DropdownMenuItem> */}
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

          {/* Pagination Controls */}
          {meta && meta.total_pages > 1 && (
            <div className="flex items-center justify-between px-6 py-5 bg-muted/20 border-t border-border/30">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Viewing page {page} of {meta.total_pages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="rounded-lg border-border/60 font-bold h-9 px-4 transition-all hover:bg-muted active:scale-95 disabled:opacity-30 cursor-pointer"
                >
                  Previous
                </Button>
                <div className="flex gap-1">
                  {[...Array(meta.total_pages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? "default" : "ghost"}
                      size="sm"
                      className={`w-9 h-9 rounded-lg font-bold text-xs ${page === i + 1 ? "shadow-fintech bg-primary hover:bg-primary" : "cursor-pointer"}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page === meta.total_pages}
                  className="rounded-lg border-border/60 font-bold h-9 px-4 transition-all hover:bg-muted active:scale-95 disabled:opacity-30 cursor-pointer"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Dialogs */}
      <AddCustomerDialog open={showAddDialog} onOpenChange={setShowAddDialog} />

      {paymentLinkCustomer && (
        <CreateCustomerPaymentLinkDialog
          open={!!paymentLinkCustomer}
          onOpenChange={() => setPaymentLinkCustomer(null)}
          customerId={paymentLinkCustomer.id}
          customerName={`${paymentLinkCustomer.first_name} ${paymentLinkCustomer.last_name}`}
        />
      )}
    </div>
  );
}
