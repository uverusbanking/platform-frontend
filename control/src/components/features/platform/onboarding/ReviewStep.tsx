"use client";

import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ORGANISATION_DOCUMENTS } from "@/components/features/platform/onboarding/OrganisationDocumentsStep";

export function ReviewStep() {
  const form = useFormContext();
  const { fields } = useFieldArray({
    control: form.control,
    name: "directors",
  });
  const documents = useWatch({ control: form.control, name: "documents" });
  const uploadedCount = ORGANISATION_DOCUMENTS.reduce((count, doc) => {
    const fileUrl = documents?.[doc.key]?.fileUrl;
    return count + (fileUrl ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-muted/5 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6 space-y-4 text-sm">
          <div className="flex justify-between pb-2 border-b border-border/40">
            <span className="font-bold text-muted-foreground">
              Organisation
            </span>
            <span className="font-bold">
              {form.getValues("organisationName")}
            </span>
          </div>
          <div className="flex justify-between pb-2 border-b border-border/40">
            <span className="font-bold text-muted-foreground">Email</span>
            <span className="font-bold">{form.getValues("businessEmail")}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-border/40">
            <span className="font-bold text-muted-foreground">Directors</span>
            <span className="font-bold">{fields.length} Registered</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-border/40">
            <span className="font-bold text-muted-foreground">
              Compliance docs
            </span>
            <Badge className="bg-success/10 text-success border-success/20 font-bold">
              {uploadedCount}/{ORGANISATION_DOCUMENTS.length} Uploaded
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex gap-4">
        <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
        <p className="text-xs text-primary/80 leading-relaxed font-medium">
          By submitting this onboarding request, you confirm that all provided
          information is accurate and compliant with the regulatory standards.
          Verification may take 2-3 business days.
        </p>
      </div>
    </div>
  );
}
