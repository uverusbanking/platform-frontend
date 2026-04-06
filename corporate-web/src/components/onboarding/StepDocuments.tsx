import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Upload, FileText, Image, X, Check } from "lucide-react";
import type { KYCDocument, FeedbackItem } from "@/types/onboarding";
import { DOCUMENT_TYPE_LABELS } from "@/types/onboarding";

interface Props {
  documents: KYCDocument[];
  feedback: FeedbackItem[];
  onSave: (docs: KYCDocument[]) => void;
  onBack: () => void;
}

const statusBadge: Record<string, { label: string; className: string }> = {
  not_uploaded: { label: "Not Uploaded", className: "bg-muted text-muted-foreground" },
  uploaded: { label: "Uploaded", className: "bg-primary/10 text-primary border-primary/20" },
  verified: { label: "Verified", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function StepDocuments({ documents, feedback, onSave, onBack }: Props) {
  const [docs, setDocs] = useState<KYCDocument[]>(documents);

  const simulateUpload = (docType: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.document_type === docType
          ? { ...d, status: "uploaded" as const, file_name: `${docType}.pdf`, file_size: 1024000, mime_type: "application/pdf", uploaded_at: new Date().toISOString() }
          : d
      )
    );
  };

  const removeFile = (docType: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.document_type === docType
          ? { ...d, status: "not_uploaded" as const, file_name: "", file_size: 0, uploaded_at: null }
          : d
      )
    );
  };

  const requiredMissing = docs.filter((d) => d.required && d.status === "not_uploaded");

  const handleContinue = () => {
    onSave(docs);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC Document Upload</CardTitle>
        <CardDescription>Step 2 of 5 — Upload your company's required documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {docs.map((doc) => {
            const fb = feedback.find((f) => f.target_id === doc.document_type);
            const badge = statusBadge[doc.status];
            return (
              <div
                key={doc.document_type}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {doc.status === "uploaded" || doc.status === "verified" ? (
                    <FileText className="h-8 w-8 text-primary shrink-0" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">
                        {DOCUMENT_TYPE_LABELS[doc.document_type]}
                        {doc.required && <span className="text-destructive ml-1">*</span>}
                      </p>
                      <Badge variant="outline" className={badge.className}>{badge.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {doc.allowed_types.map((t) => t.toUpperCase()).join(", ")} — Max {doc.max_size_mb} MB
                    </p>
                    {doc.file_name && (
                      <p className="text-xs text-foreground mt-1">{doc.file_name}</p>
                    )}
                    {fb && (
                      <div className="flex items-start gap-1.5 mt-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                        <span className="text-xs text-destructive">{fb.comment}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {doc.status === "not_uploaded" || doc.status === "rejected" ? (
                    <Button size="sm" variant="outline" onClick={() => simulateUpload(doc.document_type)} className="gap-1.5">
                      <Upload className="h-3.5 w-3.5" /> Upload
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => simulateUpload(doc.document_type)} className="gap-1.5">
                        Replace
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeFile(doc.document_type)} className="text-destructive">
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {requiredMissing.length > 0 && (
          <p className="text-xs text-warning mt-4">
            {requiredMissing.length} required document{requiredMissing.length > 1 ? "s" : ""} still missing — you can continue and upload later.
          </p>
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={handleContinue}>Save & Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
}
