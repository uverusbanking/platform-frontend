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
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  Search,
  Plus,
  TrendingUp,
  Users,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";

const USSDManagement = () => {
  const sessionsData = [
    { name: "Jan", sessions: 4200, successful: 3800, failed: 400 },
    { name: "Feb", sessions: 5100, successful: 4700, failed: 400 },
    { name: "Mar", sessions: 6200, successful: 5800, failed: 400 },
    { name: "Apr", sessions: 5800, successful: 5300, failed: 500 },
    { name: "May", sessions: 7200, successful: 6800, failed: 400 },
    { name: "Jun", sessions: 8100, successful: 7600, failed: 500 },
  ];

  const usageData = [
    { name: "Balance Inquiry", value: 3200 },
    { name: "Transfer", value: 2100 },
    { name: "Airtime", value: 1800 },
    { name: "Bill Payment", value: 900 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">USSD Banking</h1>
          <p className="text-muted-foreground">
            Manage USSD services and monitor usage
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Configure Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configure USSD Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Service Code</Label>
                  <Input placeholder="*737#" />
                </div>
                <div>
                  <Label>Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtn">MTN</SelectItem>
                      <SelectItem value="glo">Glo</SelectItem>
                      <SelectItem value="airtel">Airtel</SelectItem>
                      <SelectItem value="9mobile">9Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Menu Structure</Label>
                <Textarea placeholder="Define menu structure..." rows={8} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Session Timeout (seconds)</Label>
                  <Input type="number" defaultValue={180} />
                </div>
                <div>
                  <Label>Max Attempts</Label>
                  <Input type="number" defaultValue={3} />
                </div>
              </div>
              <Button className="w-full">Save Configuration</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Sessions"
          value="37,400"
          change="+12.5%"
          changeType="positive"
          icon={Phone}
          trend="up"
        />
        <KPICard
          title="Success Rate"
          value="94.2%"
          change="+2.1%"
          changeType="positive"
          icon={TrendingUp}
          trend="up"
        />
        <KPICard
          title="Active Users"
          value="8,543"
          change="+8.3%"
          changeType="positive"
          icon={Users}
          trend="up"
        />
        <KPICard
          title="Revenue (MTD)"
          value="₦124,500"
          change="+15.2%"
          changeType="positive"
          icon={DollarSign}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="USSD Sessions Overview"
          data={sessionsData}
          type="area"
          dataKey="sessions"
          additionalKeys={["successful", "failed"]}
        />
        <AnalyticsChart
          title="Service Usage Distribution"
          data={usageData}
          type="pie"
        />
      </div>

      <Card className="p-6">
        <Tabs defaultValue="sessions">
          <TabsList>
            <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
            <TabsTrigger value="logs">Transaction Logs</TabsTrigger>
            <TabsTrigger value="config">Service Configuration</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search sessions..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    id: "USS001",
                    phone: "080XXXXX123",
                    service: "Balance Inquiry",
                    duration: "45s",
                    status: "completed",
                    time: "2 mins ago",
                  },
                  {
                    id: "USS002",
                    phone: "081XXXXX456",
                    service: "Transfer",
                    duration: "120s",
                    status: "active",
                    time: "5 mins ago",
                  },
                  {
                    id: "USS003",
                    phone: "070XXXXX789",
                    service: "Airtime Purchase",
                    duration: "30s",
                    status: "completed",
                    time: "8 mins ago",
                  },
                  {
                    id: "USS004",
                    phone: "090XXXXX234",
                    service: "Bill Payment",
                    duration: "180s",
                    status: "failed",
                    time: "12 mins ago",
                  },
                  {
                    id: "USS005",
                    phone: "081XXXXX567",
                    service: "Balance Inquiry",
                    duration: "35s",
                    status: "completed",
                    time: "15 mins ago",
                  },
                ].map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.id}</TableCell>
                    <TableCell>{session.phone}</TableCell>
                    <TableCell>{session.service}</TableCell>
                    <TableCell>{session.duration}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          session.status === "completed"
                            ? "default"
                            : session.status === "active"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{session.time}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search logs..." className="pl-10" />
              </div>
              <Input type="date" className="w-48" />
              <Button variant="outline">Export Logs</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    id: "TXN001",
                    customer: "080XXXXX123",
                    type: "Transfer",
                    amount: "₦5,000",
                    status: "success",
                    time: "10:45 AM",
                  },
                  {
                    id: "TXN002",
                    customer: "081XXXXX456",
                    type: "Airtime",
                    amount: "₦500",
                    status: "success",
                    time: "10:42 AM",
                  },
                  {
                    id: "TXN003",
                    customer: "070XXXXX789",
                    type: "Bill Payment",
                    amount: "₦2,500",
                    status: "failed",
                    time: "10:38 AM",
                  },
                ].map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.id}</TableCell>
                    <TableCell>{log.customer}</TableCell>
                    <TableCell>{log.type}</TableCell>
                    <TableCell>{log.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.status === "success" ? "default" : "destructive"
                        }
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.time}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Service Providers</h3>
              <div className="space-y-4">
                {[
                  {
                    name: "MTN USSD Gateway",
                    code: "*737#",
                    status: "active",
                    sessions: "15,234",
                  },
                  {
                    name: "Glo USSD Gateway",
                    code: "*805#",
                    status: "active",
                    sessions: "8,456",
                  },
                  {
                    name: "Airtel USSD Gateway",
                    code: "*432#",
                    status: "active",
                    sessions: "9,876",
                  },
                  {
                    name: "9Mobile USSD Gateway",
                    code: "*329#",
                    status: "inactive",
                    sessions: "3,834",
                  },
                ].map((provider) => (
                  <div
                    key={provider.code}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{provider.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Code: {provider.code}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {provider.sessions}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total Sessions
                        </p>
                      </div>
                      <Badge
                        variant={
                          provider.status === "active" ? "default" : "secondary"
                        }
                      >
                        {provider.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Avg Session Duration
                </h3>
                <p className="text-3xl font-bold">1m 45s</p>
                <p className="text-sm text-green-600 mt-1">
                  ↓ 15s from last month
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Peak Hour
                </h3>
                <p className="text-3xl font-bold">2:00 PM</p>
                <p className="text-sm text-muted-foreground mt-1">
                  4,234 sessions/hour
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Error Rate
                </h3>
                <p className="text-3xl font-bold">5.8%</p>
                <p className="text-sm text-green-600 mt-1">
                  ↓ 2.1% improvement
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default USSDManagement;
