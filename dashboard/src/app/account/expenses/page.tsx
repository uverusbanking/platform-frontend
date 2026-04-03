"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Receipt,
  TrendingUp,
  Calendar,
  FileText,
  DollarSign,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

// Sample data
const expenses = [
  {
    id: 1,
    date: "2025-01-20",
    category: "Office Supplies",
    description: "Printer paper and toner",
    amount: 45000,
    branch: "Lagos Main",
    requestedBy: "John Doe",
    status: "approved",
    approvedBy: "Admin",
  },
  {
    id: 2,
    date: "2025-01-19",
    category: "Utilities",
    description: "Electricity bill - January",
    amount: 120000,
    branch: "Abuja Center",
    requestedBy: "Jane Smith",
    status: "pending",
    approvedBy: "-",
  },
  {
    id: 3,
    date: "2025-01-18",
    category: "Maintenance",
    description: "AC repair and servicing",
    amount: 85000,
    branch: "Lagos Main",
    requestedBy: "John Doe",
    status: "rejected",
    approvedBy: "Admin",
  },
];

const expenseCategories = [
  {
    id: 1,
    name: "Office Supplies",
    budget: 500000,
    spent: 245000,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Utilities",
    budget: 800000,
    spent: 620000,
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Maintenance",
    budget: 600000,
    spent: 385000,
    color: "bg-yellow-500",
  },
  {
    id: 4,
    name: "Marketing",
    budget: 1000000,
    spent: 450000,
    color: "bg-purple-500",
  },
  {
    id: 5,
    name: "Transport",
    budget: 300000,
    spent: 180000,
    color: "bg-orange-500",
  },
];

const monthlyExpenses = [
  { month: "Jan", amount: 1200000 },
  { month: "Feb", amount: 950000 },
  { month: "Mar", amount: 1100000 },
  { month: "Apr", amount: 1050000 },
  { month: "May", amount: 1300000 },
  { month: "Jun", amount: 980000 },
];

export default function Expenses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingCount = expenses.filter(
    (exp) => exp.status === "pending",
  ).length;
  const approvedCount = expenses.filter(
    (exp) => exp.status === "approved",
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Expense Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage organizational expenses
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenseCategories.length}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Expenses</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* All Expenses Tab */}
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Expense Records</CardTitle>
                  <CardDescription>
                    View and manage all expenses
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Record New Expense</DialogTitle>
                      <DialogDescription>
                        Enter expense details
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="expenseDate">Date</Label>
                        <Input id="expenseDate" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expenseCategory">Category</Label>
                        <Select>
                          <SelectTrigger id="expenseCategory">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseCategories.map((cat) => (
                              <SelectItem
                                key={cat.id}
                                value={cat.name.toLowerCase()}
                              >
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expenseAmount">Amount (₦)</Label>
                        <Input
                          id="expenseAmount"
                          type="number"
                          placeholder="50000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expenseBranch">Branch</Label>
                        <Select>
                          <SelectTrigger id="expenseBranch">
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lagos">Lagos Main</SelectItem>
                            <SelectItem value="abuja">Abuja Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="expenseDesc">Description</Label>
                        <Textarea
                          id="expenseDesc"
                          placeholder="Describe the expense..."
                          rows={3}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="receipt">Receipt/Invoice</Label>
                        <Input
                          id="receipt"
                          type="file"
                          accept="image/*,application/pdf"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() =>
                          toast.success("Expense recorded successfully")
                        }
                      >
                        Submit for Approval
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name.toLowerCase()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{expense.category}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {expense.description}
                        </TableCell>
                        <TableCell>{expense.branch}</TableCell>
                        <TableCell>{expense.requestedBy}</TableCell>
                        <TableCell className="font-medium">
                          ₦{expense.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              expense.status === "approved"
                                ? "default"
                                : expense.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Approval Tab */}
        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Review and approve expense requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses
                  .filter((exp) => exp.status === "pending")
                  .map((expense) => (
                    <div
                      key={expense.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{expense.category}</Badge>
                            <Badge variant="secondary">{expense.branch}</Badge>
                          </div>
                          <h4 className="font-medium mb-1">
                            {expense.description}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Requested by {expense.requestedBy} on {expense.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            ₦{expense.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => toast.success("Expense approved")}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => toast.error("Expense rejected")}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Receipt className="mr-2 h-4 w-4" />
                          View Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Expense Categories</CardTitle>
                  <CardDescription>
                    Manage expense categories and budgets
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Expense Category</DialogTitle>
                      <DialogDescription>
                        Define a new expense category
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="categoryName">Category Name</Label>
                        <Input
                          id="categoryName"
                          placeholder="e.g., Office Supplies"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryBudget">
                          Monthly Budget (₦)
                        </Label>
                        <Input
                          id="categoryBudget"
                          type="number"
                          placeholder="500000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryDesc">Description</Label>
                        <Textarea
                          id="categoryDesc"
                          placeholder="Category description..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() =>
                          toast.success("Category created successfully")
                        }
                      >
                        Create Category
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseCategories.map((category) => {
                  const percentage = (category.spent / category.budget) * 100;
                  const isOverBudget = percentage > 100;

                  return (
                    <div key={category.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 ${category.color} rounded-lg`}
                          />
                          <div>
                            <h4 className="font-medium">{category.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ₦{category.spent.toLocaleString()} of ₦
                              {category.budget.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={isOverBudget ? "destructive" : "default"}
                        >
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 mb-3">
                        <div
                          className={`h-2 rounded-full ${
                            isOverBudget ? "bg-destructive" : category.color
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          View Trends
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expense Trend</CardTitle>
                <CardDescription>Last 6 months overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyExpenses.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.month}</span>
                      </div>
                      <span className="font-bold">
                        ₦{item.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Export expense reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary Report</SelectItem>
                      <SelectItem value="detailed">Detailed Report</SelectItem>
                      <SelectItem value="category">
                        Category Analysis
                      </SelectItem>
                      <SelectItem value="branch">Branch Comparison</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" />
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full"
                  onClick={() => toast.success("Report generated")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
