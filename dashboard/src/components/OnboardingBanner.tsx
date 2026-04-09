"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/lib/routes";
import { useUserStore } from "@/state/userStore";
import { useGetOrganisationDocuments } from "@/hooks/queries/useOrganisationQueries";

const DOCUMENT_TYPES = [
  // "CAC_CERTIFICATE",
  "cacCertificate",
  // "MEMORANDUM",
  "memorandum",
  // "BOARD_RESOLUTION",
  "boardResolution",
  // "PROOF_OF_ADDRESS",
  "proofOfAddress",
  // "UBO_DECLARATION"
  "uboDeclaration",
];

export function OnboardingBanner() {
  const { userData } = useUserStore();
  const { data: documentsData, isLoading } = useGetOrganisationDocuments();

  if (isLoading) return null;

  // Extract uploaded types from documentsData
  const uploadedTypes = Array.isArray(documentsData?.data)
    ? documentsData.data.map((doc) => doc.type)
    : [];

  // Only show banner if at least one DOCUMENT_TYPES is missing
  const missing = DOCUMENT_TYPES.some((type) => !uploadedTypes.includes(type));
  if (!missing) return null;

  return (
    <div className="bg-warning/25 border-b border-warning/30 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-warning/30 p-2.5 rounded-full shadow-sm">
            <AlertCircle className="h-5 w-5 text-warning-foreground font-bold" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-warning-foreground">
              Complete your account setup
            </h4>
            <p className="text-xs text-warning-foreground/90 font-semibold">
              Your account is currently{" "}
              {userData?.status?.toLowerCase() || "pending"}. Complete
              verification to unlock all features.
            </p>
          </div>
        </div>
        <Link href={APP_ROUTES.ACCOUNT.SETTINGS.DOCUMENTS}>
          <Button
            size="sm"
            className="bg-warning text-warning-foreground hover:bg-warning/90 border-none shadow-sm font-bold h-9"
          >
            Complete Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
