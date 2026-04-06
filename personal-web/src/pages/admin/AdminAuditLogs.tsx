import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { formatDateTime } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Search, Eye, ChevronLeft, ChevronRight, Download } from "lucide-react";

interface AuditLog {
  id: string;
  admin_user_id: string | null;
  admin_email: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: unknown;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

const ACTION_COLORS: Record<string, string> = {
  view: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  create:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  update:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  delete: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  approve:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  reject: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  suspend: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  unsuspend:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function AdminAuditLogs() {
  const { logAction } = useAdmin();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [resourceFilter, setResourceFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 50;

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      // Mock Data
      setLogs([]);
      setTotalCount(0);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, actionFilter, resourceFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    logAction("view", "audit_logs");
  }, []);

  const getActionBadge = (action: string) => {
    const baseAction = action.split("_")[0];
    const colorClass =
      ACTION_COLORS[baseAction] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {action.replace(/_/g, " ")}
      </span>
    );
  };

  const handleExport = () => {
    const csv = [
      [
        "Timestamp",
        "Admin",
        "Action",
        "Resource Type",
        "Resource ID",
        "Details",
      ].join(","),
      ...logs.map((log) =>
        [
          log.created_at,
          log.admin_email,
          log.action,
          log.resource_type,
          log.resource_id || "",
          JSON.stringify(log.details).replace(/,/g, ";"),
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">
            View all admin actions and system events
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by admin email or resource ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
                <SelectItem value="suspend">Suspend</SelectItem>
                <SelectItem value="change">Change</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Resources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="kyc_document">KYC Document</SelectItem>
                <SelectItem value="tier_request">Tier Request</SelectItem>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="users_list">Users List</SelectItem>
                <SelectItem value="tiers">Tiers</SelectItem>
                <SelectItem value="audit_logs">Audit Logs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
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
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateTime(log.created_at)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {log.admin_email}
                        </TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">
                              {log.resource_type.replace(/_/g, " ")}
                            </p>
                            {log.resource_id && (
                              <p className="text-xs text-muted-foreground font-mono">
                                {log.resource_id.slice(0, 8)}...
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedLog(log);
                              setDetailDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
                    {Math.min(page * pageSize, totalCount)} of {totalCount} logs
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

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Timestamp</Label>
                  <p className="font-medium">
                    {formatDateTime(selectedLog.created_at)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Admin</Label>
                  <p className="font-medium">{selectedLog.admin_email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Action</Label>
                  <div className="mt-1">
                    {getActionBadge(selectedLog.action)}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Resource Type</Label>
                  <p className="font-medium">
                    {selectedLog.resource_type.replace(/_/g, " ")}
                  </p>
                </div>
                {selectedLog.resource_id && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Resource ID</Label>
                    <p className="font-mono text-sm">
                      {selectedLog.resource_id}
                    </p>
                  </div>
                )}
              </div>

              {Object.keys(selectedLog.details || {}).length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Details</Label>
                  <pre className="mt-2 p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}

              {(selectedLog.ip_address || selectedLog.user_agent) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedLog.ip_address && (
                    <div>
                      <Label className="text-muted-foreground">
                        IP Address
                      </Label>
                      <p className="font-mono text-sm">
                        {selectedLog.ip_address}
                      </p>
                    </div>
                  )}
                  {selectedLog.user_agent && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">
                        User Agent
                      </Label>
                      <p className="text-sm text-muted-foreground truncate">
                        {selectedLog.user_agent}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDetailDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
