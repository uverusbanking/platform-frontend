"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRightLeft,
  Building2,
  Clock,
  Globe,
  Search,
  Download,
  Phone,
  Wifi,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useGetCustomerById } from "@/hooks/endpoints/useCustomerHook";
import BankTransfers from "./BankTransfers";

type tabTypes =
  | "wallet-transfer"
  | "business-transfer"
  | "bank-transfer"
  | "pending"
  | "international"
  | "history"
  | "tsq"
  | "airtime"
  | "data";
const tabTypeList: tabTypes[] = [
  "wallet-transfer",
  "business-transfer",
  "bank-transfer",
  "pending",
  "international",
  "history",
  "tsq",
  "airtime",
  "data",
];

const EBanking = () => {
  const searchParams = useSearchParams();
  // Set activeTab from searchParams only once on mount
  const [activeTab, setActiveTab] = useState<tabTypes | string>(() => {
    const tabParam = searchParams.get("tab");
    return tabParam && tabTypeList.includes(tabParam as tabTypes)
      ? tabParam
      : "bank-transfer";
  });
  const customerId = searchParams.get("customer_id");
  const { data: customerResponse } = useGetCustomerById(`${customerId}`);
  const customer = customerResponse?.data;

  // Mock data for transactions
  const transactions = [
    {
      id: "TXN001",
      type: "Wallet Transfer",
      amount: 50000,
      from: "John Doe",
      to: "Jane Smith",
      status: "completed",
      date: "2024-01-15",
      reference: "REF001",
    },
    {
      id: "TXN002",
      type: "Bank Transfer",
      amount: 100000,
      from: "Branch Account",
      to: "GTBank - 0123456789",
      status: "pending",
      date: "2024-01-15",
      reference: "REF002",
    },
    {
      id: "TXN003",
      type: "International",
      amount: 250000,
      from: "Company",
      to: "USD Account",
      status: "failed",
      date: "2024-01-14",
      reference: "REF003",
    },
  ];

  const pendingTransfers = [
    {
      id: "PTX001",
      type: "Bank Transfer",
      amount: 75000,
      branch: "Lagos Branch",
      initiatedBy: "Admin User",
      date: "2024-01-15",
      reason: "Insufficient funds",
    },
    {
      id: "PTX002",
      type: "International",
      amount: 200000,
      branch: "Abuja Branch",
      initiatedBy: "Branch Manager",
      date: "2024-01-14",
      reason: "Verification required",
    },
  ];

  const handleTransfer = (type: string) => {
    toast("Transfer Initiated", {
      description: `${type} transfer has been processed successfully.`,
    });
  };

  const handlePendingAction = (action: string, id: string) => {
    toast(`Transfer ${action}`, {
      description: `Transaction ${id} has been ${action.toLowerCase()}.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">E-Banking</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-4 lg:grid-cols-9 w-full">
          <TabsTrigger value="wallet-transfer">Wallet Transfer</TabsTrigger>
          <TabsTrigger value="business-transfer">Business</TabsTrigger>
          <TabsTrigger value="bank-transfer">Bank Transfer</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="international">International</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="tsq">TSQ</TabsTrigger>
          <TabsTrigger value="airtime">Airtime</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="wallet-transfer">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Wallet to Wallet Transfer
              </CardTitle>
              <CardDescription>
                Transfer funds between user wallets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-wallet">From Wallet</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">John Doe - ₦150,000</SelectItem>
                      <SelectItem value="user2">
                        Jane Smith - ₦250,000
                      </SelectItem>
                      <SelectItem value="user3">
                        Mike Johnson - ₦80,000
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to-wallet">To Wallet</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user4">Sarah Wilson</SelectItem>
                      <SelectItem value="user5">David Brown</SelectItem>
                      <SelectItem value="user6">Lisa Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input id="amount" type="number" placeholder="Enter amount" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference</Label>
                  <Input id="reference" placeholder="Transaction reference" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="narration">Narration</Label>
                <Textarea id="narration" placeholder="Transfer description" />
              </div>
              <Button
                onClick={() => handleTransfer("Wallet")}
                className="w-full"
              >
                Process Transfer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business-transfer">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Transfers
              </CardTitle>
              <CardDescription>
                Transfer funds to business accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-account">Business Account</Label>
                  <Input
                    id="business-account"
                    placeholder="Business account number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input
                    id="business-name"
                    placeholder="Recipient business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-amount">Amount (₦)</Label>
                  <Input
                    id="business-amount"
                    type="number"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-bank">Bank</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gtbank">GTBank</SelectItem>
                      <SelectItem value="access">Access Bank</SelectItem>
                      <SelectItem value="zenith">Zenith Bank</SelectItem>
                      <SelectItem value="uba">UBA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => handleTransfer("Business")}
                className="w-full"
              >
                Process Business Transfer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank-transfer">
          <BankTransfers customer={customer} />
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Transfers
              </CardTitle>
              <CardDescription>
                Manage pending and failed transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Initiated By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-medium">
                        {transfer.id}
                      </TableCell>
                      <TableCell>{transfer.type}</TableCell>
                      <TableCell>₦{transfer.amount.toLocaleString()}</TableCell>
                      <TableCell>{transfer.branch}</TableCell>
                      <TableCell>{transfer.initiatedBy}</TableCell>
                      <TableCell>{transfer.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{transfer.reason}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handlePendingAction("Retry", transfer.id)
                            }
                          >
                            Retry
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handlePendingAction("Refund", transfer.id)
                            }
                          >
                            Refund
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handlePendingAction("Cancel", transfer.id)
                            }
                          >
                            Cancel
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

        <TabsContent value="international">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                International Transfers
              </CardTitle>
              <CardDescription>Send money internationally</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source-currency">Source Currency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ngn">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dest-currency">Destination Currency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intl-amount">Amount</Label>
                  <Input
                    id="intl-amount"
                    type="number"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exchange-rate">Exchange Rate</Label>
                  <Input id="exchange-rate" value="1550.00 NGN/USD" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient-name">Recipient Name</Label>
                  <Input id="recipient-name" placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient-country">Country</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => handleTransfer("International")}
                className="w-full"
              >
                Process International Transfer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>
                View all transactions with search and export options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Search transactions..."
                  className="flex-1"
                />
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="wallet">Wallet Transfer</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.id}
                      </TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>
                        ₦{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{transaction.from}</TableCell>
                      <TableCell>{transaction.to}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : transaction.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tsq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Transaction Status Query (TSQ)
              </CardTitle>
              <CardDescription>Verify and reverse transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction-ref">Transaction Reference</Label>
                  <Input
                    id="transaction-ref"
                    placeholder="Enter transaction reference"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="query-type">Query Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select query type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status">Status Check</SelectItem>
                      <SelectItem value="reverse">
                        Reverse Transaction
                      </SelectItem>
                      <SelectItem value="verify">Verify Transaction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Query Transaction
                </Button>
                <Button variant="destructive" className="flex-1">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Reverse Transaction
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="airtime">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Buy Airtime
              </CardTitle>
              <CardDescription>Purchase airtime for customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input id="phone-number" placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="network">Network Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtn">MTN</SelectItem>
                      <SelectItem value="glo">Glo</SelectItem>
                      <SelectItem value="airtel">Airtel</SelectItem>
                      <SelectItem value="9mobile">9mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="airtime-amount">Amount (₦)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">₦100</SelectItem>
                      <SelectItem value="200">₦200</SelectItem>
                      <SelectItem value="500">₦500</SelectItem>
                      <SelectItem value="1000">₦1,000</SelectItem>
                      <SelectItem value="custom">Custom Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-wallet">Deduct From</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer Wallet</SelectItem>
                      <SelectItem value="branch">Branch Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => handleTransfer("Airtime")}
                className="w-full"
              >
                Purchase Airtime
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Buy Data
              </CardTitle>
              <CardDescription>
                Purchase data bundles for customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data-phone">Phone Number</Label>
                  <Input id="data-phone" placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-network">Network Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtn">MTN</SelectItem>
                      <SelectItem value="glo">Glo</SelectItem>
                      <SelectItem value="airtel">Airtel</SelectItem>
                      <SelectItem value="9mobile">9mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-plan">Data Plan</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500mb">500MB - ₦500</SelectItem>
                      <SelectItem value="1gb">1GB - ₦1,000</SelectItem>
                      <SelectItem value="2gb">2GB - ₦2,000</SelectItem>
                      <SelectItem value="5gb">5GB - ₦4,500</SelectItem>
                      <SelectItem value="10gb">10GB - ₦8,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-wallet">Deduct From</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer Wallet</SelectItem>
                      <SelectItem value="branch">Branch Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => handleTransfer("Data")} className="w-full">
                Purchase Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EBanking;
