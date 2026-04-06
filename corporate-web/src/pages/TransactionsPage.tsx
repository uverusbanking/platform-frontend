import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MoreVertical, Landmark } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  counterparty: string;
  memo: string;
  source: string;
  amount: number;
  direction: "credit" | "debit";
}

const mockTransactions: Transaction[] = [
  { id: "t1", date: "Mar 03, 2026", counterparty: "Greenfield Supplies Ltd", memo: "Office equipment purchase", source: "Operating Account", amount: 45_500, direction: "debit" },
  { id: "t2", date: "Mar 02, 2026", counterparty: "Adebayo Fashola Inc", memo: "Consulting fee - Feb", source: "Operating Account", amount: 375_000, direction: "debit" },
  { id: "t3", date: "Mar 01, 2026", counterparty: "NovaPay Merchant Services", memo: "Client payment received", source: "Collections Account", amount: 1_280_000, direction: "credit" },
  { id: "t4", date: "Feb 28, 2026", counterparty: "Pinnacle Logistics Co", memo: "Freight charges - Lagos depot", source: "Operating Account", amount: 62_000, direction: "debit" },
  { id: "t5", date: "Feb 27, 2026", counterparty: "TechVista Solutions", memo: "SaaS subscription Q1", source: "Tech Expenses", amount: 150_000, direction: "debit" },
  { id: "t6", date: "Feb 26, 2026", counterparty: "Kingsway Holdings", memo: "Partnership disbursement", source: "Collections Account", amount: 2_750_000, direction: "credit" },
  { id: "t7", date: "Feb 25, 2026", counterparty: "Meridian Healthcare", memo: "Staff health insurance", source: "Payroll Account", amount: 820_000, direction: "debit" },
  { id: "t8", date: "Feb 24, 2026", counterparty: "Coastal Energy Partners", memo: "Diesel supply - Feb", source: "Operating Account", amount: 195_000, direction: "debit" },
  { id: "t9", date: "Feb 22, 2026", counterparty: "BlueSky Marketing Agency", memo: "Campaign management", source: "Tech Expenses", amount: 280_000, direction: "debit" },
  { id: "t10", date: "Feb 21, 2026", counterparty: "Orion Trade Partners", memo: "Export receivable", source: "Collections Account", amount: 4_100_000, direction: "credit" },
  { id: "t11", date: "Feb 20, 2026", counterparty: "Apex Construction Ltd", memo: "Site renovation deposit", source: "Operating Account", amount: 1_250_000, direction: "debit" },
  { id: "t12", date: "Feb 18, 2026", counterparty: "Zenith Catering Services", memo: "Corporate event catering", source: "Operating Account", amount: 87_500, direction: "debit" },
  { id: "t13", date: "Feb 17, 2026", counterparty: "Fidelity Leasing Corp", memo: "Quarterly lease payment received", source: "Collections Account", amount: 960_000, direction: "credit" },
  { id: "t14", date: "Feb 15, 2026", counterparty: "DataCore Networks", memo: "Internet service - Feb", source: "Tech Expenses", amount: 42_000, direction: "debit" },
  { id: "t15", date: "Feb 14, 2026", counterparty: "Sterling Properties Ltd", memo: "Office lease - Victoria Island", source: "Operating Account", amount: 3_500_000, direction: "debit" },
];

const fmt = (n: number) =>
  "₦ " + n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

  const sources = Array.from(new Set(mockTransactions.map((t) => t.source)));

  const filtered = mockTransactions.filter((tx) => {
    if (search && !tx.counterparty.toLowerCase().includes(search.toLowerCase()) && !tx.memo.toLowerCase().includes(search.toLowerCase())) return false;
    if (sourceFilter !== "all" && tx.source !== sourceFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
        Transactions
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
        <div className="relative w-full sm:w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
          <Select defaultValue="">
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Start date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="">
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="End date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="">
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Amount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lt1k">Under ₦1,000</SelectItem>
              <SelectItem value="1k-10k">₦1,000 – ₦10,000</SelectItem>
              <SelectItem value="10k-100k">₦10,000 – ₦100,000</SelectItem>
              <SelectItem value="gt100k">Over ₦100,000</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              {sources.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <Button variant="outline" size="sm" className="text-xs flex-1 sm:flex-none">Apply filters</Button>
          <Button variant="ghost" size="sm" className="text-xs flex-1 sm:flex-none" onClick={() => { setSearch(""); setSourceFilter("all"); }}>Clear filters</Button>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="block sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No transactions found</p>
        ) : filtered.map((tx) => (
          <Card key={tx.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{tx.counterparty}</span>
              <span className={`text-sm font-medium ${tx.direction === "credit" ? "text-success" : ""}`}>
                {tx.direction === "credit" ? "+ " : "- "}{fmt(tx.amount)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{tx.memo}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{tx.date}</span>
              <div className="flex items-center gap-1">
                <Landmark className="h-3 w-3" />
                <span>{tx.source}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Date</TableHead>
                <TableHead className="text-xs font-semibold">Counterparty</TableHead>
                <TableHead className="text-xs font-semibold">Transaction memo</TableHead>
                <TableHead className="text-xs font-semibold">Source/destination</TableHead>
                <TableHead className="text-xs font-semibold text-right">Amount</TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No transactions found</TableCell>
                </TableRow>
              ) : filtered.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-sm whitespace-nowrap">{tx.date}</TableCell>
                  <TableCell className="text-sm">{tx.counterparty}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{tx.memo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Landmark className="h-4 w-4 text-muted-foreground" />
                      {tx.source}
                    </div>
                  </TableCell>
                  <TableCell className={`text-sm text-right font-medium whitespace-nowrap ${tx.direction === "credit" ? "text-success" : ""}`}>
                    {tx.direction === "credit" ? "+ " : "- "}{fmt(tx.amount)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
