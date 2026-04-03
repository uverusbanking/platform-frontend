"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Users,
  DollarSign,
  Activity,
  MoreHorizontal,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KPICard } from "@/components/features/dashboard/KPICard";
import { AnalyticsChart } from "@/components/features/dashboard/AnalyticsChart";
import { CreatePaymentLinkDialog } from "@/components/features/branches/CreatePaymentLinkDialog";

const branches = [
  {
    id: "BR001",
    name: "Lagos Headquarters",
    code: "LHQ",
    manager: "Adunni Okafor",
    address: "Victoria Island, Lagos",
    phone: "+234 701 234 5678",
    email: "lagos.hq@platpay.com",
    status: "Active",
    balance: "₦5,847,290",
    customers: 2847,
    staff: 15,
    transactions: 15234,
    established: "2020-01-15",
  },
  {
    id: "BR002",
    name: "Abuja Branch",
    code: "ABJ",
    manager: "Ibrahim Hassan",
    address: "Central Business District, Abuja",
    phone: "+234 702 345 6789",
    email: "abuja@platpay.com",
    status: "Active",
    balance: "₦3,245,100",
    customers: 1567,
    staff: 8,
    transactions: 8945,
    established: "2021-03-20",
  },
  {
    id: "BR003",
    name: "Kano Branch",
    code: "KNO",
    manager: "Fatima Usman",
    address: "Sabon Gari, Kano",
    phone: "+234 703 456 7890",
    email: "kano@platpay.com",
    status: "Active",
    balance: "₦2,134,850",
    customers: 934,
    staff: 6,
    transactions: 5621,
    established: "2021-08-10",
  },
  {
    id: "BR004",
    name: "Port Harcourt Branch",
    code: "PHC",
    manager: "Emeka Nwosu",
    address: "GRA Phase 2, Port Harcourt",
    phone: "+234 704 567 8901",
    email: "portharcourt@platpay.com",
    status: "Maintenance",
    balance: "₦1,876,420",
    customers: 756,
    staff: 5,
    transactions: 4321,
    established: "2022-02-14",
  },
];

const Branches = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<
    (typeof branches)[0] | null
  >(null);
  const [paymentLinkBranch, setPaymentLinkBranch] = useState<
    (typeof branches)[0] | null
  >(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-success-light text-success-foreground border-success">
            Active
          </Badge>
        );
      case "Maintenance":
        return (
          <Badge className="bg-warning-light text-warning-foreground border-warning">
            Maintenance
          </Badge>
        );
      case "Closed":
        return (
          <Badge className="bg-error-light text-error-foreground border-error">
            Closed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.manager.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const branchAnalytics = [
    { name: "Jan", transactions: 45000, customers: 2400, revenue: 850000 },
    { name: "Feb", transactions: 52000, customers: 2567, revenue: 920000 },
    { name: "Mar", transactions: 48000, customers: 2634, revenue: 880000 },
    { name: "Apr", transactions: 61000, customers: 2789, revenue: 1050000 },
    { name: "May", transactions: 73000, customers: 2847, revenue: 1200000 },
    { name: "Jun", transactions: 68000, customers: 2891, revenue: 1150000 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Branch Management
          </h1>
          <p className="text-muted-foreground">
            Manage branch operations, staff, and analytics across all locations.
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-dark shadow-fintech">
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Branches"
          value={branches.length.toString()}
          change="+2 this quarter"
          changeType="positive"
          icon={MapPin}
        />
        <KPICard
          title="Total Staff"
          value={branches
            .reduce((sum, branch) => sum + branch.staff, 0)
            .toString()}
          change="+5.2%"
          changeType="positive"
          icon={Users}
        />
        <KPICard
          title="Total Customers"
          value={branches
            .reduce((sum, branch) => sum + branch.customers, 0)
            .toLocaleString()}
          change="+12.1%"
          changeType="positive"
          icon={Users}
        />
        <KPICard
          title="Combined Balance"
          value="₦13.1M"
          change="+8.7%"
          changeType="positive"
          icon={DollarSign}
        />
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card shadow-fintech">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filters</CardTitle>
          <CardDescription>
            Find branches by name, code, or manager
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branches Table */}
      <Card className="bg-gradient-card shadow-fintech">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Branch List</CardTitle>
              <CardDescription>
                Showing {filteredBranches.length} of {branches.length} branches
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-surface-elevated">
                  <TableHead>Branch</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Customers</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.map((branch) => (
                  <TableRow
                    key={branch.id}
                    className="hover:bg-surface-elevated/50"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{branch.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {branch.code}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {branch.manager
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{branch.manager}</div>
                          <div className="text-sm text-muted-foreground">
                            {branch.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{branch.address}</div>
                        <div className="text-sm text-muted-foreground">
                          {branch.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {branch.balance}
                    </TableCell>
                    <TableCell>{branch.customers.toLocaleString()}</TableCell>
                    <TableCell>{branch.staff}</TableCell>
                    <TableCell>{getStatusBadge(branch.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setSelectedBranch(branch);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            </DialogTrigger>
                          </Dialog>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Branch
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setPaymentLinkBranch(branch)}
                          >
                            <Link className="mr-2 h-4 w-4" />
                            Create Payment Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-error">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Branch Details Dialog */}
      {selectedBranch && (
        <Dialog
          open={!!selectedBranch}
          onOpenChange={() => setSelectedBranch(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedBranch.name} - Details & Analytics
              </DialogTitle>
              <DialogDescription>
                Comprehensive overview of branch performance and operations
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Branch Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Branch Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Code:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedBranch.code}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Manager:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedBranch.manager}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Established:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedBranch.established}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status:
                      </span>
                      {getStatusBadge(selectedBranch.status)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Balance:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedBranch.balance}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Customers:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedBranch.customers.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Staff:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedBranch.staff}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Transactions:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedBranch.transactions.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Branch Analytics</CardTitle>
                  <CardDescription>Monthly performance trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart
                    title=""
                    description=""
                    data={branchAnalytics}
                    type="bar"
                    dataKey="transactions"
                    additionalKeys={["customers", "revenue"]}
                  />
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Payment Link Dialog */}
      {paymentLinkBranch && (
        <CreatePaymentLinkDialog
          open={!!paymentLinkBranch}
          onOpenChange={() => setPaymentLinkBranch(null)}
          branchId={paymentLinkBranch.id}
          branchName={paymentLinkBranch.name}
        />
      )}
    </div>
  );
};

export default Branches;
