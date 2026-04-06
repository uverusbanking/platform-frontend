import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { formatCurrency, formatDateTime } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  UserX,
  UserCheck,
  Eye,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  verification_status: "pending" | "verified";
  is_suspended: boolean;
  created_at: string;
}

interface UserWithDetails extends UserProfile {
  tier?: string;
  balance?: number;
}

export default function AdminUsers() {
  const { hasPermission, logAction } = useAdmin();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  // Action dialogs
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(
    null,
  );
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [unsuspendDialogOpen, setUnsuspendDialogOpen] = useState(false);
  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [newTier, setNewTier] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);

  const canManageUsers = hasPermission("manage_users");
  const canManageTiers = hasPermission("manage_tiers");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Mock Data
      setUsers([]);
      setTotalCount(0);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, tierFilter, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    logAction("view", "users_list");
  }, []);

  const handleSuspendUser = async () => {
    if (!selectedUser || !suspendReason.trim()) return;
    setActionLoading(true);

    try {
      // Mock suspension
      await logAction("suspend_user", "user", selectedUser.user_id, {
        reason: suspendReason,
      });

      toast({
        title: "User Suspended",
        description: `${selectedUser.email} has been suspended.`,
      });

      setSuspendDialogOpen(false);
      setSuspendReason("");
      fetchUsers();
    } catch (err) {
      console.error("Error suspending user:", err);
      toast({
        title: "Error",
        description: "Failed to suspend user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsuspendUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);

    try {
      // Mock unsuspension
      await logAction("unsuspend_user", "user", selectedUser.user_id);

      toast({
        title: "User Activated",
        description: `${selectedUser.email} has been reactivated.`,
      });

      setUnsuspendDialogOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Error unsuspending user:", err);
      toast({
        title: "Error",
        description: "Failed to reactivate user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeTier = async () => {
    if (!selectedUser || !newTier) return;
    setActionLoading(true);

    try {
      // Mock tier change
      await logAction("change_tier", "user", selectedUser.user_id, {
        old_tier: selectedUser.tier,
        new_tier: newTier,
      });

      toast({
        title: "Tier Updated",
        description: `${selectedUser.email} has been updated to ${newTier.replace("_", " ").toUpperCase()}.`,
      });

      setTierDialogOpen(false);
      setNewTier("");
      fetchUsers();
    } catch (err) {
      console.error("Error changing tier:", err);
      toast({
        title: "Error",
        description: "Failed to update tier",
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

  const getStatusBadge = (user: UserWithDetails) => {
    if (user.is_suspended) {
      return <Badge variant="destructive">Suspended</Badge>;
    }
    if (user.verification_status === "verified") {
      return (
        <Badge variant="default" className="bg-emerald-500">
          Verified
        </Badge>
      );
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          View and manage all platform users
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="tier_1">Tier 1</SelectItem>
                <SelectItem value="tier_2">Tier 2</SelectItem>
                <SelectItem value="tier_3">Tier 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {user.full_name || "No name"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(user)}</TableCell>
                        <TableCell>
                          {getTierBadge(user.tier || "tier_1")}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(user.balance || 0)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateTime(user.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedUser(user);
                                setUserDetailOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canManageTiers && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setNewTier(user.tier || "tier_1");
                                  setTierDialogOpen(true);
                                }}
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                            )}
                            {canManageUsers &&
                              (user.is_suspended ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-emerald-500"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setUnsuspendDialogOpen(true);
                                  }}
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setSuspendDialogOpen(true);
                                  }}
                                >
                                  <UserX className="h-4 w-4" />
                                </Button>
                              ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1} to{" "}
                    {Math.min(page * pageSize, totalCount)} of {totalCount}{" "}
                    users
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend {selectedUser?.email}? They will
              not be able to access their account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reason for suspension *</Label>
              <Textarea
                placeholder="Enter the reason for suspension..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSuspendDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSuspendUser}
              disabled={actionLoading || !suspendReason.trim()}
            >
              {actionLoading ? "Suspending..." : "Suspend User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsuspend Dialog */}
      <Dialog open={unsuspendDialogOpen} onOpenChange={setUnsuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reactivate User</DialogTitle>
            <DialogDescription>
              Are you sure you want to reactivate {selectedUser?.email}? They
              will regain access to their account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUnsuspendDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnsuspendUser}
              disabled={actionLoading}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {actionLoading ? "Reactivating..." : "Reactivate User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Tier Dialog */}
      <Dialog open={tierDialogOpen} onOpenChange={setTierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Tier</DialogTitle>
            <DialogDescription>
              Update the tier level for {selectedUser?.email}. This action will
              be logged.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Tier</Label>
              <p className="text-sm">
                {selectedUser?.tier?.replace("_", " ").toUpperCase()}
              </p>
            </div>
            <div className="space-y-2">
              <Label>New Tier</Label>
              <Select value={newTier} onValueChange={setNewTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tier_1">Tier 1 - Basic</SelectItem>
                  <SelectItem value="tier_2">Tier 2 - Standard</SelectItem>
                  <SelectItem value="tier_3">Tier 3 - Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTierDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleChangeTier}
              disabled={actionLoading || newTier === selectedUser?.tier}
            >
              {actionLoading ? "Updating..." : "Update Tier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Detail Dialog */}
      <Dialog open={userDetailOpen} onOpenChange={setUserDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium">
                    {selectedUser.full_name || "Not set"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">
                    {selectedUser.phone || "Not set"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedUser)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tier</Label>
                  <div className="mt-1">
                    {getTierBadge(selectedUser.tier || "tier_1")}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Balance</Label>
                  <p className="font-medium">
                    {formatCurrency(selectedUser.balance || 0)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">User ID</Label>
                  <p className="font-mono text-sm">{selectedUser.user_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Joined</Label>
                  <p className="font-medium">
                    {formatDateTime(selectedUser.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
