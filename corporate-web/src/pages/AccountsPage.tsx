import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, PlusCircle, ArrowRightLeft, Download, Settings, MoreVertical } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface Account {
  id: string;
  name: string;
  type: "current" | "savings" | "domiciliary";
  currency: string;
  balance: number;
  pendingOutflows: number;
  thisMonth: number;
  burn: string;
  bankName: string;
  accountName: string;
  accountAlias: string;
  accountNumber: string;
  chartData: { date: string; balance: number }[];
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  date: string;
  counterparty: string;
  memo: string;
  source: string;
  amount: number;
}

const fmt = (n: number, currency = "NGN") => {
  const symbol = currency === "USD" ? "$" : currency === "GBP" ? "£" : "₦";
  return `${symbol} ${Math.abs(n).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const accounts: Account[] = [
  {
    id: "acc-1", name: "Main Operating", type: "current", currency: "NGN",
    balance: 84_520_300.57, pendingOutflows: 2_150_000, thisMonth: 12_340_000, burn: "3.2%",
    bankName: "Wema Bank", accountName: "Dangote Industries Ltd", accountAlias: "Main Operating Account", accountNumber: "8962413577",
    chartData: [
      { date: "26 Mar", balance: 82_000_000 }, { date: "27 Mar", balance: 83_100_000 },
      { date: "28 Mar", balance: 81_500_000 }, { date: "29 Mar", balance: 84_200_000 },
      { date: "30 Mar", balance: 84_000_000 }, { date: "31 Mar", balance: 84_520_000 },
      { date: "01 Apr", balance: 84_520_300 },
    ],
    transactions: [
      { id: "t1", date: "Apr 01, 2026", counterparty: "NNPC – Rev/Cot", memo: "Mar 2026 gas supply payment", source: "Main Operating", amount: 45_200_000 },
      { id: "t2", date: "Mar 31, 2026", counterparty: "Flour Mills Nig.", memo: "Cement raw material Q1", source: "Main Operating", amount: -18_500_000 },
      { id: "t3", date: "Mar 28, 2026", counterparty: "FIRS", memo: "WHT Feb 2026", source: "Main Operating", amount: -3_200_000 },
      { id: "t4", date: "Mar 25, 2026", counterparty: "Sterling-Craft Tech", memo: "Feb 2026 service charge", source: "Main Operating", amount: -1_006.20 },
      { id: "t5", date: "Mar 22, 2026", counterparty: "BUA Cement", memo: "Logistics settlement", source: "Main Operating", amount: 12_750_000 },
    ],
  },
  {
    id: "acc-2", name: "Payroll", type: "current", currency: "NGN",
    balance: 15_230_400, pendingOutflows: 14_800_000, thisMonth: 14_800_000, burn: "97%",
    bankName: "Wema Bank", accountName: "Dangote Industries Ltd – Payroll", accountAlias: "Payroll Account", accountNumber: "8962413590",
    chartData: [
      { date: "26 Mar", balance: 30_000_000 }, { date: "27 Mar", balance: 30_000_000 },
      { date: "28 Mar", balance: 29_500_000 }, { date: "29 Mar", balance: 15_400_000 },
      { date: "30 Mar", balance: 15_300_000 }, { date: "31 Mar", balance: 15_230_400 },
      { date: "01 Apr", balance: 15_230_400 },
    ],
    transactions: [
      { id: "t6", date: "Mar 29, 2026", counterparty: "Payroll batch", memo: "Mar 2026 salaries – 842 staff", source: "Payroll", amount: -14_500_000 },
      { id: "t7", date: "Mar 28, 2026", counterparty: "PAYE remittance", memo: "Mar 2026 PAYE", source: "Payroll", amount: -200_000 },
      { id: "t8", date: "Mar 01, 2026", counterparty: "Main Operating", memo: "Payroll funding Mar 2026", source: "Payroll", amount: 30_000_000 },
    ],
  },
  {
    id: "acc-3", name: "USD Domiciliary", type: "domiciliary", currency: "USD",
    balance: 125_800.42, pendingOutflows: 0, thisMonth: 0, burn: "0%",
    bankName: "Wema Bank", accountName: "Dangote Industries Ltd – DOM", accountAlias: "USD Domiciliary", accountNumber: "8962413601",
    chartData: [
      { date: "26 Mar", balance: 125_800 }, { date: "27 Mar", balance: 125_800 },
      { date: "28 Mar", balance: 125_800 }, { date: "29 Mar", balance: 125_800 },
      { date: "30 Mar", balance: 125_800 }, { date: "31 Mar", balance: 125_800 },
      { date: "01 Apr", balance: 125_800 },
    ],
    transactions: [
      { id: "t9", date: "Feb 15, 2026", counterparty: "Siemens AG", memo: "Turbine parts – PO #4421", source: "USD Domiciliary", amount: -42_500 },
      { id: "t10", date: "Jan 20, 2026", counterparty: "Shell Petroleum", memo: "Q4 2025 export proceeds", source: "USD Domiciliary", amount: 168_300 },
    ],
  },
];

const typeLabel: Record<string, string> = { current: "Current", savings: "Savings", domiciliary: "Domiciliary" };

export default function AccountsPage() {
  const [selectedId, setSelectedId] = useState(accounts[0].id);
  const [amountFilter, setAmountFilter] = useState("all");
  const account = accounts.find((a) => a.id === selectedId)!;

  const filteredTx = account.transactions.filter((tx) => {
    if (amountFilter === "credit") return tx.amount > 0;
    if (amountFilter === "debit") return tx.amount < 0;
    return true;
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account.accountNumber);
    toast.success("Account number copied");
  };

  return (
    <div className="space-y-6">
      {/* Account selector cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {accounts.map((acc) => (
          <Card
            key={acc.id}
            className={`cursor-pointer transition-all ${
              acc.id === selectedId ? "ring-2 ring-primary shadow-md" : "hover:shadow-md"
            }`}
            onClick={() => setSelectedId(acc.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium truncate">{acc.name}</span>
                <Badge variant="outline" className="text-[10px] shrink-0">{typeLabel[acc.type]}</Badge>
              </div>
              <p className="text-lg font-bold">{fmt(acc.balance, acc.currency)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected account detail header */}
      <div className="flex items-center gap-3">
        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">{typeLabel[account.type]}</Badge>
        <h2 className="text-base sm:text-lg font-semibold">{account.accountAlias}</h2>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "ACCOUNT BALANCE", value: fmt(account.balance, account.currency) },
          { label: "PENDING OUTFLOWS", value: fmt(account.pendingOutflows, account.currency) },
          { label: "THIS MONTH", value: fmt(account.thisMonth, account.currency) },
          { label: "BURN", value: account.burn },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{s.label}</p>
            <p className="text-base sm:text-xl font-bold mt-0.5 truncate">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Account info */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Total Balance</p>
            <p className="text-xl sm:text-2xl font-bold">{fmt(account.balance, account.currency)}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <span className="inline-block w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-emerald-600" />
              {fmt(0, account.currency)} Today, April 01
            </p>
            <div className="h-40 sm:h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={account.chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(v: number) => fmt(v, account.currency)} />
                  <Line type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="sr-only">Account details</span>
              <Button variant="ghost" size="sm" className="ml-auto gap-1.5 text-xs" onClick={copyToClipboard}>
                <Copy className="h-3.5 w-3.5" /> Copy
              </Button>
            </div>
            {[
              { label: "Bank name:", value: account.bankName },
              { label: "Account name:", value: account.accountName },
              { label: "Account alias:", value: account.accountAlias },
              { label: "Account number:", value: account.accountNumber },
            ].map((row) => (
              <div key={row.label} className="flex flex-col sm:flex-row sm:gap-4 text-sm">
                <span className="text-muted-foreground sm:w-32 shrink-0">{row.label}</span>
                <span className="font-medium truncate">{row.value}</span>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 border-t">
              {[
                { icon: PlusCircle, label: "Fund" },
                { icon: ArrowRightLeft, label: "Move funds" },
                { icon: Download, label: "Statement" },
                { icon: Settings, label: "Settings" },
              ].map((action) => (
                <Button key={action.label} variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <action.icon className="h-3.5 w-3.5" /> {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Transactions</h3>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={amountFilter} onValueChange={setAmountFilter}>
            <SelectTrigger className="w-[130px] h-9 text-sm">
              <SelectValue placeholder="Amount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="credit">Credit only</SelectItem>
              <SelectItem value="debit">Debit only</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setAmountFilter("all")}>Clear filters</Button>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="block sm:hidden space-y-3">
          {filteredTx.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions found</p>
          ) : filteredTx.map((tx) => (
            <Card key={tx.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{tx.counterparty}</span>
                <span className={`text-sm font-medium ${tx.amount < 0 ? "text-destructive" : "text-emerald-600"}`}>
                  {tx.amount < 0 ? "- " : ""}{fmt(tx.amount, account.currency)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{tx.memo}</p>
              <p className="text-xs text-muted-foreground">{tx.date}</p>
            </Card>
          ))}
        </div>

        {/* Desktop table */}
        <Card className="hidden sm:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Counterparty</TableHead>
                  <TableHead className="text-xs">Transaction memo</TableHead>
                  <TableHead className="text-xs">Source/destination</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTx.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No transactions found</TableCell>
                  </TableRow>
                ) : filteredTx.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-sm whitespace-nowrap">{tx.date}</TableCell>
                    <TableCell className="text-sm">{tx.counterparty}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-[220px]">{tx.memo}</TableCell>
                    <TableCell className="text-sm">{tx.source}</TableCell>
                    <TableCell className={`text-sm text-right font-medium whitespace-nowrap ${tx.amount < 0 ? "text-destructive" : "text-emerald-600"}`}>
                      {tx.amount < 0 ? "- " : ""}{fmt(tx.amount, account.currency)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
