import { useNavigate } from "react-router-dom";
import { UserTier, TierLimits } from "@/hooks/useUserTier";
import { useKYC } from "@/hooks/useKYC";
import { ArrowUpCircle, TrendingUp, Zap } from "lucide-react";

interface TierUpgradeBannerProps {
  currentTier: UserTier;
  tierLimits: TierLimits;
}

const nextTierData = {
  tier_1: {
    name: "Tier 2",
    icon: TrendingUp,
    benefits: [
      "₦200,000 per transaction",
      "₦10M monthly limit",
      "Faster transfers",
    ],
  },
  tier_2: {
    name: "Tier 3",
    icon: ArrowUpCircle,
    benefits: [
      "₦1,000,000 per transaction",
      "₦50M monthly limit",
      "Priority support",
    ],
  },
};

export const TierUpgradeBanner = ({ currentTier }: TierUpgradeBannerProps) => {
  const navigate = useNavigate();
  const { hasPendingRequest, loading: kycLoading } = useKYC();

  if (currentTier === "tier_3" || kycLoading || hasPendingRequest())
    return null;

  const next = nextTierData[currentTier as keyof typeof nextTierData];
  if (!next) return null;

  const Icon = next.icon;

  return (
    <div
      className="rounded-2xl p-5 shadow-card"
      style={{
        background: "rgb(var(--surface-highest))",
        border: "1px solid rgb(var(--surface-high))",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-pill flex items-center justify-center shrink-0"
          style={{ background: "rgb(var(--soft))" }}
        >
          <Icon size={18} style={{ color: "rgb(var(--brand-primary))" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={13} style={{ color: "rgb(var(--brand-primary))" }} />
            <p className="text-sm font-bold">Upgrade to {next.name}</p>
          </div>
          <p className="text-xs text-foreground-subtle mb-3 leading-relaxed">
            Unlock higher transaction limits and premium features
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {next.benefits.map((b, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-pill font-medium"
                style={{
                  background: "rgb(var(--surface))",
                  border: "1px solid rgb(var(--surface-high))",
                }}
              >
                {b}
              </span>
            ))}
          </div>
          <button
            onClick={() => navigate("/account/kyc-verification")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill text-xs font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};
