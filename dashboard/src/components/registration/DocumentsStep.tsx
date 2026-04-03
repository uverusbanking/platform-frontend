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
import { CompanyData } from "@/app/(auth)/register/page";
import { useEffect, useState } from "react";
import { defaultApiResponse } from "@/utils/resources";
import DisplayRespondsMessage from "../DisplayResponse";
import { Button } from "../ui/button";
import { apiErrorResponse, getApiErrorMessage } from "@/utils/apiClient";
import { documentInterface } from "@/types/companyRegistration";
import { uploadFile } from "@/services/fileService";
import Image from "next/image";

interface DocumentsStepProps {
  data: CompanyData;
  onChange: (data: CompanyData) => void;

  handlePrevious: () => void;
  handleNext: () => void;
  handleSubmitBtn: () => void;
  currentStep: number;
  steps: unknown[];
}

const documentTypes: documentInterface[] = [
  {
    key: "CAC_CERTIFICATE",
    title: "CAC Certificate of Incorporation",
    description: "Certificate of Incorporation and Form CAC 1.1 or equivalent",
    required: true,

    id: "",
    fileUrl: "",
    documentType: "CAC_CERTIFICATE",
    isLoading: false,
  },
  {
    key: "MEMORANDUM",
    title: "Memorandum & Articles of Association",
    description: "Company's constitutional documents",
    required: true,

    id: "",
    fileUrl: "",
    documentType: "MEMORANDUM",
    isLoading: false,
  },
  {
    key: "BOARD_RESOLUTION",
    title: "Board Resolution",
    description:
      "Resolution authorizing account opening and authorized signatories",
    required: true,

    id: "",
    fileUrl: "",
    documentType: "BOARD_RESOLUTION",
    isLoading: false,
  },
  {
    key: "PROOF_OF_ADDRESS",
    title: "Proof of Company Address",
    description: "Utility bill or tenancy agreement (less than 3 months old)",
    required: true,

    id: "",
    fileUrl: "",
    documentType: "PROOF_OF_ADDRESS",
    isLoading: false,
  },
  {
    key: "UBO_DECLARATION",
    title: "UBO Declaration",
    description: "Ultimate Beneficial Owners declaration form",
    required: true,

    id: "",
    fileUrl: "",
    documentType: "UBO_DECLARATION",
    isLoading: false,
  },
];

const mergeDocumentTypesWithCompany = (
  documentTypes: documentInterface[],
  company: CompanyData,
): documentInterface[] => {
  return documentTypes.map((doc) => {
    const matchedDoc =
      company.documents[doc.key as keyof typeof company.documents];

    if (!matchedDoc) return doc; // no document uploaded for this key

    return {
      ...doc,
      id: matchedDoc.id,
      fileUrl: matchedDoc.fileUrl,
    };
  });
};

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
    const docs = mergeDocumentTypesWithCompany(documentTypes, data);
    // eslint-disable-next-line
    setDocuments(docs);
  }, [data]);

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

    try {
      setDocuments((prev) =>
        upsertDocument(prev, { ...document, isLoading: true }),
      );

      const response = await uploadFile({
        file,
        documentType: key,
        userType: "ORGANISATION",
      });
      console.log(response);

      const newDocument: documentInterface = {
        id: response.data.id,
        fileUrl: response.data.file_url,
        documentType: key,

        key: key,
        title: document.title,
        description: document.description,
        required: document.required,
        isLoading: false,
      };
      setDocuments((prev) => upsertDocument(prev, newDocument));
    } catch (error) {
      const err = apiErrorResponse(error, "Ooops, something went wrong");
      setDocuments((prev) =>
        upsertDocument(prev, { ...document, isLoading: false }),
      );

      setApiResponse({
        display: true,
        status: false,
        message: getApiErrorMessage(error, "Ooops, something went wrong"),
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
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                <Label htmlFor={doc.key} className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors">
                    {doc.isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : doc.fileUrl ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div
                          style={{
                            position: "relative",
                            width: 100,
                            height: 100,
                          }}
                        >
                          <Image
                            src={doc.fileUrl}
                            alt={doc.title}
                            fill
                            className="object-cover" // or object-contain
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            {documents.find((d) => d.key === doc.key)?.fileUrl
                              ? documents.find((d) => d.key === doc.key)
                                  ?.fileUrl
                              : "Click to upload or drag and drop"}
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
