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
  MessageSquare,
  Search,
  Plus,
  TrendingUp,
  Users,
  Send,
  DollarSign,
} from "lucide-react";
import { KPICard } from "@/components/features/dashboard/KPICard";
import { AnalyticsChart } from "@/components/features/dashboard/AnalyticsChart";

const WhatsAppManagement = () => {
  const messagesData = [
    { name: "Jan", sent: 12400, delivered: 12100, read: 11800 },
    { name: "Feb", sent: 15100, delivered: 14800, read: 14200 },
    { name: "Mar", sent: 18200, delivered: 17900, read: 17100 },
    { name: "Apr", sent: 16800, delivered: 16400, read: 15800 },
    { name: "May", sent: 21200, delivered: 20800, read: 19900 },
    { name: "Jun", sent: 24100, delivered: 23600, read: 22800 },
  ];

  const categoryData = [
    { name: "Account Alerts", value: 8200 },
    { name: "Transaction Receipts", value: 6100 },
    { name: "Marketing", value: 4800 },
    { name: "Support", value: 2900 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">WhatsApp Banking</h1>
          <p className="text-muted-foreground">
            Manage WhatsApp Business integration and messages
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Send Broadcast
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send WhatsApp Broadcast</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Recipient Group</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="active">Active Customers</SelectItem>
                    <SelectItem value="vip">VIP Customers</SelectItem>
                    <SelectItem value="custom">Custom Segment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Message Template</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alert">Account Alert</SelectItem>
                    <SelectItem value="promo">Promotional</SelectItem>
                    <SelectItem value="statement">Statement</SelectItem>
                    <SelectItem value="custom">Custom Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Message Content</Label>
                <Textarea placeholder="Type your message..." rows={6} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Schedule Send</Label>
                  <Input type="datetime-local" />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">Send Now</Button>
                <Button variant="outline" className="flex-1">
                  Schedule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Messages Sent"
          value="108,100"
          change="+18.4%"
          changeType="positive"
          icon={Send}
          trend="up"
        />
        <KPICard
          title="Delivery Rate"
          value="97.9%"
          change="+1.2%"
          changeType="positive"
          icon={TrendingUp}
          trend="up"
        />
        <KPICard
          title="Active Conversations"
          value="2,543"
          change="+12.8%"
          changeType="positive"
          icon={MessageSquare}
          trend="up"
        />
        <KPICard
          title="Cost (MTD)"
          value="₦54,200"
          change="+8.5%"
          changeType="neutral"
          icon={DollarSign}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Message Delivery Overview"
          data={messagesData}
          type="area"
          dataKey="sent"
          additionalKeys={["delivered", "read"]}
        />
        <AnalyticsChart
          title="Messages by Category"
          data={categoryData}
          type="pie"
        />
      </div>

      <Card className="p-6">
        <Tabs defaultValue="conversations">
          <TabsList>
            <TabsTrigger value="conversations">
              Active Conversations
            </TabsTrigger>
            <TabsTrigger value="broadcasts">Broadcast History</TabsTrigger>
            <TabsTrigger value="templates">Message Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="conversations" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Last Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    customer: "John Doe",
                    phone: "+234 80XXXXX123",
                    message: "What is my account balance?",
                    status: "active",
                    agent: "Auto-Reply",
                    time: "2 mins ago",
                  },
                  {
                    customer: "Jane Smith",
                    phone: "+234 81XXXXX456",
                    message: "I want to block my card",
                    status: "pending",
                    agent: "Unassigned",
                    time: "5 mins ago",
                  },
                  {
                    customer: "Mike Johnson",
                    phone: "+234 70XXXXX789",
                    message: "Thank you for the help",
                    status: "resolved",
                    agent: "Sarah M.",
                    time: "15 mins ago",
                  },
                  {
                    customer: "Alice Brown",
                    phone: "+234 90XXXXX234",
                    message: "How do I transfer money?",
                    status: "active",
                    agent: "Auto-Reply",
                    time: "20 mins ago",
                  },
                  {
                    customer: "Bob Wilson",
                    phone: "+234 81XXXXX567",
                    message: "Loan application status?",
                    status: "pending",
                    agent: "Unassigned",
                    time: "25 mins ago",
                  },
                ].map((convo, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      {convo.customer}
                    </TableCell>
                    <TableCell>{convo.phone}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {convo.message}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          convo.status === "active"
                            ? "default"
                            : convo.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {convo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{convo.agent}</TableCell>
                    <TableCell>{convo.time}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Chat
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="broadcasts" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search broadcasts..." className="pl-10" />
              </div>
              <Input type="date" className="w-48" />
              <Button variant="outline">Export Report</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Delivered</TableHead>
                  <TableHead>Read</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    campaign: "Monthly Statement Alert",
                    recipients: 4523,
                    sent: 4523,
                    delivered: 4421,
                    read: 4102,
                    date: "2024-01-15",
                  },
                  {
                    campaign: "New Product Launch",
                    recipients: 8234,
                    sent: 8234,
                    delivered: 8056,
                    read: 7234,
                    date: "2024-01-10",
                  },
                  {
                    campaign: "Security Alert",
                    recipients: 12450,
                    sent: 12450,
                    delivered: 12189,
                    read: 11876,
                    date: "2024-01-05",
                  },
                ].map((broadcast, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      {broadcast.campaign}
                    </TableCell>
                    <TableCell>
                      {broadcast.recipients.toLocaleString()}
                    </TableCell>
                    <TableCell>{broadcast.sent.toLocaleString()}</TableCell>
                    <TableCell>
                      {broadcast.delivered.toLocaleString()}
                    </TableCell>
                    <TableCell>{broadcast.read.toLocaleString()}</TableCell>
                    <TableCell>{broadcast.date}</TableCell>
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

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "Account Alert",
                  category: "Transactional",
                  status: "approved",
                },
                {
                  name: "Transaction Receipt",
                  category: "Transactional",
                  status: "approved",
                },
                {
                  name: "Loan Reminder",
                  category: "Marketing",
                  status: "approved",
                },
                {
                  name: "Welcome Message",
                  category: "Onboarding",
                  status: "approved",
                },
                {
                  name: "Promotional Offer",
                  category: "Marketing",
                  status: "pending",
                },
                {
                  name: "Security Alert",
                  category: "Security",
                  status: "approved",
                },
              ].map((template, idx) => (
                <Card key={idx} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.category}
                        </p>
                      </div>
                      <Badge
                        variant={
                          template.status === "approved"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {template.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        Preview
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Avg Response Time
                </h3>
                <p className="text-3xl font-bold">2m 15s</p>
                <p className="text-sm text-green-600 mt-1">↓ 45s improvement</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Customer Satisfaction
                </h3>
                <p className="text-3xl font-bold">4.8/5.0</p>
                <p className="text-sm text-green-600 mt-1">↑ 0.3 increase</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Auto-Resolution Rate
                </h3>
                <p className="text-3xl font-bold">68%</p>
                <p className="text-sm text-green-600 mt-1">↑ 12% improvement</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default WhatsAppManagement;
