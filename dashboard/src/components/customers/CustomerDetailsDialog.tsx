import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  RefreshCw,
  Shield,
  Lock,
} from "lucide-react";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { ICustomer } from "@/types/customer.types";

interface CustomerDetailsDialogProps {
  customer: ICustomer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetailsDialog({
  customer,
  open,
  onOpenChange,
}: CustomerDetailsDialogProps) {
  if (!customer) return null;

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <Badge className="bg-success-light text-success-foreground border-success">
            Active
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-warning-light text-warning-foreground border-warning">
            Pending
          </Badge>
        );
      case "BLOCKED":
        return (
          <Badge className="bg-error-light text-error-foreground border-error">
            Blocked
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Sample transaction data (kept as sample for now)
  const transactions = [
    {
      id: "TXN001",
      type: "Credit",
      amount: "₦50,000",
      description: "Salary Payment",
      date: "2024-03-15",
      time: "14:30",
      balance: "₦450,000",
      reference: "SAL/2024/03/001",
    },
    {
      id: "TXN002",
      type: "Debit",
      amount: "₦15,000",
      description: "ATM Withdrawal",
      date: "2024-03-14",
      time: "10:45",
      balance: "₦400,000",
      reference: "ATM/2024/03/002",
    },
    {
      id: "TXN003",
      type: "Credit",
      amount: "₦25,000",
      description: "Transfer from John Doe",
      date: "2024-03-13",
      time: "16:20",
      balance: "₦415,000",
      reference: "TRF/2024/03/003",
    },
    {
      id: "TXN004",
      type: "Debit",
      amount: "₦5,000",
      description: "POS Transaction",
      date: "2024-03-12",
      time: "12:15",
      balance: "₦390,000",
      reference: "POS/2024/03/004",
    },
  ];

  // Sample analytics data
  const analyticsData = [
    { name: "Jan", credits: 180000, debits: 120000, balance: 350000 },
    { name: "Feb", credits: 220000, debits: 150000, balance: 420000 },
    { name: "Mar", credits: 195000, debits: 145000, balance: 470000 },
    { name: "Apr", credits: 240000, debits: 160000, balance: 550000 },
    { name: "May", credits: 210000, debits: 140000, balance: 620000 },
    { name: "Jun", credits: 250000, debits: 170000, balance: 700000 },
  ];

  const fullName = `${customer.first_name} ${customer.last_name}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="" />
              <AvatarFallback>
                {customer.first_name[0]}
                {customer.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <span>{fullName}</span>
              <div className="text-sm text-muted-foreground font-normal">
                {customer.email}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Complete customer profile, transaction history, and analytics
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{customer.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium">{customer.phone_number}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Address
                      </div>
                      <div className="font-medium">
                        {customer.kyc?.address_city || "Not provided"},{" "}
                        {customer.kyc?.address_country || ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Join Date
                      </div>
                      <div className="font-medium">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Account Balance
                    </div>
                    <div className="text-2xl font-bold text-primary">₦0.00</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      KYC Level
                    </div>
                    <Badge variant="outline">Level {customer.kyc_level}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">BVN</div>
                    <div className="font-medium">
                      {customer.kyc?.bvn || "Not provided"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    {getStatusBadge(customer.status)}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Statement
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset PIN
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Identity
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-error"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Block Account
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription>Last 5 transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === "Credit"
                              ? "bg-success-light text-success-foreground"
                              : "bg-error-light text-error-foreground"
                          }`}
                        >
                          {transaction.type === "Credit" ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.date} • {transaction.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-medium ${
                            transaction.type === "Credit"
                              ? "text-success"
                              : "text-error"
                          }`}
                        >
                          {transaction.type === "Credit" ? "+" : "-"}
                          {transaction.amount}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.balance}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">
                      Transaction History
                    </CardTitle>
                    <CardDescription>
                      Complete transaction records
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-surface-elevated">
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          className="hover:bg-surface-elevated/50"
                        >
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {transaction.date}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {transaction.time}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {transaction.reference}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.type === "Credit"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              transaction.type === "Credit"
                                ? "text-success"
                                : "text-error"
                            }`}
                          >
                            {transaction.type === "Credit" ? "+" : "-"}
                            {transaction.amount}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {transaction.balance}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Account Balance Trend
                  </CardTitle>
                  <CardDescription>Monthly balance progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart
                    title=""
                    description=""
                    data={analyticsData}
                    type="line"
                    dataKey="balance"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Volume</CardTitle>
                  <CardDescription>Credits vs Debits over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart
                    title=""
                    description=""
                    data={analyticsData}
                    type="bar"
                    dataKey="credits"
                    additionalKeys={["debits"]}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Average Monthly Credits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    ₦216,667
                  </div>
                  <div className="text-sm text-muted-foreground">
                    +12.5% from last period
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Average Monthly Debits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-error">₦147,500</div>
                  <div className="text-sm text-muted-foreground">
                    -5.2% from last period
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Net Monthly Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">₦69,167</div>
                  <div className="text-sm text-muted-foreground">
                    +18.7% from last period
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Status</CardTitle>
                  <CardDescription>
                    Account security and verification status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email Verified</span>
                    <Badge className="bg-success-light text-success-foreground border-success">
                      Verified
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Phone Verified</span>
                    <Badge className="bg-success-light text-success-foreground border-success">
                      Verified
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">BVN Verification</span>
                    <Badge className="bg-success-light text-success-foreground border-success">
                      Verified
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">NIN Verification</span>
                    <Badge className="bg-warning-light text-warning-foreground border-warning">
                      Pending
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Document Upload</span>
                    <Badge className="bg-success-light text-success-foreground border-success">
                      Complete
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Actions</CardTitle>
                  <CardDescription>
                    Manage account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Transaction PIN
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Force Password Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Login History
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Enable 2FA
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-error"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Temporarily Block Account
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Recent Security Events
                </CardTitle>
                <CardDescription>
                  Account access and security logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Successful Login</div>
                      <div className="text-sm text-muted-foreground">
                        Mobile App • Lagos, Nigeria
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      2 hours ago
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">PIN Changed</div>
                      <div className="text-sm text-muted-foreground">
                        Web Portal • Lagos, Nigeria
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      1 day ago
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Failed Login Attempt</div>
                      <div className="text-sm text-muted-foreground">
                        Mobile App • Unknown Location
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      3 days ago
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
