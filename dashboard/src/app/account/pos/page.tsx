"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Search,
  Plus,
  TrendingUp,
  Terminal,
  DollarSign,
  Activity,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";

const POSManagement = () => {
  const transactionData = [
    { name: "Jan", transactions: 8400, volume: 4200000 },
    { name: "Feb", transactions: 10100, volume: 5100000 },
    { name: "Mar", transactions: 12200, volume: 6200000 },
    { name: "Apr", transactions: 11800, volume: 5800000 },
    { name: "May", transactions: 14200, volume: 7200000 },
    { name: "Jun", transactions: 16100, volume: 8100000 },
  ];

  const terminalData = [
    { name: "Active", value: 156 },
    { name: "Inactive", value: 24 },
    { name: "Maintenance", value: 8 },
    { name: "Deactivated", value: 12 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">POS Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage POS terminals and transactions
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Register Terminal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Register New POS Terminal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Terminal ID</Label>
                  <Input placeholder="Enter terminal ID" />
                </div>
                <div>
                  <Label>Serial Number</Label>
                  <Input placeholder="Enter serial number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Terminal Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="mpos">mPOS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Model</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pax-s920">PAX S920</SelectItem>
                      <SelectItem value="ingenico-move5000">
                        Ingenico Move 5000
                      </SelectItem>
                      <SelectItem value="verifone-v400m">
                        Verifone V400m
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Assign to Branch</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lagos">Lagos Branch</SelectItem>
                      <SelectItem value="abuja">Abuja Branch</SelectItem>
                      <SelectItem value="portharcourt">
                        Port Harcourt Branch
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Assign to Agent</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent1">John Doe</SelectItem>
                      <SelectItem value="agent2">Jane Smith</SelectItem>
                      <SelectItem value="agent3">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Merchant Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Register Terminal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Transactions"
          value="72,800"
          change="+16.2%"
          changeType="positive"
          icon={CreditCard}
          trend="up"
        />
        <KPICard
          title="Transaction Volume"
          value="₦36.4M"
          change="+22.5%"
          changeType="positive"
          icon={DollarSign}
          trend="up"
        />
        <KPICard
          title="Active Terminals"
          value="156"
          change="+8"
          changeType="positive"
          icon={Terminal}
          trend="up"
        />
        <KPICard
          title="Uptime"
          value="99.2%"
          change="+0.5%"
          changeType="positive"
          icon={Activity}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Transaction Overview"
          data={transactionData}
          type="bar"
          dataKey="transactions"
          additionalKeys={["volume"]}
        />
        <AnalyticsChart
          title="Terminal Status Distribution"
          data={terminalData}
          type="pie"
        />
      </div>

      <Card className="p-6">
        <Tabs defaultValue="terminals">
          <TabsList>
            <TabsTrigger value="terminals">Terminals</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settlements">Settlements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="terminals" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search terminals..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">Export List</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Terminal ID</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Agent/Branch</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    id: "POS2024001",
                    serial: "SN123456789",
                    agent: "John Doe / Lagos",
                    model: "PAX S920",
                    status: "active",
                    activity: "5 mins ago",
                  },
                  {
                    id: "POS2024002",
                    serial: "SN123456790",
                    agent: "Jane Smith / Abuja",
                    model: "Ingenico Move 5000",
                    status: "active",
                    activity: "12 mins ago",
                  },
                  {
                    id: "POS2024003",
                    serial: "SN123456791",
                    agent: "Mike Johnson / PH",
                    model: "Verifone V400m",
                    status: "inactive",
                    activity: "2 hours ago",
                  },
                  {
                    id: "POS2024004",
                    serial: "SN123456792",
                    agent: "Alice Brown / Lagos",
                    model: "PAX S920",
                    status: "maintenance",
                    activity: "1 day ago",
                  },
                  {
                    id: "POS2024005",
                    serial: "SN123456793",
                    agent: "Bob Wilson / Abuja",
                    model: "Ingenico Move 5000",
                    status: "active",
                    activity: "8 mins ago",
                  },
                ].map((terminal) => (
                  <TableRow key={terminal.id}>
                    <TableCell className="font-medium">{terminal.id}</TableCell>
                    <TableCell>{terminal.serial}</TableCell>
                    <TableCell>{terminal.agent}</TableCell>
                    <TableCell>{terminal.model}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          terminal.status === "active"
                            ? "default"
                            : terminal.status === "inactive"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {terminal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{terminal.activity}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-10" />
              </div>
              <Input type="date" className="w-48" />
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">Export</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Terminal ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Card Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    id: "TXN2024001",
                    terminal: "POS2024001",
                    type: "Purchase",
                    amount: "₦15,500",
                    card: "Mastercard",
                    status: "success",
                    time: "10:45 AM",
                  },
                  {
                    id: "TXN2024002",
                    terminal: "POS2024002",
                    type: "Withdrawal",
                    amount: "₦50,000",
                    card: "Visa",
                    status: "success",
                    time: "10:42 AM",
                  },
                  {
                    id: "TXN2024003",
                    terminal: "POS2024001",
                    type: "Purchase",
                    amount: "₦8,200",
                    card: "Verve",
                    status: "failed",
                    time: "10:38 AM",
                  },
                  {
                    id: "TXN2024004",
                    terminal: "POS2024005",
                    type: "Purchase",
                    amount: "₦32,000",
                    card: "Mastercard",
                    status: "success",
                    time: "10:35 AM",
                  },
                  {
                    id: "TXN2024005",
                    terminal: "POS2024002",
                    type: "Refund",
                    amount: "₦12,500",
                    card: "Visa",
                    status: "pending",
                    time: "10:30 AM",
                  },
                ].map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.id}
                    </TableCell>
                    <TableCell>{transaction.terminal}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.card}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "success"
                            ? "default"
                            : transaction.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.time}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="settlements" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search settlements..." className="pl-10" />
              </div>
              <Input type="date" className="w-48" />
              <Button variant="outline">Generate Report</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Settlement ID</TableHead>
                  <TableHead>Terminal/Agent</TableHead>
                  <TableHead>Transaction Count</TableHead>
                  <TableHead>Gross Amount</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    id: "SET2024001",
                    terminal: "POS2024001",
                    count: 145,
                    gross: "₦1,245,000",
                    fees: "₦24,900",
                    net: "₦1,220,100",
                    status: "completed",
                    date: "2024-01-15",
                  },
                  {
                    id: "SET2024002",
                    terminal: "POS2024002",
                    count: 98,
                    gross: "₦876,500",
                    fees: "₦17,530",
                    net: "₦858,970",
                    status: "completed",
                    date: "2024-01-15",
                  },
                  {
                    id: "SET2024003",
                    terminal: "POS2024005",
                    count: 167,
                    gross: "₦1,567,800",
                    fees: "₦31,356",
                    net: "₦1,536,444",
                    status: "pending",
                    date: "2024-01-16",
                  },
                ].map((settlement) => (
                  <TableRow key={settlement.id}>
                    <TableCell className="font-medium">
                      {settlement.id}
                    </TableCell>
                    <TableCell>{settlement.terminal}</TableCell>
                    <TableCell>{settlement.count}</TableCell>
                    <TableCell>{settlement.gross}</TableCell>
                    <TableCell>{settlement.fees}</TableCell>
                    <TableCell className="font-medium">
                      {settlement.net}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          settlement.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {settlement.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{settlement.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Avg Transaction Value
                </h3>
                <p className="text-3xl font-bold">₦24,350</p>
                <p className="text-sm text-green-600 mt-1">↑ ₦2,100 increase</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Success Rate
                </h3>
                <p className="text-3xl font-bold">96.8%</p>
                <p className="text-sm text-green-600 mt-1">
                  ↑ 1.2% improvement
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Peak Transaction Hour
                </h3>
                <p className="text-3xl font-bold">2:00 PM</p>
                <p className="text-sm text-muted-foreground mt-1">
                  892 transactions/hour
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default POSManagement;
