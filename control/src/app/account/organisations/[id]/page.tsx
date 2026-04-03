"use client";

import { use, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Clock,
  Building2,
  Activity,
  Shield,
  Wallet,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Edit,
  FileText,
  Users,
  Key,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import {
  useGetOrganisationById,
  useGetOrganisationDocuments,
  useGetOrganisationStatsById,
} from "@/hooks/queries/useOrganisationQueries";
import { useUpdateOrganisationDocumentStatus } from "@/hooks/mutations/useOrganisationMutations";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { IOrganisationDocument } from "@/types/organisation.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EditOrganisationDialog } from "@/components/features/platform/EditOrganisationDialog";
import { ManageMembersDialog } from "@/components/features/platform/ManageMembersDialog";
import { EditOrganisationDocumentsDialog } from "@/components/features/platform/EditOrganisationDocumentsDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function OrganisationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: organisationResponse, isLoading } = useGetOrganisationById(id);
  const { data: documents, isLoading: isLoadingDocs } =
    useGetOrganisationDocuments(id);
  const { data: statsResponse, isLoading: isLoadingStats } =
    useGetOrganisationStatsById(id, {
      startDate: "2023-01-01T00:00:00.000Z",
      endDate: "2023-12-31T23:59:59.999Z",
    });
  const organisation = organisationResponse?.data;
  const stats = statsResponse?.data;
  const [selectedDocument, setSelectedDocument] =
    useState<IOrganisationDocument | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [isDocsDialogOpen, setIsDocsDialogOpen] = useState(false);

  const formatVolume = (val?: number) => {
    if (val === undefined) return "₦--";
    if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₦${(val / 1000).toFixed(1)}K`;
    return `₦${val.toLocaleString()}`;
  };

  const getComplianceTier = (percentage?: number) => {
    if (percentage === undefined) return "Tier 1";
    if (percentage >= 100) return "Verified";
    if (percentage >= 70) return "Tier 3";
    if (percentage >= 40) return "Tier 2";
    return "Tier 1";
  };

  if (isLoading) return <OrganisationDetailSkeleton />;
  if (!organisation)
    return (
      <div className="p-12 text-center text-lg font-medium">
        Organisation not found.
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Dynamic Header with Navigation */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href="/account/organisations">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted/50 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Link
              href="/account/organisations"
              className="hover:text-primary transition-colors"
            >
              Organisations
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">
              {organisation.organisation_name}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-2 border-b border-border/50">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-primary rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
              <Avatar className="h-24 w-24 rounded-2xl border-4 border-background ring-4 ring-primary/5 shadow-2xl relative bg-primary/10 text-primary">
                <AvatarFallback className="text-2xl font-bold uppercase">
                  {organisation.organisation_name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-success text-white p-1.5 rounded-full border-4 border-background shadow-lg">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {organisation.organisation_name}
                </h1>
                <Badge
                  variant="secondary"
                  className="font-medium text-xs px-2 py-0.5 h-6"
                >
                  {organisation.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {organisation.business_email}
                </div>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Since{" "}
                  {new Date(organisation.created_at).toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" },
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              className="flex-1 lg:flex-none border-border/60 hover:bg-muted/50 rounded-xl px-4"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex-1 lg:flex-none h-10 rounded-xl px-4 shadow-sm transition-all">
                  Manage
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 p-1 rounded-xl border-border/50 shadow-xl"
              >
                <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-2 py-1.5">
                  Organisation Control
                </DropdownMenuLabel>
                <DropdownMenuItem className="rounded-lg h-9 gap-2 cursor-pointer">
                  <Key className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium">Reset API Keys</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-lg h-9 gap-2 cursor-pointer"
                  onClick={() => setIsMembersDialogOpen(true)}
                >
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium">Manage Members</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem className="rounded-lg h-9 gap-2 cursor-pointer text-error hover:bg-error/5 hover:text-error">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span className="text-sm font-medium">Suspend Account</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stats and Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Enhanced Stats Grid */}
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="border-none shadow-lg relative overflow-hidden group bg-linear-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Wallet className="h-20 w-20 text-indigo-500" />
              </div>
              <CardContent className="p-6">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                  Total Volume
                </div>
                {isLoadingStats ? (
                  <Skeleton className="h-9 w-24" />
                ) : (
                  <div className="text-3xl font-extrabold tracking-tight text-foreground">
                    {formatVolume(stats?.total_balance)}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 mt-2 bg-emerald-500/10 w-fit px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  {stats?.volume_change_percentage
                    ? `+${stats.volume_change_percentage}%`
                    : "+0%"}{" "}
                  this month
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg relative overflow-hidden group bg-linear-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users className="h-20 w-20 text-blue-500" />
              </div>
              <CardContent className="p-6">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                  Active Customers
                </div>
                {isLoadingStats ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <div className="text-3xl font-extrabold tracking-tight text-foreground">
                    {stats?.total_customers ?? "0"}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-500 mt-2 bg-blue-500/10 w-fit px-2 py-0.5 rounded-full">
                  <Activity className="w-3 h-3" />
                  Managed Users
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg relative overflow-hidden group bg-linear-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="h-20 w-20 text-emerald-500" />
              </div>
              <CardContent className="p-6">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                  Compliance Status
                </div>
                {isLoadingStats ? (
                  <Skeleton className="h-9 w-28" />
                ) : (
                  <div className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                    {getComplianceTier(
                      stats?.kyc_statistics?.approval_percentage,
                    )}
                    {stats?.kyc_statistics?.approval_percentage === 100 && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 mt-2 bg-emerald-500/10 w-fit px-2 py-0.5 rounded-full">
                  {stats?.kyc_statistics?.approval_percentage ?? 0}% Approved
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Details Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Corporate Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    TIN (Tax Identification Number)
                  </span>
                  <div className="font-mono font-bold text-lg tracking-wide">
                    {organisation.tin || "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    CAC Registration
                  </span>
                  <div className="font-mono font-bold text-lg tracking-wide">
                    {organisation.cac_registration_number || "N/A"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  System Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Platform ID
                  </span>
                  <div className="font-mono font-bold text-xs bg-muted p-2 rounded-lg break-all">
                    {organisation.platform_id}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Organisation Type
                  </span>
                  <div>
                    <Badge
                      variant="outline"
                      className="uppercase text-[10px] font-bold"
                    >
                      Corporate Entity
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents Section - Grid of Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Compliance Documents
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-bold">
                  {documents?.length || 0} Files
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-lg text-primary hover:text-primary hover:bg-primary/10 font-bold gap-2 px-3"
                  onClick={() => setIsDocsDialogOpen(true)}
                >
                  <UploadCloud className="w-4 h-4" />
                  Update Documents
                </Button>
              </div>
            </div>

            {isLoadingDocs ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : documents && documents.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {documents.map((doc, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedDocument(doc)}
                    className="group relative bg-card hover:bg-muted/50 border border-border/40 rounded-xl p-5 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary shadow-inner">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <h4
                          className="font-bold text-sm line-clamp-1 pr-4"
                          title={doc.name}
                        >
                          {doc.name}
                        </h4>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 border-0 ${
                              ["VERIFIED", "APPROVED"].includes(doc.status)
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                                : doc.status === "PENDING"
                                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                                  : ["DECLINED", "REJECTED"].includes(
                                        doc.status,
                                      )
                                    ? "bg-rose-500/15 text-rose-700 dark:text-rose-400"
                                    : "bg-slate-500/15 text-slate-700 dark:text-slate-400"
                            }`}
                          >
                            {doc.status}
                          </Badge>
                          <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {doc.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-3 text-[10px] font-medium text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Uploaded{" "}
                          {new Date(doc.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 bg-transparent p-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-2">
                  <FileText className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h4 className="font-bold text-lg">No documents found</h4>
                <p className="text-muted-foreground text-sm max-w-xs">
                  There are no compliance documents uploaded for this
                  organisation yet.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column: Contact & Metadata */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-lg bg-card/80 backdrop-blur-xl sticky top-6">
            <CardHeader className="pb-2 border-b border-border/50">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="group flex items-center gap-4 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-default">
                <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Telephone
                  </span>
                  <span className="font-bold text-sm">
                    {organisation.business_phone || "Not Set"}
                  </span>
                </div>
              </div>

              <div className="group flex items-center gap-4 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-default">
                <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Headquarters
                  </span>
                  <span className="font-bold text-sm">Lagos, Nigeria</span>
                </div>
              </div>

              <div className="group flex items-center gap-4 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-default">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Official Email
                  </span>
                  <span className="font-bold text-sm break-all">
                    {organisation.business_email}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border-none shadow-lg p-6 space-y-4 transition-all ${
              (stats?.kyc_statistics?.approval_percentage ?? 0) >= 100
                ? "bg-linear-to-b from-emerald-500/10 to-transparent"
                : "bg-linear-to-b from-amber-500/10 to-transparent"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  (stats?.kyc_statistics?.approval_percentage ?? 0) >= 100
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                }`}
              >
                {(stats?.kyc_statistics?.approval_percentage ?? 0) >= 100 ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-widest ${
                  (stats?.kyc_statistics?.approval_percentage ?? 0) >= 100
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {(stats?.kyc_statistics?.approval_percentage ?? 0) >= 100
                  ? "Status Verified"
                  : "Verification In Progress"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              {(stats?.kyc_statistics?.approval_percentage ?? 0) >= 100
                ? "This organisation has passed all automated and manual verification checks."
                : "Some documents are still awaiting review or need to be uploaded for full clearance."}
            </p>
            <div className="pt-2 space-y-4">
              <div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground mb-1">
                  <span>Document Uploads</span>
                  <span className="text-primary">
                    {stats?.kyc_statistics?.upload_percentage ?? 0}%
                  </span>
                </div>
                <Progress
                  value={stats?.kyc_statistics?.upload_percentage ?? 0}
                  className="h-1.5 bg-primary/10"
                  indicatorClassName="bg-primary"
                />
              </div>
              <div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground mb-1">
                  <span>Approval Progress</span>
                  <span className="text-emerald-600">
                    {stats?.kyc_statistics?.approval_percentage ?? 0}%
                  </span>
                </div>
                <Progress
                  value={stats?.kyc_statistics?.approval_percentage ?? 0}
                  className="h-1.5 bg-emerald-500/20"
                  indicatorClassName="bg-emerald-500"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <EditOrganisationDialog
        organisation={organisation}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <DocumentReviewDialog
        document={selectedDocument}
        open={!!selectedDocument}
        onOpenChange={(open) => !open && setSelectedDocument(null)}
      />

      <ManageMembersDialog
        organisationId={id}
        organisationName={organisation.organisation_name}
        open={isMembersDialogOpen}
        onOpenChange={setIsMembersDialogOpen}
      />

      <EditOrganisationDocumentsDialog
        organisationId={id}
        existingDocuments={documents || []}
        open={isDocsDialogOpen}
        onOpenChange={setIsDocsDialogOpen}
      />
    </div>
  );
}

function DocumentReviewDialog({
  document,
  open,
  onOpenChange,
}: {
  document: IOrganisationDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutateAsync: updateStatus, isPending } =
    useUpdateOrganisationDocumentStatus();
  const [reason, setReason] = useState("");
  const [action, setAction] = useState<"APPROVE" | "DECLINE" | null>(null);

  if (!document) return null;

  const handleUpdate = async (status: "APPROVED" | "DECLINED") => {
    try {
      await updateStatus({
        documentId: document.id,
        status,
        reason: status === "DECLINED" ? reason : undefined,
      });
      onOpenChange(false);
      setReason("");
      setAction(null);
    } catch (error) {
      console.error("Failed to update document status", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl sm:rounded-2xl">
        <DialogTitle className="sr-only">
          Review Document: {document.name}
        </DialogTitle>
        <div className="flex flex-1 overflow-hidden">
          {/* Document Preview Area (Left/Main) */}
          <div className="flex-1 bg-muted/30 relative flex flex-col group/preview">
            {/* Preview Toolbar */}
            <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
              {document.file_url && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 shadow-sm backdrop-blur-md bg-background/80 hover:bg-background"
                  onClick={() => window.open(document.file_url, "_blank")}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-2" />
                  Open Original
                </Button>
              )}
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-hidden relative">
              {document.file_url && document.file_url.endsWith(".pdf") ? (
                <iframe
                  src={document.file_url}
                  className="w-full h-full"
                  title="Document Preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-12">
                  {document.file_url ? (
                    <div className="relative shadow-2xl rounded-lg overflow-hidden border border-border/40 w-full max-w-2xl h-[70vh]">
                      <Image
                        src={document.file_url}
                        alt="Document Preview"
                        fill
                        className="object-contain bg-background"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-muted-foreground animate-in zoom-in-95 duration-500">
                      <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
                        <FileText className="w-10 h-10 opacity-40" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-lg text-foreground">
                          No Preview Available
                        </h3>
                        <p className="text-sm opacity-70">
                          The document file could not be loaded.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Controls (Right) */}
          <div className="w-96 bg-background flex flex-col border-l border-border/40 shadow-xl z-20">
            {/* Header */}
            <div className="p-6 border-b border-border/40 bg-muted/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    className="text-lg font-bold tracking-tight line-clamp-2"
                    title={document.name}
                  >
                    {document.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Uploaded {new Date(document.created_at).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mt-1 -mr-2 text-muted-foreground hover:text-foreground"
                  onClick={() => onOpenChange(false)}
                >
                  <span className="sr-only">Close</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Properties Grid */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3 h-3" /> Type
                  </Label>
                  <div className="font-semibold text-sm bg-muted/30 px-2 py-1 rounded-md border border-border/50 inline-block">
                    {document.type}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3 h-3" /> Status
                  </Label>
                  <div>
                    <Badge
                      variant={
                        document.status === "VERIFIED" ? "default" : "secondary"
                      }
                      className={`h-6 px-2.5 rounded-md text-[10px] font-bold uppercase tracking-wide border-0 ${document.status === "VERIFIED" ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-secondary text-secondary-foreground"}`}
                    >
                      {document.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Separator with Context Info */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground font-bold tracking-widest text-[10px]">
                    Review Action
                  </span>
                </div>
              </div>

              {/* Action Area */}
              <div className="space-y-4">
                {action === "DECLINE" ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-destructive flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Reason for Rejection
                      </Label>
                      <Textarea
                        placeholder="Please provide a specific reason for rejecting this document..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="min-h-[120px] resize-none text-sm bg-destructive/5 border-destructive/20 focus-visible:ring-destructive/20 placeholder:text-destructive/40"
                        autoFocus
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setAction(null)}
                        className="font-bold h-11"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        className="font-bold h-11 shadow-lg shadow-destructive/20"
                        onClick={() => handleUpdate("DECLINED")}
                        disabled={!reason.trim() || isPending}
                      >
                        {isPending ? "Confirming..." : "Reject Document"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 text-sm shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                      onClick={() => handleUpdate("APPROVED")}
                      disabled={isPending}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {isPending ? "Verifying..." : "Approve & Verify"}
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 font-bold h-12 text-sm transition-all"
                      onClick={() => setAction("DECLINE")}
                      disabled={isPending}
                    >
                      <ShieldAlert className="w-4 h-4 mr-2" />
                      Reject Document
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer / Tip */}
            <div className="p-4 bg-muted/20 border-t border-border/40">
              <div className="flex items-start gap-3 text-[11px] text-muted-foreground leading-relaxed">
                <div className="mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary/60" />
                </div>
                <p>
                  Verifying this document creates an immutable audit log entry.
                  Please ensure all details match off-chain records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OrganisationDetailSkeleton() {
  return (
    <div className="space-y-10 animate-pulse pb-20">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-6 border-b">
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <Skeleton className="h-12 w-32 rounded-xl" />
          <Skeleton className="h-12 w-48 rounded-xl" />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <Skeleton className="h-14 w-full max-w-md rounded-2xl" />
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="h-[400px] w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
