"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { KPICard } from "@/components/features/dashboard/KPICard";
import { AnalyticsChart } from "@/components/features/dashboard/AnalyticsChart";
import { toast } from "sonner";

const Loans = () => {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);

  // Mock data for loan products
  const loanProducts = [
    {
      id: "LP001",
      name: "Personal Loan",
      interestRate: 12.5,
      maxAmount: 500000,
      minAmount: 10000,
      tenure: "6-24 months",
      status: "active",
      totalLoans: 45,
      totalAmount: 15000000,
    },
    {
      id: "LP002",
      name: "Business Loan",
      interestRate: 15.0,
      maxAmount: 2000000,
      minAmount: 50000,
      tenure: "12-36 months",
      status: "active",
      totalLoans: 23,
      totalAmount: 28000000,
    },
    {
      id: "LP003",
      name: "Emergency Loan",
      interestRate: 18.0,
      maxAmount: 100000,
      minAmount: 5000,
      tenure: "1-6 months",
      status: "inactive",
      totalLoans: 12,
      totalAmount: 800000,
    },
  ];

  // Mock data for loans
  const loans = [
    {
      id: "LN001",
      customer: "John Doe",
      product: "Personal Loan",
      amount: 150000,
      interestRate: 12.5,
      tenure: "12 months",
      status: "active",
      nextPayment: "2024-02-15",
      totalPaid: 75000,
      balance: 87500,
      applicationDate: "2024-01-15",
    },
    {
      id: "LN002",
      customer: "Jane Smith",
      product: "Business Loan",
      amount: 500000,
      interestRate: 15.0,
      tenure: "24 months",
      status: "pending",
      nextPayment: "2024-02-01",
      totalPaid: 0,
      balance: 575000,
      applicationDate: "2024-01-20",
    },
    {
      id: "LN003",
      customer: "Mike Johnson",
      product: "Personal Loan",
      amount: 75000,
      interestRate: 12.5,
      tenure: "6 months",
      status: "completed",
      nextPayment: "-",
      totalPaid: 84375,
      balance: 0,
      applicationDate: "2023-08-15",
    },
  ];

  const handleProductAction = (action: string, productId?: string) => {
    toast(`Product ${action}`, {
      description: `Loan product has been ${action.toLowerCase()} successfully.`,
    });
    setIsProductDialogOpen(false);
  };

  const handleLoanAction = (action: string, loanId: string) => {
    toast(`Loan ${action}`, {
      description: `Loan ${loanId} has been ${action.toLowerCase()} successfully.`,
    });
    setIsLoanDialogOpen(false);
  };

  // Mock chart data
  const loanTrendsData = [
    { name: "Jan", applications: 45, approved: 38, disbursed: 35 },
    { name: "Feb", applications: 52, approved: 44, disbursed: 41 },
    { name: "Mar", applications: 48, approved: 40, disbursed: 38 },
    { name: "Apr", applications: 61, approved: 52, disbursed: 49 },
    { name: "May", applications: 55, approved: 47, disbursed: 44 },
    { name: "Jun", applications: 67, approved: 58, disbursed: 55 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Loan Management</h1>
        <div className="flex gap-2">
          <Dialog
            open={isProductDialogOpen}
            onOpenChange={setIsProductDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Loan Product</DialogTitle>
                <DialogDescription>
                  Create a new loan product with terms and conditions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input id="product-name" placeholder="Enter product name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <Input
                      id="interest-rate"
                      type="number"
                      placeholder="12.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenure">Tenure</Label>
                    <Input id="tenure" placeholder="6-24 months" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-amount">Min Amount (₦)</Label>
                    <Input id="min-amount" type="number" placeholder="10000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-amount">Max Amount (₦)</Label>
                    <Input id="max-amount" type="number" placeholder="500000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Product description and terms"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsProductDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => handleProductAction("Created")}>
                  Create Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Loans" value="80" change="+12%" icon={Users} />
        <KPICard
          title="Active Amount"
          value="₦43.8M"
          change="+8%"
          icon={DollarSign}
        />
        <KPICard
          title="Interest Earned"
          value="₦2.1M"
          change="+15%"
          icon={TrendingUp}
        />
        <KPICard
          title="Default Rate"
          value="2.3%"
          change="-0.5%"
          icon={AlertCircle}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Application Trends</CardTitle>
            <CardDescription>
              Monthly loan applications and approvals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              title="Loan Application Trends"
              description="Monthly loan applications and approvals"
              data={loanTrendsData}
              type="line"
              dataKey="applications"
              additionalKeys={["approved", "disbursed"]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Loan Portfolio Distribution</CardTitle>
            <CardDescription>Distribution by loan products</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              title="Loan Portfolio Distribution"
              description="Distribution by loan products"
              data={[
                { name: "Personal Loan", value: 45, amount: 15000000 },
                { name: "Business Loan", value: 23, amount: 28000000 },
                { name: "Emergency Loan", value: 12, amount: 800000 },
              ]}
              type="pie"
              dataKey="value"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="loans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="loans">All Loans</TabsTrigger>
          <TabsTrigger value="products">Loan Products</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="repayments">Repayments</TabsTrigger>
        </TabsList>

        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>All Loans</CardTitle>
              <CardDescription>Manage all loan accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Input placeholder="Search loans..." className="flex-1" />
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Payment</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.id}</TableCell>
                      <TableCell>{loan.customer}</TableCell>
                      <TableCell>{loan.product}</TableCell>
                      <TableCell>₦{loan.amount.toLocaleString()}</TableCell>
                      <TableCell>{loan.interestRate}%</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            loan.status === "active"
                              ? "default"
                              : loan.status === "pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {loan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{loan.nextPayment}</TableCell>
                      <TableCell>₦{loan.balance.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLoanAction("View", loan.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLoanAction("Edit", loan.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Loan Products</CardTitle>
              <CardDescription>
                Manage loan product configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Amount Range</TableHead>
                    <TableHead>Tenure</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Loans</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loanProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.id}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.interestRate}%</TableCell>
                      <TableCell>
                        ₦{product.minAmount.toLocaleString()} - ₦
                        {product.maxAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>{product.tenure}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.totalLoans}</TableCell>
                      <TableCell>
                        ₦{product.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleProductAction("Edit", product.id)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleProductAction("Delete", product.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Loan Applications</CardTitle>
              <CardDescription>
                Review and process loan applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Loan applications management interface will be implemented here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repayments">
          <Card>
            <CardHeader>
              <CardTitle>Repayment Schedule</CardTitle>
              <CardDescription>
                Track loan repayments and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Repayment management interface will be implemented here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Loans;
