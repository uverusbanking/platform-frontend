"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  Clock,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useGetOrganisationDocuments,
  useUpdateOrganisationDocuments,
  IOrganisationDocument,
  OrganisationDocumentType,
} from "@/hooks/endpoints/useOrganisationHook";
import { getApiErrorMessage } from "@/utils/apiClient";
import { uploadFile } from "@/services/fileService";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface DocumentTypeInfo {
  key: OrganisationDocumentType;
  title: string;
  description: string;
  required: boolean;
}

const DOCUMENT_TYPES: DocumentTypeInfo[] = [
  {
    key: "CAC_CERTIFICATE",
    title: "CAC Certificate of Incorporation",
    description: "Certificate of Incorporation and Form CAC 1.1 or equivalent",
    required: true,
  },
  {
    key: "MEMORANDUM",
    title: "Memorandum & Articles of Association",
    description: "Company's constitutional documents",
    required: true,
  },
  {
    key: "BOARD_RESOLUTION",
    title: "Board Resolution",
    description:
      "Resolution authorizing account opening and authorized signatories",
    required: true,
  },
  {
    key: "PROOF_OF_ADDRESS",
    title: "Proof of Company Address",
    description: "Utility bill or tenancy agreement (less than 3 months old)",
    required: true,
  },
  {
    key: "UBO_DECLARATION",
    title: "UBO Declaration",
    description: "Ultimate Beneficial Owners declaration form",
    required: true,
  },
];

// Helper to convert SCREAMING_SNAKE_CASE to camelCase
const toApiFormat = (type: string): string => {
  return type
    .toLowerCase()
    .split("_")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("");
};

// Helper to find document by type from array
const findDocumentByType = (
  documents: IOrganisationDocument[] | undefined,
  type: OrganisationDocumentType,
): IOrganisationDocument | undefined => {
  const apiType = toApiFormat(type);
  return documents?.find(
    (doc) => doc.type?.toLowerCase() === apiType.toLowerCase(),
  );
};

// Get status badge color and icon
const getStatusBadge = (status?: string) => {
  switch (status) {
    case "APPROVED":
      return {
        variant: "secondary" as const,
        className:
          "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 text-xs",
        icon: CheckCircle2,
        label: "Approved",
      };
    case "REJECTED":
      return {
        variant: "secondary" as const,
        className:
          "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 text-xs",
        icon: XCircle,
        label: "Rejected",
      };
    case "PENDING":
      return {
        variant: "secondary" as const,
        className:
          "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800 text-xs",
        icon: Clock,
        label: "Pending Review",
      };
    default:
      return {
        variant: "secondary" as const,
        className:
          "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 text-xs",
        icon: AlertCircle,
        label: "Not Uploaded",
      };
  }
};

export default function OrganisationDocumentsPage() {
  const {
    data: documentsData,
    isLoading,
    refetch,
  } = useGetOrganisationDocuments();
  const { mutate: updateDocuments } = useUpdateOrganisationDocuments();

  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const documents = documentsData?.data || [];

  // Calculate progress - count documents that have been uploaded
  const uploadedCount = DOCUMENT_TYPES.filter((docType) =>
    findDocumentByType(documents, docType.key),
  ).length;
  const totalRequired = DOCUMENT_TYPES.filter((d) => d.required).length;
  const progressPercentage = (uploadedCount / totalRequired) * 100;

  const handleFileUpload = async (
    key: OrganisationDocumentType,
    file: File,
  ) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadingKey(key);

    try {
      // Step 1: Upload file
      const uploadResponse = await uploadFile({
        file,
        documentType: key,
        userType: "ORGANISATION",
      });

      // Step 2: Update organisation documents with the new file
      const updatePayload = {
        documents: [
          {
            type: key,
            file_id: uploadResponse.data.id,
            file_url: uploadResponse.data.file_url,
          },
        ],
      };

      updateDocuments(updatePayload, {
        onSuccess: () => {
          toast.success(
            `${DOCUMENT_TYPES.find((d) => d.key === key)?.title} uploaded successfully`,
          );
          refetch();
        },
        onError: (error) => {
          const message = getApiErrorMessage(error, "Failed to save document");
          toast.error(message);
        },
      });
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to upload document");
      toast.error(message);
    } finally {
      setUploadingKey(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-[80px] w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Organisation Documents
        </h1>
        <p className="text-muted-foreground text-lg">
          Upload and manage your compliance documents. All documents are
          required for full verification.
        </p>
      </div>

      {/* Progress Card */}
      <Card className="border-none shadow-premium bg-linear-to-r from-primary/5 via-transparent to-primary/5 backdrop-blur-md overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "p-3 rounded-xl",
                  uploadedCount === totalRequired
                    ? "bg-green-500/10 text-green-600"
                    : "bg-orange-500/10 text-orange-600",
                )}
              >
                {uploadedCount === totalRequired ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <AlertCircle className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {uploadedCount === totalRequired
                    ? "All Documents Uploaded!"
                    : `${totalRequired - uploadedCount} Documents Missing`}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {uploadedCount} of {totalRequired} required documents uploaded
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-1/3">
              <Progress value={progressPercentage} className="h-2" />
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {DOCUMENT_TYPES.map((docType) => {
          const doc = findDocumentByType(documents, docType.key);
          const isUploading = uploadingKey === docType.key;
          const isUploaded = !!doc?.id;
          const statusBadge = getStatusBadge(doc?.status);
          const StatusIcon = statusBadge.icon;

          return (
            <Card
              key={docType.key}
              className={cn(
                "border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden transition-all duration-300 hover:shadow-lg group",
                isUploaded &&
                  doc?.status === "APPROVED" &&
                  "ring-1 ring-green-500/20",
                isUploaded &&
                  doc?.status === "REJECTED" &&
                  "ring-1 ring-red-500/20",
                isUploaded &&
                  doc?.status === "PENDING" &&
                  "ring-1 ring-yellow-500/20",
              )}
            >
              <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-start justify-between w-full gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-colors shrink-0",
                        isUploaded
                          ? doc?.status === "APPROVED"
                            ? "bg-green-500/10 text-green-600"
                            : doc?.status === "REJECTED"
                              ? "bg-red-500/10 text-red-600"
                              : "bg-yellow-500/10 text-yellow-600"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-medium leading-tight pr-2">
                        {docType.title}
                        {docType.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1.5 text-muted-foreground/80">
                        {docType.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={statusBadge.variant}
                    className={cn(statusBadge.className, "shrink-0 h-fit")}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    <span className="text-xs whitespace-nowrap">
                      {statusBadge.label}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Uploading...
                    </p>
                  </div>
                ) : isUploaded ? (
                  <div className="space-y-4">
                    {/* Document Preview */}
                    <div className="relative w-full h-32 bg-muted/30 rounded-lg overflow-hidden">
                      {doc.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <Image
                          src={doc.file_url}
                          alt={docType.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FileText className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    {/* Rejection reason if any */}
                    {doc.status === "REJECTED" && doc.rejection_reason && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-xs text-red-700 dark:text-red-400">
                          <strong>Rejection Reason:</strong>{" "}
                          {doc.rejection_reason}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(doc.file_url, "_blank")}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        View
                      </Button>
                      <label className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <span>
                            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                            Replace
                          </span>
                        </Button>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(docType.key, file);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                          <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Click to upload</p>
                          <p className="text-xs text-muted-foreground">
                            PDF, JPG, PNG (max. 10MB)
                          </p>
                        </div>
                      </div>
                    </div>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(docType.key, file);
                      }}
                    />
                  </label>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Text */}
      <p className="text-sm text-muted-foreground text-center">
        <span className="text-destructive">*</span> Required documents. All
        documents must be uploaded for complete verification.
      </p>
    </div>
  );
}
