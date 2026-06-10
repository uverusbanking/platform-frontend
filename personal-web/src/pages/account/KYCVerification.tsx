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
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpCircle } from "lucide-react";

const KYCVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetTier = searchParams.get("tier") as "tier_2" | "tier_3" | null;

  const { user, loading: authLoading } = useAuth();
  const { currentTier: apiTierData, loading: tierLoading } = usePlatformKYC();
  const { getPendingRequest, loading: kycLoading } = useKYC();

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth/login");
  }, [user, authLoading, navigate]);

  const loading = authLoading || tierLoading || kycLoading;

  const Header = ({ subtitle }: { subtitle?: string }) => (
    <div className="mb-7">
      <p className="eyebrow mb-2">Identity</p>
      <h1 className="display text-[clamp(26px,3.5vw,44px)] m-0 leading-none">
        KYC{" "}
        <span
          className="serif-italic"
          style={{ color: "rgb(var(--brand-primary))" }}
        >
          verification.
        </span>
      </h1>
      {subtitle && (
        <p className="text-foreground-subtle text-sm mt-2">{subtitle}</p>
      )}
    </div>
  );

  if (loading || !user) {
    return (
      <AppLayout>
        <Header />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </AppLayout>
    );
  }

  const pendingRequest = getPendingRequest();
  if (pendingRequest && !submitted) {
    return (
      <AppLayout>
        <Header subtitle="Your verification is under review" />
        <KYCPendingStatus request={pendingRequest} />
      </AppLayout>
    );
  }

  if (submitted) {
    return (
      <AppLayout>
        <Header subtitle="Submission received" />
        <KYCSuccess
          tier={targetTier || "tier_2"}
          onDone={() => navigate("/account/settings")}
        />
      </AppLayout>
    );
  }

  const currentTierLevel = apiTierData?.kyc_level || 1;
  const currentTier = `tier_${currentTierLevel}` as
    | "tier_1"
    | "tier_2"
    | "tier_3";
  const upgradeTier =
    targetTier || (currentTier === "tier_1" ? "tier_2" : "tier_3");

  if (currentTier === "tier_3") {
    return (
      <AppLayout>
        <Header subtitle="Full KYC already completed" />
        <div
          className="rounded-2xl p-10 text-center shadow-card"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          <div
            className="w-16 h-16 rounded-pill flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgb(var(--mint))" }}
          >
            <ArrowUpCircle
              size={28}
              style={{ color: "rgb(var(--mint-deep))" }}
            />
          </div>
          <h2 className="font-bold text-xl mb-2">Maximum Tier Reached</h2>
          <p className="text-sm text-foreground-subtle mb-6 max-w-sm mx-auto">
            You've completed full KYC verification and have access to all
            features.
          </p>
          <button
            onClick={() => navigate("/account/settings")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity"
          >
            Back to Settings
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header subtitle={upgradeTier === "tier_2" ? "Light KYC" : "Full KYC"} />
      {upgradeTier === "tier_2" ? (
        <KYCTier2Form onSuccess={() => setSubmitted(true)} />
      ) : (
        <KYCTier3Form onSuccess={() => setSubmitted(true)} />
      )}
    </AppLayout>
  );
};

export default KYCVerification;
