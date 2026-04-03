"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  Clock,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SendNotificationDialog from "@/components/notifications/SendNotificationDialog";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
  category: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Customer Registration",
    message: "John Doe has completed registration and KYC verification",
    type: "success",
    timestamp: "2024-01-20 10:30 AM",
    read: false,
    category: "customers",
  },
  {
    id: "2",
    title: "Loan Application Pending",
    message: "Loan application #LA-1234 requires your approval",
    type: "warning",
    timestamp: "2024-01-20 09:15 AM",
    read: false,
    category: "loans",
  },
  {
    id: "3",
    title: "System Update",
    message: "System maintenance scheduled for tonight at 11 PM",
    type: "info",
    timestamp: "2024-01-19 04:00 PM",
    read: true,
    category: "system",
  },
  {
    id: "4",
    title: "Transaction Alert",
    message: "Large transaction detected - Amount: $50,000",
    type: "warning",
    timestamp: "2024-01-19 02:30 PM",
    read: false,
    category: "transactions",
  },
  {
    id: "5",
    title: "Failed Login Attempt",
    message: "Multiple failed login attempts detected for admin account",
    type: "error",
    timestamp: "2024-01-19 01:15 PM",
    read: true,
    category: "security",
  },
  {
    id: "6",
    title: "New Branch Created",
    message: "Downtown Branch has been successfully created",
    type: "success",
    timestamp: "2024-01-18 11:00 AM",
    read: true,
    category: "branches",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [sentNotifications, setSentNotifications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationSent = (notification: any) => {
    setSentNotifications([notification, ...sentNotifications]);
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-destructive";
      default:
        return "text-primary";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "success":
        return "default";
      case "warning":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "unread" && !n.read) ||
      (filterType === "read" && n.read);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Notification Management
          </h1>
          <p className="text-muted-foreground">
            Send, receive, and manage all notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {unreadCount} Unread
          </Badge>
          <SendNotificationDialog onNotificationSent={handleNotificationSent} />
        </div>
      </div>

      <Tabs defaultValue="received" className="space-y-6">
        <TabsList>
          <TabsTrigger value="received">
            <Bell className="mr-2 h-4 w-4" />
            Received
          </TabsTrigger>
          <TabsTrigger value="sent">
            <Clock className="mr-2 h-4 w-4" />
            Sent History
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="unread">Unread Only</SelectItem>
                      <SelectItem value="read">Read Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  variant="outline"
                >
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Mark All as Read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="customers">Customers</TabsTrigger>
                  <TabsTrigger value="loans">Loans</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                {[
                  "all",
                  "customers",
                  "loans",
                  "transactions",
                  "security",
                  "system",
                ].map((tab) => (
                  <TabsContent key={tab} value={tab} className="space-y-3">
                    {filteredNotifications
                      .filter((n) => tab === "all" || n.category === tab)
                      .map((notification) => (
                        <Card
                          key={notification.id}
                          className={`transition-all hover:shadow-md ${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div
                                className={`mt-1 ${getTypeColor(notification.type)}`}
                              >
                                <Bell className="h-5 w-5" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-semibold">
                                      {notification.title}
                                    </h4>
                                    {!notification.read && (
                                      <Badge
                                        variant="default"
                                        className="h-5 px-2 text-xs"
                                      >
                                        New
                                      </Badge>
                                    )}
                                    <Badge
                                      variant={getTypeBadge(notification.type)}
                                      className="h-5 px-2 text-xs capitalize"
                                    >
                                      {notification.type}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {!notification.read && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          markAsRead(notification.id)
                                        }
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        deleteNotification(notification.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {notification.timestamp}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    {filteredNotifications.filter(
                      (n) => tab === "all" || n.category === tab,
                    ).length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        No notifications found
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent">
          <Card>
            <CardHeader>
              <CardTitle>Sent Notifications History</CardTitle>
              <CardDescription>
                View all notifications you've sent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sentNotifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No notifications sent yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Sent At</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sentNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium">
                          {notification.title}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {notification.message}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getTypeBadge(notification.type)}
                            className="capitalize"
                          >
                            {notification.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {notification.category}
                        </TableCell>
                        <TableCell className="capitalize">
                          {notification.recipients}
                        </TableCell>
                        <TableCell>{notification.timestamp}</TableCell>
                        <TableCell>
                          <Badge variant="default">Sent</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notification Templates</CardTitle>
                  <CardDescription>
                    Manage reusable notification templates
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                No templates created yet. Create your first template to speed up
                notification sending.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
