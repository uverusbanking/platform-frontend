"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Search,
  MoreHorizontal,
  Eye,
  // Trash2,
  UserCheck,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { OnboardOrganisationDialog } from "@/components/features/platform/OnboardOrganisationDialog";
import {
  useGetOrganisations,
  useGetOrganisationStatistics,
} from "@/hooks/queries/useOrganisationQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { KPICard } from "@/components/features/dashboard/KPICard";
import { KPICardSkeleton } from "@/components/features/dashboard/KPICardSkeleton";

function OrganisationSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent h-20">
          <TableCell className="pl-6 w-[300px]">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[140px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-[70px] rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
          <TableCell className="pr-6 text-right">
            <Skeleton className="h-8 w-8 ml-auto rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

const statusFilters = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PENDING", label: "Pending" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "CLOSED", label: "Closed" },
  { value: "FROZEN", label: "Frozen" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "RESTRICTED", label: "Restricted" },
];

export default function OrganisationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page] = useState(1);
  const limit = 10;
  const router = useRouter();

  const { data: organisationData, isLoading } = useGetOrganisations({
    page,
    limit,
    search: searchTerm,
    ...(statusFilter && statusFilter !== "all" ? { status: statusFilter } : {}),
  });

  const { data: organisationStats, isLoading: isStatsLoading } =
    useGetOrganisationStatistics();

  const organisations = organisationData?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <Badge className="bg-success/10 hover:bg-success/20 text-success border-success/20 font-medium">
            Active
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-warning/10 hover:bg-warning/20 text-warning border-warning/20 font-medium">
            Pending
          </Badge>
        );
      case "SUSPENDED":
        return (
          <Badge className="bg-error/10 hover:bg-error/20 text-error border-error/20 font-medium">
            Suspended
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

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Organisations
            </h1>
          </div>
          <p className="text-muted-foreground text-lg font-medium max-w-xl">
            Monitor and manage all corporate accounts within the Uverus
            ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* <Button
            variant="outline"
            className="flex-1 md:flex-none border-border/60 hover:bg-muted/50 transition-all font-semibold rounded-xl px-5"
          >
            <Download className="w-4 h-4 mr-2" />
            Report
          </Button> */}
          <OnboardOrganisationDialog />
        </div>
      </div>

      {/* Stats Summary */}
      {isStatsLoading ? (
        <KPICardSkeleton count={3} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <KPICard
            title="Total Organisations"
            value={
              organisationStats?.data?.total_organisations?.toLocaleString() ??
              "N/A"
            }
            change="NIL%"
            changeType="positive"
            description="vs last month"
            icon={ShieldCheck}
          />
          <KPICard
            title="Active Organisations"
            value={
              organisationStats?.data?.total_active_organisations?.toLocaleString() ??
              "N/A"
            }
            change="NIL%"
            changeType="positive"
            description="vs last month"
            icon={UserCheck}
          />
          <KPICard
            title="Pending Organisations"
            value={
              organisationStats?.data?.total_pending_organisations?.toLocaleString() ??
              "N/A"
            }
            change="NIL%"
            changeType="positive"
            description="vs last month"
            icon={AlertCircle}
          />
        </div>
      )}

      {/* Filters Card */}
      <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-30 group-hover:opacity-100 transition-opacity" />
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group/search">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within/search:text-primary transition-colors" />
              <Input
                placeholder="Search by organisation name, registration number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 bg-muted/20 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl transition-all font-medium"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-12 bg-muted/20 border-border/40 rounded-xl font-medium">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusFilters.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    Organisation Profile
                  </TableHead>
                  <TableHead className="font-bold text-foreground/70 uppercase tracking-tighter text-[11px]">
                    Registration (TIN/CAC)
                  </TableHead>
                  <TableHead className="font-bold text-foreground/70 uppercase tracking-tighter text-[11px]">
                    Contact Email
                  </TableHead>
                  <TableHead className="font-bold text-foreground/70 uppercase tracking-tighter text-[11px]">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-foreground/70 uppercase tracking-tighter text-[11px]">
                    Onboarding Date
                  </TableHead>
                  <TableHead className="pr-6 text-right font-bold text-foreground/70 uppercase tracking-tighter text-[11px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <OrganisationSkeleton />
                ) : organisations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3 opacity-50">
                        <Building2 className="w-12 h-12" />
                        <p className="font-medium text-lg text-muted-foreground">
                          No organisations found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  organisations.map((organisation) => (
                    <TableRow
                      key={organisation.id}
                      className="group border-b border-border/30 hover:bg-muted/40 transition-all h-20 cursor-pointer"
                      onClick={() =>
                        router.push(`/account/organisations/${organisation.id}`)
                      }
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3.5">
                          <Avatar className="h-11 w-11 rounded-xl bg-primary/10 text-primary">
                            <AvatarFallback className="font-bold text-xs uppercase">
                              {organisation.organisation_name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <div className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                              {organisation.organisation_name}
                            </div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-1.5 leading-none mt-1">
                              ID: {organisation.id.substring(0, 8)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-foreground/80">
                            TIN: {organisation.tin || "N/A"}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            CAC: {organisation.cac_registration_number || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-semibold opacity-85">
                          {organisation.business_email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(organisation.status)}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium text-xs">
                        {new Date(organisation.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-56 p-2 rounded-xl border-border/50 shadow-xl overflow-hidden backdrop-blur-lg"
                          >
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-2 px-3">
                              Organisation Management
                            </DropdownMenuLabel>
                            <DropdownMenuItem className="rounded-lg h-10 cursor-pointer gap-2">
                              <Eye className="h-4 w-4 text-primary/70" />
                              <span className="font-semibold">
                                View Details
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/40 my-1" />
                            {/* <DropdownMenuItem className="rounded-lg h-10 cursor-pointer gap-2 text-error hover:bg-error/10 hover:text-error transition-colors">
                              <Trash2 className="h-4 w-4" />
                              <span className="font-bold">Suspend Account</span>
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
      </Card>
    </div>
  );
}
