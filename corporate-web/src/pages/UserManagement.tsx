import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Plus,
  MoreVertical,
  Mail,
  Pencil,
  Trash2,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_DEFINITIONS, type CorporateRole } from "@/types/roles";
import { toast } from "sonner";

interface CorporateUser {
  id: string;
  name: string;
  email: string;
  role: CorporateRole;
  status: "active" | "invited" | "suspended";
  dailyLimit: number;
  perTxLimit: number;
  lastLogin: string | null;
  createdAt: string;
}

const mockUsers: CorporateUser[] = [
  {
    id: "u1",
    name: "Adewale Johnson",
    email: "adewale@company.com",
    role: "owner",
    status: "active",
    dailyLimit: 50_000_000,
    perTxLimit: 10_000_000,
    lastLogin: "Apr 02, 2026 09:15",
    createdAt: "Jan 10, 2026",
  },
  {
    id: "u2",
    name: "Ngozi Okafor",
    email: "ngozi@company.com",
    role: "initiator",
    status: "active",
    dailyLimit: 20_000_000,
    perTxLimit: 5_000_000,
    lastLogin: "Apr 01, 2026 14:30",
    createdAt: "Jan 15, 2026",
  },
  {
    id: "u3",
    name: "Emeka Nwosu",
    email: "emeka@company.com",
    role: "authorizer",
    status: "active",
    dailyLimit: 100_000_000,
    perTxLimit: 50_000_000,
    lastLogin: "Mar 31, 2026 11:00",
    createdAt: "Feb 01, 2026",
  },
  {
    id: "u4",
    name: "Fatima Bello",
    email: "fatima@company.com",
    role: "authorizer",
    status: "active",
    dailyLimit: 100_000_000,
    perTxLimit: 50_000_000,
    lastLogin: "Apr 02, 2026 08:45",
    createdAt: "Feb 01, 2026",
  },
  {
    id: "u5",
    name: "Chidi Eze",
    email: "chidi@company.com",
    role: "viewer",
    status: "invited",
    dailyLimit: 0,
    perTxLimit: 0,
    lastLogin: null,
    createdAt: "Mar 20, 2026",
  },
  {
    id: "u6",
    name: "Kemi Adeyemi",
    email: "kemi@company.com",
    role: "initiator",
    status: "suspended",
    dailyLimit: 10_000_000,
    perTxLimit: 2_000_000,
    lastLogin: "Feb 15, 2026 16:20",
    createdAt: "Jan 20, 2026",
  },
];

const fmt = (n: number) =>
  "₦ " +
  n.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  invited: "bg-warning/10 text-warning border-warning/20",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<CorporateUser | null>(null);
  const [limitsUser, setLimitsUser] = useState<CorporateUser | null>(null);

  // Invite form state
  const [invName, setInvName] = useState("");
  const [invEmail, setInvEmail] = useState("");
  const [invRole, setInvRole] = useState<CorporateRole>("initiator");

  // Limits form state
  const [editDailyLimit, setEditDailyLimit] = useState("");
  const [editPerTxLimit, setEditPerTxLimit] = useState("");

  // Edit form state
  const [editRole, setEditRole] = useState<CorporateRole>("initiator");
  const [editStatus, setEditStatus] = useState(true);

  const filtered = users.filter((u) => {
    if (
      search &&
      !u.name.toLowerCase().includes(search.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    return true;
  });

  const handleInvite = () => {
    if (!invEmail || !invName) return;
    const newUser: CorporateUser = {
      id: `u${Date.now()}`,
      name: invName,
      email: invEmail,
      role: invRole,
      status: "invited",
      dailyLimit: 10_000_000,
      perTxLimit: 2_000_000,
      lastLogin: null,
      createdAt: "Apr 02, 2026",
    };
    setUsers([...users, newUser]);
    setInviteOpen(false);
    setInvName("");
    setInvEmail("");
    setInvRole("initiator");
    toast.success(`Invitation sent to ${invEmail}`);
  };

  const handleEditOpen = (user: CorporateUser) => {
    setEditUser(user);
    setEditRole(user.role);
    setEditStatus(user.status === "active");
  };

  const handleEditSave = () => {
    if (!editUser) return;
    setUsers(
      users.map((u) =>
        u.id === editUser.id
          ? {
              ...u,
              role: editRole,
              status: editStatus ? "active" : "suspended",
            }
          : u,
      ),
    );
    setEditUser(null);
    toast.success("User updated successfully");
  };

  const handleLimitsOpen = (user: CorporateUser) => {
    setLimitsUser(user);
    setEditDailyLimit(user.dailyLimit.toString());
    setEditPerTxLimit(user.perTxLimit.toString());
  };

  const handleLimitsSave = () => {
    if (!limitsUser) return;
    setUsers(
      users.map((u) =>
        u.id === limitsUser.id
          ? {
              ...u,
              dailyLimit: Number(editDailyLimit) || 0,
              perTxLimit: Number(editPerTxLimit) || 0,
            }
          : u,
      ),
    );
    setLimitsUser(null);
    toast.success("Transaction limits updated");
  };

  const handleRemove = (user: CorporateUser) => {
    setUsers(users.filter((u) => u.id !== user.id));
    toast.success(`${user.name} removed`);
  };

  const handleResendInvite = (user: CorporateUser) => {
    toast.success(`Invitation re-sent to ${user.email}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Administration</p>
          <h1 className="display">User Management</h1>
          <p
            className="text-sm mt-1"
            style={{ color: "rgb(var(--foreground-subtle))" }}
          >
            {users.length} corporate users
          </p>
        </div>
        <button
          className="btn-pill btn-primary gap-1.5 text-sm w-full sm:w-auto justify-center"
          onClick={() => setInviteOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Invite User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
        <div className="relative w-full sm:w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {ROLE_DEFINITIONS.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <button
          className="btn-pill text-xs sm:ml-auto"
          style={{ color: "rgb(var(--foreground-subtle))" }}
          onClick={() => {
            setSearch("");
            setRoleFilter("all");
            setStatusFilter("all");
          }}
        >
          Clear
        </button>
      </div>

      {/* Mobile cards */}
      <div className="block sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No users found
          </p>
        ) : (
          filtered.map((user) => {
            const roleDef = ROLE_DEFINITIONS.find((r) => r.id === user.role)!;
            return (
              <div
                key={user.id}
                className="rounded-2xl p-4 space-y-3 shadow-card"
                style={{ background: "rgb(var(--surface-highest))" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-9 w-9 rounded-pill flex items-center justify-center shrink-0"
                      style={{ background: "rgb(var(--soft))" }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{ color: "rgb(var(--brand-primary))" }}
                      >
                        {user.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditOpen(user)}>
                        <Pencil className="h-3.5 w-3.5 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLimitsOpen(user)}>
                        <Shield className="h-3.5 w-3.5 mr-2" />
                        Limits
                      </DropdownMenuItem>
                      {user.status === "invited" && (
                        <DropdownMenuItem
                          onClick={() => handleResendInvite(user)}
                        >
                          <Mail className="h-3.5 w-3.5 mr-2" />
                          Resend invite
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleRemove(user)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    className={`${roleDef.color} border-0 text-[10px] font-semibold uppercase`}
                  >
                    {roleDef.label}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase ${statusStyles[user.status]}`}
                  >
                    {user.status}
                  </Badge>
                </div>
                <div
                  className="grid grid-cols-2 gap-2 text-xs"
                  style={{ color: "rgb(var(--foreground-subtle))" }}
                >
                  <div>
                    Daily:{" "}
                    <span
                      className="font-medium"
                      style={{ color: "rgb(var(--foreground))" }}
                    >
                      {fmt(user.dailyLimit)}
                    </span>
                  </div>
                  <div>
                    Per tx:{" "}
                    <span
                      className="font-medium"
                      style={{ color: "rgb(var(--foreground))" }}
                    >
                      {fmt(user.perTxLimit)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop table */}
      <div
        className="hidden sm:block rounded-2xl overflow-hidden shadow-card"
        style={{ background: "rgb(var(--surface-highest))" }}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ background: "rgb(var(--surface))" }}>
                <TableHead className="eyebrow py-3">User</TableHead>
                <TableHead className="eyebrow py-3">Role</TableHead>
                <TableHead className="eyebrow py-3">Status</TableHead>
                <TableHead className="eyebrow py-3 text-right">
                  Daily Limit
                </TableHead>
                <TableHead className="eyebrow py-3 text-right">
                  Per Tx Limit
                </TableHead>
                <TableHead className="eyebrow py-3">Last Login</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => {
                  const roleDef = ROLE_DEFINITIONS.find(
                    (r) => r.id === user.role,
                  )!;
                  return (
                    <TableRow
                      key={user.id}
                      className="hover:bg-surface transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded-pill flex items-center justify-center shrink-0"
                            style={{ background: "rgb(var(--soft))" }}
                          >
                            <span
                              className="text-[10px] font-bold"
                              style={{ color: "rgb(var(--brand-primary))" }}
                            >
                              {user.name
                                .split(" ")
                                .map((w) => w[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${roleDef.color} border-0 text-[10px] font-semibold uppercase`}
                        >
                          {roleDef.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase ${statusStyles[user.status]}`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-right font-medium">
                        {fmt(user.dailyLimit)}
                      </TableCell>
                      <TableCell className="text-sm text-right font-medium">
                        {fmt(user.perTxLimit)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {user.lastLogin ?? "—"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditOpen(user)}
                            >
                              <Pencil className="h-3.5 w-3.5 mr-2" />
                              Edit user
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleLimitsOpen(user)}
                            >
                              <Shield className="h-3.5 w-3.5 mr-2" />
                              Set limits
                            </DropdownMenuItem>
                            {user.status === "invited" && (
                              <DropdownMenuItem
                                onClick={() => handleResendInvite(user)}
                              >
                                <Mail className="h-3.5 w-3.5 mr-2" />
                                Resend invite
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleRemove(user)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Remove user
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation to join your corporate account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Full name
              </Label>
              <Input
                placeholder="Enter full name"
                value={invName}
                onChange={(e) => setInvName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Email address
              </Label>
              <Input
                type="email"
                placeholder="user@company.com"
                value={invEmail}
                onChange={(e) => setInvEmail(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Role</Label>
              <Select
                value={invRole}
                onValueChange={(v) => setInvRole(v as CorporateRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_DEFINITIONS.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={!invName || !invEmail}>
              <Mail className="h-4 w-4 mr-1.5" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update role and status for {editUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Role</Label>
              <Select
                value={editRole}
                onValueChange={(v) => setEditRole(v as CorporateRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_DEFINITIONS.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Active</Label>
              <Switch checked={editStatus} onCheckedChange={setEditStatus} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Limits Dialog */}
      <Dialog open={!!limitsUser} onOpenChange={() => setLimitsUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Limits</DialogTitle>
            <DialogDescription>
              Set individual limits for {limitsUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Daily transaction limit
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  ₦
                </span>
                <Input
                  className="pl-7"
                  placeholder="0"
                  value={editDailyLimit}
                  onChange={(e) =>
                    setEditDailyLimit(e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Per-transaction limit
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  ₦
                </span>
                <Input
                  className="pl-7"
                  placeholder="0"
                  value={editPerTxLimit}
                  onChange={(e) =>
                    setEditPerTxLimit(e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLimitsUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleLimitsSave}>Save Limits</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
