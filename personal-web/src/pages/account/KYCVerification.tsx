import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlatformKYC } from "@/hooks/usePlatformKYC";
import { useKYC } from "@/hooks/useKYC";
import { AppLayout } from "@/components/AppLayout";
import { KYCTier2Form } from "@/components/kyc/KYCTier2Form";
import { KYCTier3Form } from "@/components/kyc/KYCTier3Form";
import { KYCSuccess } from "@/components/kyc/KYCSuccess";
import { KYCPendingStatus } from "@/components/kyc/KYCPendingStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowUpCircle } from "lucide-react";

const KYCVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetTier = searchParams.get("tier") as "tier_2" | "tier_3" | null;

  const { user, loading: authLoading } = useAuth();
  const { currentTier: apiTierData, loading: tierLoading } = usePlatformKYC();
  const { getPendingRequest, loading: kycLoading } = useKYC();

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login");
    }
  }, [user, authLoading, navigate]);

  const loading = authLoading || tierLoading || kycLoading;

  if (loading || !user) {
    return (
      <AppLayout showHeader={false}>
        <header className="bg-gradient-hero safe-top">
          <div className="container mx-auto px-4 sm:px-6 py-4 max-w-4xl">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full bg-white/20" />
              <Skeleton className="h-6 w-40 bg-white/20" />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 sm:px-6 py-6 max-w-4xl">
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  // Check for pending request
  const pendingRequest = getPendingRequest();
  if (pendingRequest && !submitted) {
    return (
      <AppLayout showHeader={false}>
        <header className="bg-gradient-hero safe-top">
          <div className="container mx-auto px-4 sm:px-6 py-4 max-w-4xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/account/settings")}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-semibold text-white">
                KYC Verification
              </h1>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 sm:px-6 py-6 max-w-4xl">
          <KYCPendingStatus request={pendingRequest} />
        </div>
      </AppLayout>
    );
  }

  // Show success state
  if (submitted) {
    return (
      <AppLayout showHeader={false}>
        <header className="bg-gradient-hero safe-top">
          <div className="container mx-auto px-4 sm:px-6 py-4 max-w-4xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/account/settings")}
                className="p-2.5 rounded-full bg-white/20 transition-colors text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-semibold text-white">
                KYC Verification
              </h1>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 sm:px-6 py-6 max-w-4xl">
          <KYCSuccess
            tier={targetTier || "tier_2"}
            onDone={() => navigate("/account/settings")}
          />
        </div>
      </AppLayout>
    );
  }

  const currentTierLevel = apiTierData?.kyc_level || 1;
  const currentTier = `tier_${currentTierLevel}` as
    | "tier_1"
    | "tier_2"
    | "tier_3";

  // Determine which tier to upgrade to
  const upgradeTier =
    targetTier || (currentTier === "tier_1" ? "tier_2" : "tier_3");

  // Validate upgrade path
  if (currentTier === "tier_3") {
    return (
      <AppLayout showHeader={false}>
        <header className="bg-gradient-hero safe-top">
          <div className="container mx-auto px-4 sm:px-6 py-4 max-w-4xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/account/settings")}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-semibold text-white">
                KYC Verification
              </h1>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 sm:px-6 py-6 max-w-4xl">
          <Card>
            <CardContent className="p-8 text-center">
              <ArrowUpCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Maximum Tier Reached
              </h2>
              <p className="text-muted-foreground mb-6">
                You've already completed full KYC verification and have access
                to all features.
              </p>
              <Button onClick={() => navigate("/account/settings")}>
                Back to Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showHeader={false}>
      <header className="bg-gradient-hero safe-top">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-4xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/account/settings")}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-white">
                KYC Verification
              </h1>
              <p className="text-white/70 text-sm">
                {upgradeTier === "tier_2" ? "Light KYC" : "Full KYC"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-4xl">
        {upgradeTier === "tier_2" ? (
          <KYCTier2Form onSuccess={() => setSubmitted(true)} />
        ) : (
          <KYCTier3Form onSuccess={() => setSubmitted(true)} />
        )}
      </div>
    </AppLayout>
  );
};

export default KYCVerification;
