"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useUserStore } from "@/state/userStore";
import { APP_ROUTES } from "@/lib/routes";
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

export function KYCNudgeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { userData, isLoggedIn } = useUserStore();
  const navigate = useNavigate();

  const { data: documentsData, isLoading } = useGetOrganisationDocuments();

  useEffect(() => {
    // Check if user is logged in and data is loaded
    if (isLoggedIn && userData) {
      // Logic: Show if status is not ACTIVE or kyc_verified is false
      // You can refine this logic based on your specific requirements
      const shouldShow = userData.status !== "ACTIVE" || !userData.kyc_verified;

      // Also check if we've already shown it this session to be "soft" and not annoying
      const hasSeenModal = sessionStorage.getItem("kyc_nudge_seen");

      if (shouldShow && !hasSeenModal) {
        // Small delay for better UX
        const timer = setTimeout(() => setIsOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoggedIn, userData]);

  const handleCompleteNow = () => {
    setIsOpen(false);
    sessionStorage.setItem("kyc_nudge_seen", "true");
    navigate(APP_ROUTES.ACCOUNT.SETTINGS.ROOT);
  };

  const handleRemindLater = () => {
    setIsOpen(false);
    sessionStorage.setItem("kyc_nudge_seen", "true");
  };

  if (isLoading) return null;

  // Extract uploaded types from documentsData
  const uploadedTypes = Array.isArray(documentsData?.data)
    ? documentsData.data.map((doc) => doc.type)
    : [];

  // Only show banner if at least one DOCUMENT_TYPES is missing
  const missing = DOCUMENT_TYPES.some((type) => !uploadedTypes.includes(type));
  if (!missing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-b from-primary/10 via-background to-background p-6 flex flex-col items-center text-center gap-4">
          <div className="bg-primary/15 p-4 rounded-full shadow-inner ring-4 ring-background">
            <ShieldCheck
              className="h-10 w-10 text-primary drop-shadow-sm"
              strokeWidth={1.5}
            />
          </div>

          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              Verify Identity
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground px-2 text-sm leading-relaxed">
              Complete the verification process to ensure the security of your
              account and unlock all features.
            </DialogDescription>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-6">
          <div className="space-y-3">
            <Link
              to={APP_ROUTES.ACCOUNT.SETTINGS.DOCUMENTS}
              className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 border border-border/50 transition-colors hover:bg-secondary/50"
            >
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20 shadow-sm">
                <span className="text-primary font-bold text-xs font-mono">
                  1
                </span>
              </div>
              <div className="text-left space-y-0.5">
                <p className="font-semibold text-sm text-foreground">
                  Document Upload
                </p>
                <p className="text-xs text-muted-foreground">
                  Valid government ID photo
                </p>
              </div>
            </Link>

            {/* <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 border border-border/50 transition-colors hover:bg-secondary/50">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20 shadow-sm">
                    <span className="text-primary font-bold text-xs font-mono">2</span>
                </div>
                <div className="text-left space-y-0.5">
                    <p className="font-semibold text-sm text-foreground">Phone Verification</p>
                    <p className="text-xs text-muted-foreground">Secure OTP confirmation</p>
                </div>
            </div> */}
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-3 w-full !space-x-0">
            <Button
              onClick={handleCompleteNow}
              className="w-full gap-2 h-11 text-base font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
              size="lg"
            >
              Complete Verification
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={handleRemindLater}
              className="w-full h-10 text-muted-foreground hover:text-foreground"
            >
              Remind me later
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
