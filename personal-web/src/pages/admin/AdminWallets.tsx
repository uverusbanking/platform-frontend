import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

interface WalletWithUser {
  id: string;
  user_id: string;
  currency: string;
  available_balance: number;
  ledger_balance: number;
  created_at: string;
  user_email?: string;
  user_name?: string;
  virtual_account?: string;
}

export default function AdminWallets() {
  const { logAction } = useAdmin();

  const [wallets, setWallets] = useState<WalletWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalLedger, setTotalLedger] = useState(0);

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    try {
      // Mock data
      setWallets([]);
      setTotalCount(0);
      setTotalBalance(0);
      setTotalLedger(0);
    } catch (err) {
      console.error("Error fetching wallets:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  useEffect(() => {
    logAction("view", "wallets");
  }, []);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Wallets</h1>
          <p className="text-muted-foreground">
            View all user wallets and balances
          </p>
        </div>
        <Button variant="outline" onClick={fetchWallets}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBalance)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ledger Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalLedger)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by email, name, or account number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Wallets Table */}
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
                    <TableHead>Virtual Account</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Ledger</TableHead>
                    <TableHead>Currency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallets.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No wallets found
                      </TableCell>
                    </TableRow>
                  ) : (
                    wallets.map((wallet) => (
                      <TableRow key={wallet.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {wallet.user_name || "No name"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {wallet.user_email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {wallet.virtual_account || "-"}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(wallet.available_balance)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatCurrency(wallet.ledger_balance)}
                        </TableCell>
                        <TableCell>{wallet.currency}</TableCell>
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
                    wallets
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
    </div>
  );
}
