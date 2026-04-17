"use client";

import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ORGANISATION_DOCUMENTS } from "@/components/features/platform/onboarding/OrganisationDocumentsStep";

function ReviewRow({
  label,
  value,
  last,
}: {
  label: string;
  value: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex justify-between py-2 ${!last ? "border-b border-border/40" : ""}`}
    >
      <span className="font-bold text-muted-foreground text-sm">{label}</span>
      <span className="font-bold text-sm text-right max-w-[60%] truncate">
        {value || <span className="text-muted-foreground/40">—</span>}
      </span>
    </div>
  );
}

export function ReviewStep() {
  const form = useFormContext();
  const { fields } = useFieldArray({
    control: form.control,
    name: "directors",
  });
  const { fields: domains } = useFieldArray({
    control: form.control,
    name: "config.domains",
  });
  const documents = useWatch({ control: form.control, name: "documents" });
  const brand = useWatch({ control: form.control, name: "config.brand" });

  const uploadedCount = ORGANISATION_DOCUMENTS.reduce((count, doc) => {
    const fileUrl = documents?.[doc.key]?.fileUrl;
    return count + (fileUrl ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-5">
      <Card className="border-border/40 bg-muted/5 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6 space-y-1 text-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Organisation
          </p>
          <ReviewRow label="Name" value={form.getValues("organisationName")} />
          <ReviewRow label="Email" value={form.getValues("businessEmail")} />
          <ReviewRow label="Directors" value={`${fields.length} registered`} />
          <ReviewRow
            label="Compliance docs"
            value={
              <Badge className="bg-success/10 text-success border-success/20 font-bold">
                {uploadedCount}/{ORGANISATION_DOCUMENTS.length} Uploaded
              </Badge>
            }
            last
          />
        </CardContent>
      </Card>

      {(brand?.brandName || brand?.supportEmail || domains.length > 0) && (
        <Card className="border-border/40 bg-muted/5 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 space-y-1 text-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Brand Config
            </p>
            {brand?.brandName && (
              <ReviewRow label="Brand Name" value={brand.brandName} />
            )}
            {brand?.shortBrandName && (
              <ReviewRow label="Short Name" value={brand.shortBrandName} />
            )}
            {brand?.supportEmail && (
              <ReviewRow label="Support Email" value={brand.supportEmail} />
            )}
            {brand?.primaryColor && (
              <ReviewRow
                label="Primary Colour"
                value={
                  <span className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-border/40 inline-block"
                      style={{ background: brand.primaryColor }}
                    />
                    {brand.primaryColor}
                  </span>
                }
              />
            )}
            {domains.length > 0 && (
              <ReviewRow
                label="Domains"
                value={`${domains.length} configured`}
                last
              />
            )}
          </CardContent>
        </Card>
      )}

      <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex gap-4">
        <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
        <p className="text-xs text-primary/80 leading-relaxed font-medium">
          By submitting this onboarding request, you confirm that all provided
          information is accurate and compliant with the regulatory standards.
          Verification may take 2–3 business days.
        </p>
      </div>
    </div>
  );
}
