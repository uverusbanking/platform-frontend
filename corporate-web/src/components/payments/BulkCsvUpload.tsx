import { useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  X,
  Download,
} from "lucide-react";
import { toast } from "sonner";

interface CsvRow {
  accountNumber: string;
  bankName: string;
  recipientName: string;
  amount: string;
  memo: string;
  valid: boolean;
  error?: string;
}

const fmt = (n: number) =>
  "₦ " +
  n.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function parseCsv(text: string): CsvRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  return lines.slice(1).map((line) => {
    const parts = line.split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
    const [
      accountNumber = "",
      bankName = "",
      recipientName = "",
      amount = "",
      memo = "",
    ] = parts;

    let valid = true;
    let error: string | undefined;

    if (!accountNumber || accountNumber.length < 10) {
      valid = false;
      error = "Invalid account number";
    } else if (!bankName) {
      valid = false;
      error = "Missing bank name";
    } else if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      valid = false;
      error = "Invalid amount";
    }

    return {
      accountNumber,
      bankName,
      recipientName,
      amount,
      memo,
      valid,
      error,
    };
  });
}

const sampleCsv = `Account Number,Bank Name,Recipient Name,Amount,Memo
8962413577,Access Bank,Greenfield Supplies Ltd,450000,Office equipment purchase
8962413590,Zenith Bank,Adebayo Fashola Inc,375000,Consulting fee - March
8962413601,First Bank,Pinnacle Logistics Co,62000,Freight charges
8962413612,GTBank,TechVista Solutions,150000,SaaS subscription Q2`;

export default function BulkCsvUpload() {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [batchName, setBatchName] = useState("");
  const [sourceAccount, setSourceAccount] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCsv(text);
      setRows(parsed);
      setFileName(file.name);
      if (parsed.length === 0) {
        toast.error("No valid rows found in CSV");
      } else {
        const invalid = parsed.filter((r) => !r.valid).length;
        if (invalid > 0) {
          toast.warning(`${invalid} of ${parsed.length} rows have errors`);
        } else {
          toast.success(`${parsed.length} recipients loaded`);
        }
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith(".csv") || file.type === "text/csv")) {
        handleFile(file);
      } else {
        toast.error("Please upload a .csv file");
      }
    },
    [handleFile],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([sampleCsv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk_payment_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const validRows = rows.filter((r) => r.valid);
  const invalidRows = rows.filter((r) => !r.valid);
  const totalAmount = validRows.reduce((s, r) => s + Number(r.amount), 0);

  const handleRemoveRow = (idx: number) => {
    setRows(rows.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (!batchName || !sourceAccount) return;
    setConfirmOpen(false);
    setRows([]);
    setFileName("");
    setBatchName("");
    setSourceAccount("");
    toast.success(
      `Bulk payment "${batchName}" submitted for approval (${validRows.length} recipients, ${fmt(totalAmount)})`,
    );
  };

  if (rows.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p
            className="text-sm"
            style={{ color: "rgb(var(--foreground-subtle))" }}
          >
            Upload a CSV file to create a bulk payment batch.
          </p>
          <button
            className="btn-pill btn-outline text-xs gap-1.5"
            onClick={handleDownloadTemplate}
          >
            <Download className="h-3.5 w-3.5" />
            Download template
          </button>
        </div>
        <div
          className="rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "2px dashed rgb(var(--border))",
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor =
              "rgb(var(--brand-primary) / 0.5)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "rgb(var(--border))")
          }
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleInputChange}
          />
          <Upload
            className="h-10 w-10 mx-auto mb-4"
            style={{ color: "rgb(var(--foreground-subtle))" }}
          />
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "rgb(var(--foreground))" }}
          >
            Drop your CSV file here or click to browse
          </p>
          <p
            className="text-xs"
            style={{ color: "rgb(var(--foreground-subtle))" }}
          >
            Required columns: Account Number, Bank Name, Recipient Name, Amount,
            Memo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <FileSpreadsheet
            className="h-5 w-5 shrink-0"
            style={{ color: "rgb(var(--brand-primary))" }}
          />
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "rgb(var(--foreground))" }}
            >
              {fileName}
            </p>
            <p
              className="text-xs"
              style={{ color: "rgb(var(--foreground-subtle))" }}
            >
              {validRows.length} valid · {invalidRows.length} errors · Total:{" "}
              {fmt(totalAmount)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-pill btn-outline text-xs"
            onClick={() => {
              setRows([]);
              setFileName("");
            }}
          >
            Clear
          </button>
          <button
            className="btn-pill btn-primary text-xs disabled:opacity-50"
            disabled={validRows.length === 0}
            onClick={() => setConfirmOpen(true)}
          >
            Submit Batch ({validRows.length})
          </button>
        </div>
      </div>

      {/* Error summary */}
      {invalidRows.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <div className="text-xs text-destructive">
            <p className="font-medium">
              {invalidRows.length} row(s) have errors and will be skipped.
            </p>
            <p>Fix the CSV and re-upload, or remove invalid rows below.</p>
          </div>
        </div>
      )}

      {/* Mobile cards */}
      <div className="block sm:hidden space-y-2">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-3 space-y-1 shadow-card"
            style={{
              background: row.valid
                ? "rgb(var(--surface-highest))"
                : "rgb(var(--destructive) / 0.05)",
              border: row.valid
                ? "none"
                : "1px solid rgb(var(--destructive) / 0.2)",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{ color: "rgb(var(--foreground))" }}
              >
                {row.recipientName || "Unknown"}
              </span>
              <div className="flex items-center gap-1">
                {row.valid ? (
                  <CheckCircle2
                    className="h-3.5 w-3.5"
                    style={{ color: "rgb(var(--mint-deep))" }}
                  />
                ) : (
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-pill"
                    style={{
                      background: "rgb(var(--destructive) / 0.1)",
                      color: "rgb(var(--destructive))",
                    }}
                  >
                    {row.error}
                  </span>
                )}
                <button
                  className="h-6 w-6 flex items-center justify-center rounded-pill hover:bg-surface transition-colors"
                  onClick={() => handleRemoveRow(idx)}
                >
                  <X
                    className="h-3 w-3"
                    style={{ color: "rgb(var(--foreground-subtle))" }}
                  />
                </button>
              </div>
            </div>
            <div
              className="flex items-center justify-between text-xs"
              style={{ color: "rgb(var(--foreground-subtle))" }}
            >
              <span>
                {row.accountNumber} · {row.bankName}
              </span>
              <span
                className="font-medium"
                style={{ color: "rgb(var(--foreground))" }}
              >
                {row.valid ? fmt(Number(row.amount)) : row.amount}
              </span>
            </div>
          </div>
        ))}
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
                <TableHead className="eyebrow py-3 w-8">#</TableHead>
                <TableHead className="eyebrow py-3">Recipient</TableHead>
                <TableHead className="eyebrow py-3">Account</TableHead>
                <TableHead className="eyebrow py-3">Bank</TableHead>
                <TableHead className="eyebrow py-3">Memo</TableHead>
                <TableHead className="eyebrow py-3 text-right">
                  Amount
                </TableHead>
                <TableHead className="eyebrow py-3 w-20">Status</TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow
                  key={idx}
                  style={
                    !row.valid
                      ? { background: "rgb(var(--destructive) / 0.04)" }
                      : undefined
                  }
                  className="hover:bg-surface transition-colors"
                >
                  <TableCell
                    className="text-xs"
                    style={{ color: "rgb(var(--foreground-subtle))" }}
                  >
                    {idx + 1}
                  </TableCell>
                  <TableCell
                    className="text-sm font-medium"
                    style={{ color: "rgb(var(--foreground))" }}
                  >
                    {row.recipientName || "—"}
                  </TableCell>
                  <TableCell
                    className="text-sm"
                    style={{ color: "rgb(var(--foreground))" }}
                  >
                    {row.accountNumber}
                  </TableCell>
                  <TableCell
                    className="text-sm"
                    style={{ color: "rgb(var(--foreground))" }}
                  >
                    {row.bankName}
                  </TableCell>
                  <TableCell
                    className="text-sm truncate max-w-[180px]"
                    style={{ color: "rgb(var(--foreground-subtle))" }}
                  >
                    {row.memo || "—"}
                  </TableCell>
                  <TableCell
                    className="text-sm text-right font-medium whitespace-nowrap"
                    style={{ color: "rgb(var(--foreground))" }}
                  >
                    {row.valid ? fmt(Number(row.amount)) : row.amount}
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-pill"
                      style={
                        row.valid
                          ? {
                              background: "rgb(var(--mint) / 0.3)",
                              color: "rgb(var(--mint-deep))",
                            }
                          : {
                              background: "rgb(var(--destructive) / 0.1)",
                              color: "rgb(var(--destructive))",
                            }
                      }
                    >
                      {row.valid ? "Valid" : row.error}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      className="h-6 w-6 flex items-center justify-center rounded-pill hover:bg-surface transition-colors"
                      onClick={() => handleRemoveRow(idx)}
                    >
                      <X
                        className="h-3 w-3"
                        style={{ color: "rgb(var(--foreground-subtle))" }}
                      />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Bulk Payment</DialogTitle>
            <DialogDescription>
              Review and confirm the batch details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Batch name
              </Label>
              <Input
                placeholder="e.g. April Vendor Payments"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Source account
              </Label>
              <Select value={sourceAccount} onValueChange={setSourceAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operating">
                    Operating Account — ₦ 12,450,000.00
                  </SelectItem>
                  <SelectItem value="collections">
                    Collections Account — ₦ 8,320,000.00
                  </SelectItem>
                  <SelectItem value="payroll">
                    Payroll Account — ₦ 3,150,000.00
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recipients</span>
                <span className="font-medium">{validRows.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total amount</span>
                <span className="font-semibold">{fmt(totalAmount)}</span>
              </div>
              {invalidRows.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Skipped (errors)
                  </span>
                  <span className="text-destructive">{invalidRows.length}</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!batchName || !sourceAccount}
            >
              Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
