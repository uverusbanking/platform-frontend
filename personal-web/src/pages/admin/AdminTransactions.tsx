import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { formatCurrency, formatDateTime } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
} from "lucide-react";

interface TransactionWithUser {
  id: string;
  wallet_id: string;
  reference: string;
  type: string;
  status: string;
  channel: string;
  amount: number;
  fee: number;
  balance_before: number;
  balance_after: number;
  counterparty_name: string | null;
  counterparty_account: string | null;
  counterparty_bank: string | null;
  narration: string | null;
  metadata: unknown;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

export default function AdminTransactions() {
  const { logAction } = useAdmin();

  const [transactions, setTransactions] = useState<TransactionWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  const [selectedTx, setSelectedTx] = useState<TransactionWithUser | null>(
    null,
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const [stats, setStats] = useState({
    totalVolume: 0,
    totalCredits: 0,
    totalDebits: 0,
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // Mock Data
      setTransactions([]);
      setTotalCount(0);
      setStats({
        totalVolume: 0,
        totalCredits: 0,
        totalDebits: 0,
      });
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter, statusFilter, channelFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    logAction("view", "transactions");
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "successful":
        return <Badge className="bg-emerald-500">Successful</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "reversed":
        return <Badge variant="secondary">Reversed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    if (type === "credit") {
      return (
        <span className="flex items-center gap-1 text-emerald-600">
          <ArrowDownLeft className="h-4 w-4" />
          Credit
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-red-600">
        <ArrowUpRight className="h-4 w-4" />
        Debit
      </span>
    );
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            View all platform transactions
          </p>
        </div>
        <Button variant="outline" onClick={fetchTransactions}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalVolume)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(stats.totalCredits)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4 text-red-500" />
              Total Debits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalDebits)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by reference, counterparty, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="successful">Successful</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="reversed">Reversed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="internal_transfer">
                  Internal Transfer
                </SelectItem>
                <SelectItem value="wallet_funding">Wallet Funding</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
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
                    <TableHead>Reference</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-sm">
                          {tx.reference.slice(0, 12)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">
                              {tx.user_name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {tx.user_email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(tx.type)}</TableCell>
                        <TableCell className="text-sm capitalize">
                          {tx.channel.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold ${tx.type === "credit" ? "text-emerald-600" : ""}`}
                        >
                          {tx.type === "credit" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(tx.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateTime(tx.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedTx(tx);
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
                    {Math.min(page * pageSize, totalCount)} of {totalCount}{" "}
                    transactions
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
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTx && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Reference</Label>
                  <p className="font-mono text-sm">{selectedTx.reference}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedTx.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <div className="mt-1">{getTypeBadge(selectedTx.type)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Channel</Label>
                  <p className="capitalize">
                    {selectedTx.channel.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p
                    className={`text-lg font-semibold ${selectedTx.type === "credit" ? "text-emerald-600" : ""}`}
                  >
                    {selectedTx.type === "credit" ? "+" : "-"}
                    {formatCurrency(selectedTx.amount)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Fee</Label>
                  <p>{formatCurrency(selectedTx.fee)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Balance Before
                  </Label>
                  <p>{formatCurrency(selectedTx.balance_before)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Balance After</Label>
                  <p>{formatCurrency(selectedTx.balance_after)}</p>
                </div>
              </div>

              {(selectedTx.counterparty_name ||
                selectedTx.counterparty_account) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">
                      Counterparty
                    </Label>
                    <p>{selectedTx.counterparty_name || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Account</Label>
                    <p className="font-mono">
                      {selectedTx.counterparty_account || "-"}
                    </p>
                  </div>
                  {selectedTx.counterparty_bank && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Bank</Label>
                      <p>{selectedTx.counterparty_bank}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedTx.narration && (
                <div>
                  <Label className="text-muted-foreground">Narration</Label>
                  <p>{selectedTx.narration}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">User</Label>
                  <p>{selectedTx.user_name || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTx.user_email}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p>{formatDateTime(selectedTx.created_at)}</p>
                </div>
              </div>
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
