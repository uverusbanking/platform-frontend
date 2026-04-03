import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, Loader2, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrganisationData } from "@/app/(auth)/register/page";
import { useEffect, useState } from "react";
import { defaultApiResponse } from "@/lib/resources";
import DisplayRespondsMessage from "../../DisplayResponse";
import { Button } from "../../ui/button";
import apiClient, { apiErrorResponse } from "@/lib/axios";
import { documentInterface as IDocument } from "@/types/organisationRegistration";
import Image from "next/image";

// Extend the interface locally for UI state
interface documentInterface extends IDocument {
  previewUrl?: string;
  fileName?: string;
  fileType?: string;
}

interface DocumentsStepProps {
  data: OrganisationData;
  onChange: (data: OrganisationData) => void;

  handlePrevious: () => void;
  handleNext: () => void;
  handleSubmitBtn: () => void;
  currentStep: number;
  steps: any[];
}

const documentTypes: documentInterface[] = [
  {
    key: "cacCertificate",
    title: "CAC Certificate of Incorporation",
    description: "Certificate of Incorporation and Form CAC 1.1 or equivalent",
    required: true,

    id: "",
    fileUrl: "",
    documentType: "cacCertificate",
    isLoading: false,
  },
  {
    key: "memorandum",
    title: "Memorandum & Articles of Association",
    description: "Organisation's constitutional documents",
    required: true,

    id: "",
    fileUrl: "",
    documentType: "memorandum",
    isLoading: false,
  },
  {
    key: "boardResolution",
    title: "Board Resolution",
    description:
      "Resolution authorizing account opening and authorized signatories",
    required: true,

    id: "",
    fileUrl: "",
    documentType: "boardResolution",
    isLoading: false,
  },
  {
    key: "proofOfAddress",
    title: "Proof of Organisation Address",
    description: "Utility bill or tenancy agreement (less than 3 months old)",
    required: true,

    id: "",
    fileUrl: "",
    documentType: "proofOfAddress",
    isLoading: false,
  },
  {
    key: "uboDeclaration",
    title: "UBO Declaration",
    description: "Ultimate Beneficial Owners declaration form",
    required: true,

    id: "",
    fileUrl: "",
    documentType: "uboDeclaration",
    isLoading: false,
  },
];

export function DocumentsStep({
  data,
  onChange,

  handlePrevious,
  handleNext,
  handleSubmitBtn,
  currentStep,
  steps,
}: DocumentsStepProps) {
  const [documents, setDocuments] =
    useState<documentInterface[]>(documentTypes);
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);

  useEffect(() => {
    const docs = mergeDocumentTypesWithOrganisation(documentTypes, data);
    setDocuments(docs);
  }, [data]);

  const mergeDocumentTypesWithOrganisation = (
    documentTypes: documentInterface[],
    organisation: OrganisationData,
  ): documentInterface[] => {
    return documentTypes.map((doc) => {
      const matchedDoc =
        organisation.documents[doc.key as keyof typeof organisation.documents];

      if (!matchedDoc) return doc; // no document uploaded for this key

      return {
        ...doc,
        id: matchedDoc.id,
        fileUrl: matchedDoc.fileUrl,
      };
    });
  };

  const handleNextBtn = () => {
    let error = "";
    for (const doc of documents) {
      if (doc.required) {
        const missingId = !doc.id || doc.id.trim() === "";
        const missingFile = !doc.fileUrl || doc.fileUrl.trim() === "";

        if (missingId || missingFile)
          error = `Document "${doc.title}" is required`;
      }
    }

    if (error) {
      setApiResponse({
        display: true,
        status: false,
        message: error,
      });
      return;
    }

    const documentsObj: { [key: string]: documentInterface } = {};
    for (const doc of documents) {
      documentsObj[doc.key] = doc;
    }

    onChange({
      ...data,
      documents: documentsObj,
    });

    handleNext();
  };

  const handleFileUpload = async (key: string, file: File) => {
    setApiResponse(defaultApiResponse);

    const document = documents.find((d) => d.key === key);
    if (!document) {
      setApiResponse({
        display: true,
        status: false,
        message: "Document not found",
      });
      return;
    }

    // Create local preview immediately
    const objectUrl = URL.createObjectURL(file);

    // Optimistic update
    setDocuments((prev) =>
      upsertDocument(prev, {
        ...document,
        isLoading: true,
        previewUrl: objectUrl,
        fileName: file.name,
        fileType: file.type,
      }),
    );

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", key);
      formData.append("userType", "ORGANISATION");

      const response = (
        await apiClient.post("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "*/*",
          },
        })
      ).data;

      const newDocument: documentInterface = {
        id: response.data.id,
        fileUrl: response.data.file_url, // Use server URL effectively
        documentType: key,

        key: key,
        title: document.title,
        description: document.description,
        required: document.required,
        isLoading: false,
        // Preserve metadata
        fileName: file.name,
        fileType: file.type,
      };

      // We can choose to keep the local preview for speed or switch to server URL
      // Switching to server URL ensures we verify what was uploaded
      setDocuments((prev) => upsertDocument(prev, newDocument));
    } catch (error) {
      const err = apiErrorResponse(error, "Ooops, something went wrong");
      // Revert loading state but keep preview if we want to allow retry?
      // Better to show error state.
      setDocuments((prev) =>
        upsertDocument(prev, { ...document, isLoading: false }),
      );

      console.log(err);
      setApiResponse({
        display: true,
        status: false,
        message: err.error,
        errorMsg: err.errorMsgs,
      });
    }
  };

  /**
   * Adds or updates a document in state, ensuring only one entry per documentType.
   */
  const upsertDocument = (
    documents: documentInterface[],
    newDoc: documentInterface,
  ): documentInterface[] => {
    const exists = documents.some(
      (doc) => doc.documentType === newDoc.documentType,
    );

    if (exists) {
      // Replace existing document with same documentType
      return documents.map((doc) =>
        doc.documentType === newDoc.documentType ? newDoc : doc,
      );
    }

    // Add new document
    return [...documents, newDoc];
  };

  const isValidDocuments = (documentTypes: documentInterface[]): boolean => {
    return documentTypes.every((doc) => {
      if (!doc.required) return true; // not required → always valid

      // Required → id and fileUrl must be non-empty strings
      return Boolean(doc.id && doc.fileUrl);
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Upload all required documents in PDF, JPG, or PNG format. Maximum file
          size: 10MB per document.
        </p>
      </div>

      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card key={doc.key}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">
                    {doc.title}
                    {doc.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <FileText className="h-5 w-5 text-muted-foreground mb-1" />
                  {doc.fileUrl && !doc.isLoading && (
                    <span className="text-xs text-green-600 font-medium flex items-center">
                      Dataset Saved
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                <Label htmlFor={doc.key} className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors hover:bg-muted/5">
                    {doc.isLoading ? (
                      <div className="flex flex-col items-center justify-center space-y-3 h-[120px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-xs font-medium text-muted-foreground">
                          Uploading...
                        </p>
                      </div>
                    ) : doc.fileUrl || (doc as any).previewUrl ? (
                      <div className="flex flex-col items-center justify-center space-y-3 h-[120px] relative w-full group">
                        {/* Success Badge */}
                        {!doc.isLoading && doc.fileUrl && (
                          <div className="absolute top-0 right-0 m-2 bg-green-500 text-white rounded-full p-1 z-10 shadow-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-check"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </div>
                        )}

                        {doc.fileUrl?.endsWith(".pdf") ||
                        (doc as any).fileType === "application/pdf" ? (
                          <div className="flex flex-col items-center justify-center text-center p-4 w-full h-full bg-red-50/50">
                            <FileText className="h-10 w-10 text-red-500 mb-2" />
                            <p className="text-xs font-medium text-foreground max-w-[90%] truncate px-2">
                              {(doc as any).fileName || "PDF Document"}
                            </p>
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                              <p className="text-xs font-medium bg-background/80 px-2 py-1 rounded shadow-sm">
                                Click to replace
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="relative w-full h-[120px] rounded-md overflow-hidden bg-muted/20">
                            <Image
                              src={(doc as any).previewUrl || doc.fileUrl}
                              alt={doc.title}
                              fill
                              className="object-contain"
                            />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-xs font-medium text-white bg-black/60 px-2 py-1 rounded">
                                Click to replace
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2 h-[120px]">
                        <Upload className="h-8 w-8 text-muted-foreground/50" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground/80">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, JPG, PNG (max. 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Label>

                <Input
                  id={doc.key}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size <= 10 * 1024 * 1024) {
                      // handleFileChange(doc.key, file);
                      handleFileUpload(doc.key, file);
                    } else if (file) {
                      setApiResponse({
                        display: true,
                        status: false,
                        message: "File size must be less than 10MB",
                      });
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">* Required documents</p>

      <DisplayRespondsMessage response={apiResponse} />

      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button
            type="button"
            disabled={!isValidDocuments(documents)}
            onClick={handleNextBtn}
          >
            Next
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmitBtn}>
            Submit Application
          </Button>
        )}
      </div>
    </div>
  );
}
