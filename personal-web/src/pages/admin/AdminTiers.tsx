import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { formatCurrency, formatDateTime } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Shield, ArrowUp, Clock } from "lucide-react";

interface TierLimit {
  id: string;
  tier: string;
  tier_name: string;
  tier_description: string | null;
  max_send_per_tx: number;
  max_receive_per_tx: number;
  daily_send_limit: number;
  daily_receive_limit: number;
  monthly_limit: number;
  features: string[];
  required_documents: string[];
}

interface TierRequest {
  id: string;
  user_id: string;
  current_tier: string;
  requested_tier: string;
  status: string;
  reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  user_email?: string;
  user_name?: string;
}

export default function AdminTiers() {
  const { hasPermission, logAction } = useAdmin();
  const { toast } = useToast();

  const [tiers, setTiers] = useState<TierLimit[]>([]);
  const [requests, setRequests] = useState<TierRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<TierRequest | null>(
    null,
  );
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const canManageTiers = hasPermission("manage_tiers");

  useEffect(() => {
    fetchData();
    logAction("view", "tiers");
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock Data
      const mockTiers: TierLimit[] = [
        {
          id: "1",
          tier: "tier_1",
          tier_name: "Tier 1 - Basic",
          tier_description: "Entry level tier",
          max_send_per_tx: 50000,
          max_receive_per_tx: 50000,
          daily_send_limit: 100000,
          daily_receive_limit: 100000,
          monthly_limit: 500000,
          features: ["Basic access", "Standard support"],
          required_documents: [],
        },
        {
          id: "2",
          tier: "tier_2",
          tier_name: "Tier 2 - Standard",
          tier_description: "Verified users",
          max_send_per_tx: 200000,
          max_receive_per_tx: 200000,
          daily_send_limit: 500000,
          daily_receive_limit: 500000,
          monthly_limit: 2000000,
          features: ["Higher limits", "Priority support"],
          required_documents: ["BVN", "NIN"],
        },
        {
          id: "3",
          tier: "tier_3",
          tier_name: "Tier 3 - Premium",
          tier_description: "Fully verified users",
          max_send_per_tx: 1000000,
          max_receive_per_tx: 1000000,
          daily_send_limit: 5000000,
          daily_receive_limit: 5000000,
          monthly_limit: 20000000,
          features: ["Highest limits", "Dedicated support", "Access to loans"],
          required_documents: ["Passport/ID", "Proof of Address"],
        },
      ];
      setTiers(mockTiers);
      setRequests([]);
    } catch (err) {
      console.error("Error fetching tier data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);

    try {
      await logAction(
        "approve_tier_request",
        "tier_request",
        selectedRequest.id,
        {
          user_id: selectedRequest.user_id,
          from_tier: selectedRequest.current_tier,
          to_tier: selectedRequest.requested_tier,
        },
      );

      toast({
        title: "Request Approved",
        description: `Tier upgrade to ${selectedRequest.requested_tier.replace("_", " ")} has been approved.`,
      });

      setReviewDialogOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error approving request:", err);
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest || !rejectionReason.trim()) return;
    setActionLoading(true);

    try {
      await logAction(
        "reject_tier_request",
        "tier_request",
        selectedRequest.id,
        {
          user_id: selectedRequest.user_id,
          reason: rejectionReason,
        },
      );

      toast({
        title: "Request Rejected",
        description: "Tier upgrade request has been rejected.",
      });

      setReviewDialogOpen(false);
      setRejectionReason("");
      fetchData();
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getTierBadge = (tier: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      tier_1: "outline",
      tier_2: "secondary",
      tier_3: "default",
    };
    const labels: Record<string, string> = {
      tier_1: "Tier 1",
      tier_2: "Tier 2",
      tier_3: "Tier 3",
    };
    return (
      <Badge variant={variants[tier] || "outline"}>
        {labels[tier] || tier}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tiers & Limits</h1>
          <p className="text-muted-foreground">
            Manage user tiers and transaction limits
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tiers & Limits</h1>
        <p className="text-muted-foreground">
          Manage user tiers and transaction limits
        </p>
      </div>

      <Tabs defaultValue="tiers">
        <TabsList>
          <TabsTrigger value="tiers">
            <Shield className="h-4 w-4 mr-2" />
            Tier Limits
          </TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            <ArrowUp className="h-4 w-4 mr-2" />
            Upgrade Requests
            {pendingRequests.length > 0 && (
              <Badge
                variant="destructive"
                className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tier Limits Tab */}
        <TabsContent value="tiers" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <Card
                key={tier.id}
                className={tier.tier === "tier_3" ? "border-primary" : ""}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{tier.tier_name}</CardTitle>
                    {getTierBadge(tier.tier)}
                  </div>
                  <CardDescription>{tier.tier_description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Send/TX</span>
                      <span className="font-medium">
                        {formatCurrency(tier.max_send_per_tx)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Max Receive/TX
                      </span>
                      <span className="font-medium">
                        {formatCurrency(tier.max_receive_per_tx)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Daily Send</span>
                      <span className="font-medium">
                        {formatCurrency(tier.daily_send_limit)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Daily Receive
                      </span>
                      <span className="font-medium">
                        {formatCurrency(tier.daily_receive_limit)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly</span>
                      <span className="font-medium">
                        {formatCurrency(tier.monthly_limit)}
                      </span>
                    </div>
                  </div>

                  {tier.required_documents &&
                    tier.required_documents.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Required Documents
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {tier.required_documents.map((doc, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Upgrade Requests Tab */}
        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Current Tier</TableHead>
                    <TableHead>Requested Tier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No upgrade requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {request.user_name || "No name"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.user_email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getTierBadge(request.current_tier)}
                        </TableCell>
                        <TableCell>
                          {getTierBadge(request.requested_tier)}
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateTime(request.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          {request.status === "pending" && canManageTiers ? (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setReviewDialogOpen(true);
                                setRejectionReason("");
                              }}
                            >
                              Review
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedRequest(request);
                                setReviewDialogOpen(true);
                              }}
                            >
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Upgrade Request</DialogTitle>
            <DialogDescription>
              {selectedRequest &&
                `${selectedRequest.user_email} requested an upgrade from ${selectedRequest.current_tier.replace("_", " ")} to ${selectedRequest.requested_tier.replace("_", " ")}`}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Current Tier</Label>
                  <div className="mt-1">
                    {getTierBadge(selectedRequest.current_tier)}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Requested Tier
                  </Label>
                  <div className="mt-1">
                    {getTierBadge(selectedRequest.requested_tier)}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Requested</Label>
                  <p>{formatDateTime(selectedRequest.created_at)}</p>
                </div>
              </div>

              {selectedRequest.reason && (
                <div>
                  <Label className="text-muted-foreground">
                    Rejection Reason
                  </Label>
                  <p className="text-destructive">{selectedRequest.reason}</p>
                </div>
              )}

              {selectedRequest.status === "pending" && canManageTiers && (
                <div className="space-y-2">
                  <Label>Rejection Reason (if rejecting)</Label>
                  <Textarea
                    placeholder="Enter reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Close
            </Button>
            {selectedRequest?.status === "pending" && canManageTiers && (
              <>
                <Button
                  variant="destructive"
                  onClick={handleRejectRequest}
                  disabled={actionLoading || !rejectionReason.trim()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={handleApproveRequest}
                  disabled={actionLoading}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
