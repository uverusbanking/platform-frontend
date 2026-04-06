import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency, formatDateTime } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Users,
  Wallet,
  History,
  Search,
  ChevronRight,
  Shield,
} from "lucide-react";

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

interface AdminWallet {
  id: string;
  user_id: string;
  currency: string;
  ledger_balance: number;
  available_balance: number;
  created_at: string;
}

interface AdminTransaction {
  id: string;
  wallet_id: string;
  reference: string;
  type: "credit" | "debit";
  status: string;
  channel: string;
  amount: number;
  fee: number;
  counterparty_name: string | null;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [wallets, setWallets] = useState<AdminWallet[]>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/account/dashboard");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);

    try {
      // Mock Data
      setUsers([]);
      setWallets([]);
      setTransactions([]);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredTransactions = transactions.filter(
    (t) =>
      t.reference.toLowerCase().includes(search.toLowerCase()) ||
      t.counterparty_name?.toLowerCase().includes(search.toLowerCase()),
  );

  // Calculate totals
  const totalBalance = wallets.reduce((sum, w) => sum + w.available_balance, 0);
  const totalTransactions = transactions.length;
  const totalVolume = transactions
    .filter((t) => t.status === "successful")
    .reduce((sum, t) => sum + t.amount, 0);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-gradient-hero safe-top">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">
                Admin Console
              </h1>
              <p className="text-white/70 text-sm">Read-only access</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-3 text-center">
                <p className="text-white/70 text-xs">Users</p>
                <p className="text-xl font-bold">{users.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-3 text-center">
                <p className="text-white/70 text-xs">Total Balance</p>
                <p className="text-xl font-bold">
                  ₦{(totalBalance / 1000000).toFixed(1)}M
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-3 text-center">
                <p className="text-white/70 text-xs">Transactions</p>
                <p className="text-xl font-bold">{totalTransactions}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search users, transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="users" className="gap-1">
              <Users size={14} />
              Users
            </TabsTrigger>
            <TabsTrigger value="wallets" className="gap-1">
              <Wallet size={14} />
              Wallets
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-1">
              <History size={14} />
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            {loading ? (
              <Card>
                <CardContent className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0 divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {user.full_name || "No name"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(user.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      No users found.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Wallets Tab */}
          <TabsContent value="wallets">
            {loading ? (
              <Card>
                <CardContent className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0 divide-y divide-border">
                  {wallets.map((wallet) => (
                    <div key={wallet.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium font-mono text-sm">
                            {wallet.id.slice(0, 8)}...
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {wallet.currency}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(wallet.available_balance)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Ledger: {formatCurrency(wallet.ledger_balance)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {wallets.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      No wallets found.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            {loading ? (
              <Card>
                <CardContent className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0 divide-y divide-border">
                  {filteredTransactions.map((tx) => (
                    <div key={tx.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {tx.counterparty_name || tx.reference}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {tx.channel.replace("_", " ")} • {tx.status}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${tx.type === "credit" ? "text-success" : ""}`}
                          >
                            {tx.type === "credit" ? "+" : "-"}
                            {formatCurrency(tx.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(tx.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      No transactions found.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
