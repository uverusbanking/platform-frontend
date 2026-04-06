import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { formatCurrency } from "@/lib/currency";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Wallet,
  History,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalWallets: number;
  totalBalance: number;
  totalTransactions: number;
  pendingKyc: number;
  pendingTierRequests: number;
  suspendedUsers: number;
}

export default function AdminDashboard() {
  const { adminUser, logAction } = useAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    logAction("view", "dashboard");
  }, []);

  const fetchStats = async () => {
    try {
      // Mock stats
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        totalWallets: 0,
        totalBalance: 0,
        totalTransactions: 0,
        pendingKyc: 0,
        pendingTierRequests: 0,
        suspendedUsers: 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    trend,
    variant = "default",
  }: {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: string;
    variant?: "default" | "warning" | "success" | "danger";
  }) => {
    const iconColors = {
      default: "text-primary",
      warning: "text-amber-500",
      success: "text-emerald-500",
      danger: "text-destructive",
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className={`h-5 w-5 ${iconColors[variant]}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center text-xs text-emerald-500 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {adminUser?.first_name || "Admin"}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {adminUser?.first_name || "Admin"}
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          description={`${stats?.activeUsers || 0} verified`}
          icon={Users}
        />
        <StatCard
          title="Total Balance"
          value={formatCurrency(stats?.totalBalance || 0)}
          description={`${stats?.totalWallets || 0} wallets`}
          icon={Wallet}
        />
        <StatCard
          title="Transactions"
          value={stats?.totalTransactions || 0}
          icon={History}
        />
        <StatCard
          title="Pending KYC"
          value={stats?.pendingKyc || 0}
          description="Awaiting review"
          icon={FileCheck}
          variant={stats?.pendingKyc ? "warning" : "default"}
        />
      </div>

      {/* Action Items */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Pending Tier Requests
            </CardTitle>
            <CardDescription>Users awaiting tier upgrades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.pendingTierRequests || 0}
            </div>
            {(stats?.pendingTierRequests || 0) > 0 && (
              <p className="text-sm text-amber-500 mt-2">Requires attention</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Suspended Users
            </CardTitle>
            <CardDescription>Currently suspended accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.suspendedUsers || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              System Status
            </CardTitle>
            <CardDescription>All systems operational</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium">Healthy</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions or Recent Activity could go here */}
    </div>
  );
}
