import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { formatDateTime } from "@/lib/currency";
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
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  FileText,
  RefreshCw,
} from "lucide-react";

interface KYCDocument {
  id: string;
  user_id: string;
  document_type: string;
  document_number: string | null;
  document_url: string | null;
  status: string;
  rejection_reason: string | null;
  metadata: unknown;
  created_at: string;
  verified_at: string | null;
}

interface KYCWithUser extends KYCDocument {
  user_email?: string;
  user_name?: string;
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  bvn: "BVN",
  nin: "NIN",
  passport: "Passport",
  drivers_license: "Driver's License",
  national_id: "National ID",
  utility_bill: "Utility Bill",
  bank_statement: "Bank Statement",
  selfie: "Selfie",
};

export default function AdminKYC() {
  const { hasPermission, logAction } = useAdmin();
  const { toast } = useToast();

  const [documents, setDocuments] = useState<KYCWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Action dialogs
  const [selectedDoc, setSelectedDoc] = useState<KYCWithUser | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const canManageKyc = hasPermission("manage_kyc");

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      // Mock Data
      setDocuments([]);
    } catch (err) {
      console.error("Error fetching KYC documents:", err);
      toast({
        title: "Error",
        description: "Failed to fetch KYC documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, search, toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    logAction("view", "kyc_list");
  }, []);

  const handleApprove = async () => {
    if (!selectedDoc) return;
    setActionLoading(true);

    try {
      await logAction("approve_kyc", "kyc_document", selectedDoc.id, {
        document_type: selectedDoc.document_type,
        user_id: selectedDoc.user_id,
      });

      toast({
        title: "KYC Approved",
        description: `${DOCUMENT_TYPE_LABELS[selectedDoc.document_type]} has been approved.`,
      });

      setReviewDialogOpen(false);
      fetchDocuments();
    } catch (err) {
      console.error("Error approving KYC:", err);
      toast({
        title: "Error",
        description: "Failed to approve document",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDoc || !rejectionReason.trim()) return;
    setActionLoading(true);

    try {
      await logAction("reject_kyc", "kyc_document", selectedDoc.id, {
        document_type: selectedDoc.document_type,
        user_id: selectedDoc.user_id,
        reason: rejectionReason,
      });

      toast({
        title: "KYC Rejected",
        description: `${DOCUMENT_TYPE_LABELS[selectedDoc.document_type]} has been rejected.`,
      });

      setReviewDialogOpen(false);
      setRejectionReason("");
      fetchDocuments();
    } catch (err) {
      console.error("Error rejecting KYC:", err);
      toast({
        title: "Error",
        description: "Failed to reject document",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">KYC Review</h1>
          <p className="text-muted-foreground">
            Review and verify user documents
          </p>
        </div>
        <Button variant="outline" onClick={fetchDocuments}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {documents.filter((d) => d.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {documents.filter((d) => d.status === "approved").length}
              </p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {documents.filter((d) => d.status === "rejected").length}
              </p>
              <p className="text-sm text-muted-foreground">Rejected</p>
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
                placeholder="Search by email or document number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bvn">BVN</SelectItem>
                <SelectItem value="nin">NIN</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="drivers_license">
                  Driver's License
                </SelectItem>
                <SelectItem value="national_id">National ID</SelectItem>
                <SelectItem value="utility_bill">Utility Bill</SelectItem>
                <SelectItem value="bank_statement">Bank Statement</SelectItem>
                <SelectItem value="selfie">Selfie</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Document Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No documents found
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {doc.user_name || "No name"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {doc.user_email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {DOCUMENT_TYPE_LABELS[doc.document_type] ||
                            doc.document_type}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {doc.document_number || "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(doc.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={
                            doc.status === "pending" && canManageKyc
                              ? "default"
                              : "ghost"
                          }
                          onClick={() => {
                            setSelectedDoc(doc);
                            setReviewDialogOpen(true);
                            setRejectionReason("");
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {doc.status === "pending" && canManageKyc
                            ? "Review"
                            : "View"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review KYC Document</DialogTitle>
            <DialogDescription>
              {selectedDoc &&
                `${DOCUMENT_TYPE_LABELS[selectedDoc.document_type]} submitted by ${selectedDoc.user_email}`}
            </DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Document Type</Label>
                  <p className="font-medium">
                    {DOCUMENT_TYPE_LABELS[selectedDoc.document_type]}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Document Number
                  </Label>
                  <p className="font-mono">
                    {selectedDoc.document_number || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedDoc.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Submitted</Label>
                  <p>{formatDateTime(selectedDoc.created_at)}</p>
                </div>
              </div>

              {selectedDoc.document_url && (
                <div>
                  <Label className="text-muted-foreground">
                    Document Preview
                  </Label>
                  <div className="mt-2 border rounded-lg p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Document URL: {selectedDoc.document_url}
                    </p>
                  </div>
                </div>
              )}

              {selectedDoc.rejection_reason && (
                <div>
                  <Label className="text-muted-foreground">
                    Rejection Reason
                  </Label>
                  <p className="text-destructive">
                    {selectedDoc.rejection_reason}
                  </p>
                </div>
              )}

              {selectedDoc.status === "pending" && canManageKyc && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Rejection Reason (if rejecting)</Label>
                    <Textarea
                      placeholder="Enter reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Close
            </Button>
            {selectedDoc?.status === "pending" && canManageKyc && (
              <>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={actionLoading || !rejectionReason.trim()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
