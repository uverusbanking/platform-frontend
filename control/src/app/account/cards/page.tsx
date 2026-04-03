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
import { Switch } from "@/components/ui/switch";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  DollarSign,
  TrendingUp,
  Ban,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Building,
} from "lucide-react";
import { KPICard } from "@/components/features/dashboard/KPICard";
import { AnalyticsChart } from "@/components/features/dashboard/AnalyticsChart";
import { toast } from "sonner";

const Cards = () => {
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  // Mock data for card requests
  const cardRequests = [
    {
      id: "CR001",
      customer: "John Doe",
      cardType: "Virtual",
      product: "Standard Debit",
      requestDate: "2024-01-15",
      status: "pending",
      phone: "+234 123 456 7890",
      email: "john@example.com",
    },
    {
      id: "CR002",
      customer: "Jane Smith",
      cardType: "Physical",
      product: "Premium Debit",
      requestDate: "2024-01-14",
      status: "approved",
      phone: "+234 123 456 7891",
      email: "jane@example.com",
    },
    {
      id: "CR003",
      customer: "Mike Johnson",
      cardType: "Virtual",
      product: "Business Card",
      requestDate: "2024-01-13",
      status: "rejected",
      phone: "+234 123 456 7892",
      email: "mike@example.com",
    },
  ];

  // Mock data for issued cards
  const issuedCards = [
    {
      id: "CD001",
      cardNumber: "**** **** **** 1234",
      customer: "John Doe",
      cardType: "Virtual",
      product: "Standard Debit",
      status: "active",
      balance: 50000,
      issuedDate: "2024-01-10",
      expiryDate: "2027-01-10",
      lastTransaction: "2024-01-15",
    },
    {
      id: "CD002",
      cardNumber: "**** **** **** 5678",
      customer: "Jane Smith",
      cardType: "Physical",
      product: "Premium Debit",
      status: "active",
      balance: 125000,
      issuedDate: "2024-01-08",
      expiryDate: "2027-01-08",
      lastTransaction: "2024-01-14",
    },
    {
      id: "CD003",
      cardNumber: "**** **** **** 9012",
      customer: "Sarah Wilson",
      cardType: "Virtual",
      product: "Business Card",
      status: "blocked",
      balance: 75000,
      issuedDate: "2023-12-15",
      expiryDate: "2026-12-15",
      lastTransaction: "2024-01-12",
    },
  ];

  // Mock data for card products
  const cardProducts = [
    {
      id: "CP001",
      name: "Standard Debit Card",
      type: "Debit",
      monthlyFee: 500,
      transactionFee: 50,
      withdrawalLimit: 100000,
      purchaseLimit: 500000,
      status: "active",
      totalCards: 245,
      virtualAvailable: true,
      physicalAvailable: true,
    },
    {
      id: "CP002",
      name: "Premium Debit Card",
      type: "Debit",
      monthlyFee: 1000,
      transactionFee: 25,
      withdrawalLimit: 200000,
      purchaseLimit: 1000000,
      status: "active",
      totalCards: 89,
      virtualAvailable: true,
      physicalAvailable: true,
    },
    {
      id: "CP003",
      name: "Business Card",
      type: "Business",
      monthlyFee: 2000,
      transactionFee: 100,
      withdrawalLimit: 500000,
      purchaseLimit: 2000000,
      status: "active",
      totalCards: 34,
      virtualAvailable: true,
      physicalAvailable: true,
    },
  ];

  const handleCardAction = (action: string, cardId: string) => {
    toast(`Card ${action}`, {
      description: `Card ${cardId} has been ${action.toLowerCase()} successfully.`,
    });
  };

  const handleRequestAction = (action: string, requestId: string) => {
    toast(`Request ${action}`, {
      description: `Card request ${requestId} has been ${action.toLowerCase()}.`,
    });
  };

  const handleProductAction = (action: string, productId?: string) => {
    toast(`Product ${action}`, {
      description: `Card product has been ${action.toLowerCase()} successfully.`,
    });
    setIsProductDialogOpen(false);
  };

  // Mock chart data
  const cardUsageData = [
    { name: "Jan", issued: 25, active: 220, transactions: 1500 },
    { name: "Feb", issued: 30, active: 245, transactions: 1800 },
    { name: "Mar", issued: 28, active: 268, transactions: 2100 },
    { name: "Apr", issued: 35, active: 295, transactions: 2400 },
    { name: "May", issued: 32, active: 315, transactions: 2600 },
    { name: "Jun", issued: 40, active: 348, transactions: 2900 },
  ];

  const cardTypeDistribution = [
    { name: "Virtual Cards", value: 65, count: 226 },
    { name: "Physical Cards", value: 35, count: 122 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Card Management</h1>
        <div className="flex gap-2">
          <Dialog
            open={isProductDialogOpen}
            onOpenChange={setIsProductDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Card Product</DialogTitle>
                <DialogDescription>
                  Define a new card product with limits and fees.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input id="product-name" placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-type">Card Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debit">Debit Card</SelectItem>
                      <SelectItem value="prepaid">Prepaid Card</SelectItem>
                      <SelectItem value="business">Business Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly-fee">Monthly Fee (₦)</Label>
                  <Input id="monthly-fee" type="number" placeholder="500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transaction-fee">Transaction Fee (₦)</Label>
                  <Input id="transaction-fee" type="number" placeholder="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="withdrawal-limit">
                    Daily Withdrawal Limit (₦)
                  </Label>
                  <Input
                    id="withdrawal-limit"
                    type="number"
                    placeholder="100000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase-limit">
                    Daily Purchase Limit (₦)
                  </Label>
                  <Input
                    id="purchase-limit"
                    type="number"
                    placeholder="500000"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="virtual-available" />
                  <Label htmlFor="virtual-available">
                    Virtual Cards Available
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="physical-available" />
                  <Label htmlFor="physical-available">
                    Physical Cards Available
                  </Label>
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
          <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Issue Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Issue New Card</DialogTitle>
                <DialogDescription>
                  Issue a new card to a customer.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-select">Customer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-product">Card Product</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard Debit Card
                      </SelectItem>
                      <SelectItem value="premium">
                        Premium Debit Card
                      </SelectItem>
                      <SelectItem value="business">Business Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-type-select">Card Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual Card</SelectItem>
                      <SelectItem value="physical">Physical Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-address">
                    Delivery Address (Physical Cards)
                  </Label>
                  <Textarea
                    id="delivery-address"
                    placeholder="Enter delivery address"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCardDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => handleCardAction("Issued", "new")}>
                  Issue Card
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Cards"
          value="348"
          change="+12%"
          icon={CreditCard}
        />
        <KPICard
          title="Active Cards"
          value="315"
          change="+8%"
          icon={CheckCircle}
        />
        <KPICard
          title="Card Revenue"
          value="₦2.8M"
          change="+15%"
          icon={DollarSign}
        />
        <KPICard
          title="Pending Requests"
          value="23"
          change="+3"
          icon={AlertCircle}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Card Usage Trends</CardTitle>
            <CardDescription>
              Monthly card issuance and transaction trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              title="Card Usage Trends"
              description="Monthly card issuance and transaction trends"
              data={cardUsageData}
              type="line"
              dataKey="issued"
              additionalKeys={["active", "transactions"]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Card Type Distribution</CardTitle>
            <CardDescription>Virtual vs Physical cards</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              title="Card Type Distribution"
              description="Virtual vs Physical cards"
              data={cardTypeDistribution}
              type="pie"
              dataKey="value"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cards" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cards">All Cards</TabsTrigger>
          <TabsTrigger value="requests">Card Requests</TabsTrigger>
          <TabsTrigger value="products">Card Products</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          <Card>
            <CardHeader>
              <CardTitle>Issued Cards</CardTitle>
              <CardDescription>
                Manage all issued virtual and physical cards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Input placeholder="Search cards..." className="flex-1" />
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Card ID</TableHead>
                    <TableHead>Card Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issuedCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell className="font-medium">{card.id}</TableCell>
                      <TableCell>{card.cardNumber}</TableCell>
                      <TableCell>{card.customer}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {card.cardType === "Virtual" ? (
                            <Smartphone className="h-4 w-4" />
                          ) : (
                            <CreditCard className="h-4 w-4" />
                          )}
                          {card.cardType}
                        </div>
                      </TableCell>
                      <TableCell>{card.product}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            card.status === "active"
                              ? "default"
                              : card.status === "blocked"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {card.status}
                        </Badge>
                      </TableCell>
                      <TableCell>₦{card.balance.toLocaleString()}</TableCell>
                      <TableCell>{card.expiryDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCardAction("View", card.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              card.status === "active"
                                ? "destructive"
                                : "default"
                            }
                            onClick={() =>
                              handleCardAction(
                                card.status === "active" ? "Block" : "Unblock",
                                card.id,
                              )
                            }
                          >
                            {card.status === "active" ? (
                              <Ban className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
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

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Card Requests</CardTitle>
              <CardDescription>
                Review and approve card requests from customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Input placeholder="Search requests..." className="flex-1" />
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Card Type</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cardRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.id}
                      </TableCell>
                      <TableCell>{request.customer}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {request.cardType === "Virtual" ? (
                            <Smartphone className="h-4 w-4" />
                          ) : (
                            <CreditCard className="h-4 w-4" />
                          )}
                          {request.cardType}
                        </div>
                      </TableCell>
                      <TableCell>{request.product}</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "approved"
                              ? "default"
                              : request.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{request.phone}</div>
                          <div className="text-muted-foreground">
                            {request.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleRequestAction("Approved", request.id)
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleRequestAction("Rejected", request.id)
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {request.status !== "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleRequestAction("View", request.id)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
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
              <CardTitle>Card Products</CardTitle>
              <CardDescription>
                Manage card product configurations and limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Monthly Fee</TableHead>
                    <TableHead>Transaction Fee</TableHead>
                    <TableHead>Withdrawal Limit</TableHead>
                    <TableHead>Purchase Limit</TableHead>
                    <TableHead>Total Cards</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cardProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.id}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.type}</TableCell>
                      <TableCell>₦{product.monthlyFee}</TableCell>
                      <TableCell>₦{product.transactionFee}</TableCell>
                      <TableCell>
                        ₦{product.withdrawalLimit.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ₦{product.purchaseLimit.toLocaleString()}
                      </TableCell>
                      <TableCell>{product.totalCards}</TableCell>
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

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Card Transactions</CardTitle>
              <CardDescription>
                Monitor all card-based transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Card transaction monitoring interface will be implemented here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cards;
