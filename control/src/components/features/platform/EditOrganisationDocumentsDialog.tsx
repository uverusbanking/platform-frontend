"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Control } from "react-hook-form";
import { useUploadMutation } from "@/hooks/mutations/useUploadMutation";
import { useUpdateOrganisationDocuments } from "@/hooks/mutations/usePlatformMutations";
import { IOrganisationDocument } from "@/types/organisation.types";
import { organisationDocumentSchema } from "@/lib/schemas/platform/organisationDocument.schema";
import { QUERY_KEYS } from "@/lib/queryKeys";

const EditOrganisationDocumentsSchema = organisationDocumentSchema;

type EditOrganisationDocumentsValues = z.infer<
  typeof EditOrganisationDocumentsSchema
>;

interface EditOrganisationDocumentsDialogProps {
  organisationId: string;
  existingDocuments: IOrganisationDocument[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditOrganisationDocumentsDialog({
  organisationId,
  existingDocuments,
  open,
  onOpenChange,
}: EditOrganisationDocumentsDialogProps) {
  const { mutateAsync: updateDocuments } = useUpdateOrganisationDocuments();

  const form = useForm<EditOrganisationDocumentsValues>({
    resolver: zodResolver(EditOrganisationDocumentsSchema),
    defaultValues: {
      documents: {
        cacCertificate: {
          id: "",
          fileUrl: "",
          documentType: "cacCertificate",
          fileName: "",
        },
        memorandum: {
          id: "",
          fileUrl: "",
          documentType: "memorandum",
          fileName: "",
        },
        boardResolution: {
          id: "",
          fileUrl: "",
          documentType: "boardResolution",
          fileName: "",
        },
        proofOfAddress: {
          id: "",
          fileUrl: "",
          documentType: "proofOfAddress",
          fileName: "",
        },
        uboDeclaration: {
          id: "",
          fileUrl: "",
          documentType: "uboDeclaration",
          fileName: "",
        },
      },
    },
  });

  useEffect(() => {
    if (open && existingDocuments.length > 0) {
      const getDoc = (type: string) =>
        existingDocuments.find((d) => d.type === type);

      const cac = getDoc("cacCertificate");
      const mem = getDoc("memorandum");
      const br = getDoc("boardResolution");
      const poa = getDoc("proofOfAddress");
      const ubo = getDoc("uboDeclaration");

      form.reset({
        documents: {
          cacCertificate: {
            id: cac?.id || "",
            fileUrl: cac?.file_url || "",
            documentType: "cacCertificate",
            fileName: cac?.name || "",
          },
          memorandum: {
            id: mem?.id || "",
            fileUrl: mem?.file_url || "",
            documentType: "memorandum",
            fileName: mem?.name || "",
          },
          boardResolution: {
            id: br?.id || "",
            fileUrl: br?.file_url || "",
            documentType: "boardResolution",
            fileName: br?.name || "",
          },
          proofOfAddress: {
            id: poa?.id || "",
            fileUrl: poa?.file_url || "",
            documentType: "proofOfAddress",
            fileName: poa?.name || "",
          },
          uboDeclaration: {
            id: ubo?.id || "",
            fileUrl: ubo?.file_url || "",
            documentType: "uboDeclaration",
            fileName: ubo?.name || "",
          },
        },
      });
    }
  }, [open, existingDocuments, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-none shadow-2xl p-0 bg-white rounded-2xl">
        <DialogHeader className="p-8 pb-4 bg-muted/5 border-b border-border/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Update Compliance Documents
              </DialogTitle>
              <DialogDescription className="font-medium">
                Upload and update compliance documents individually. Each
                document will be submitted immediately upon upload.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <div className="p-8 space-y-8">
            <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl flex gap-3 text-blue-700 dark:text-blue-400">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold">Individual Upload Mode</p>
                <p className="font-medium opacity-80">
                  Each document is uploaded and submitted immediately. Updated
                  documents will have their status reset to PENDING for
                  compliance review.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <DocumentRow
                control={form.control}
                name="cacCertificate"
                label="CAC Certificate"
                desc="Certificate of Incorporation"
                organisationId={organisationId}
                updateDocuments={updateDocuments}
              />
              <DocumentRow
                control={form.control}
                name="memorandum"
                label="Memorandum of Association"
                desc="MEMART & Shareholder details"
                organisationId={organisationId}
                updateDocuments={updateDocuments}
              />
              <DocumentRow
                control={form.control}
                name="boardResolution"
                label="Board Resolution"
                desc="Signed resolution for account opening"
                organisationId={organisationId}
                updateDocuments={updateDocuments}
              />
              <DocumentRow
                control={form.control}
                name="proofOfAddress"
                label="Proof of Business Address"
                desc="Utility bill or lease agreement"
                organisationId={organisationId}
                updateDocuments={updateDocuments}
              />
              <DocumentRow
                control={form.control}
                name="uboDeclaration"
                label="UBO Declaration"
                desc="Ultimate Beneficial Owners form"
                organisationId={organisationId}
                updateDocuments={updateDocuments}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-border/40">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="px-6 h-12 rounded-xl font-bold"
              >
                Close
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface DocumentRowProps {
  control: Control<EditOrganisationDocumentsValues>;
  name:
    | "cacCertificate"
    | "memorandum"
    | "boardResolution"
    | "proofOfAddress"
    | "uboDeclaration";
  label: string;
  desc: string;
  organisationId: string;
  updateDocuments: (payload: {
    id: string;
    documents: Partial<EditOrganisationDocumentsValues["documents"]>;
  }) => Promise<unknown>;
}

function DocumentRow({
  control,
  name,
  label,
  desc,
  organisationId,
  updateDocuments,
}: DocumentRowProps) {
  const uploadMutation = useUploadMutation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <FormField
      control={control}
      name={`documents.${name}`}
      render={({ field }) => {
        const isUploaded = !!field.value?.fileUrl;
        const fileName = field.value?.fileName;

        const handleFileUpload = async (
          e: React.ChangeEvent<HTMLInputElement>,
        ) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const loadingToast = toast.loading(`Uploading ${label}...`);
          setIsSubmitting(true);

          try {
            // Step 1: Upload the file
            const response = await uploadMutation.mutateAsync({
              file,
              userType: "PLATFORM",
            });
            const uploadedDoc = {
              id: response.data.id,
              fileUrl: response.data.file_url,
              documentType: name,
              fileName: file.name,
            };

            // Update local form state immediately so the row shows as uploaded
            field.onChange(uploadedDoc);

            // Submit to backend and then force-refetch so the modal reflects
            // the new state the next time it is opened.
            toast.loading(`Submitting ${label}...`, { id: loadingToast });
            await updateDocuments({
              id: organisationId,
              documents: { [name]: uploadedDoc },
            });

            // Await the refetch so existingDocuments is fresh before the user
            // can reopen the modal — prevents the stale-state flash on reopen.
            await queryClient.refetchQueries({
              queryKey: [QUERY_KEYS.ORGANISATION.DOCUMENTS],
            });

            toast.success(`${label} uploaded and submitted successfully`, {
              id: loadingToast,
            });
          } catch {
            toast.error(`Failed to upload ${label}`, { id: loadingToast });
          } finally {
            setIsSubmitting(false);
          }
        };

        return (
          <FormItem>
            <Card
              className={`border transition-all duration-300 ${isUploaded ? "bg-success/5 border-success/20" : "bg-background hover:border-primary/50"}`}
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUploaded ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}
                  >
                    {isUploaded ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <UploadCloud className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">{label}</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {desc}
                    </p>
                    {isUploaded && fileName && (
                      <p className="text-[10px] text-success font-bold mt-1 max-w-[200px] truncate">
                        {fileName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isUploaded && (
                    <Badge
                      variant="outline"
                      className="bg-success/10 border-success/20 text-success font-bold text-[10px] uppercase h-6"
                    >
                      Ready
                    </Badge>
                  )}
                  <Button
                    type="button"
                    variant={isUploaded ? "outline" : "default"}
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadMutation.isPending || isSubmitting}
                    className={`h-9 font-bold rounded-lg ${!isUploaded ? "bg-primary shadow-md shadow-primary/20" : "border-success/30 text-success hover:bg-success/10"}`}
                  >
                    {uploadMutation.isPending || isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        {uploadMutation.isPending
                          ? "Uploading..."
                          : "Submitting..."}
                      </>
                    ) : isUploaded ? (
                      "Replace"
                    ) : (
                      "Upload"
                    )}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    disabled={uploadMutation.isPending || isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>
            <FormMessage className="text-[10px]" />
          </FormItem>
        );
      }}
    />
  );
}
