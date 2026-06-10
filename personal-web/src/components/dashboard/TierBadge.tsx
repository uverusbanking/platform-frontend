import { useNavigate } from "react-router-dom";
import { UserTier, TierLimits } from "@/hooks/useUserTier";
import { useKYC } from "@/hooks/useKYC";
import { Progress } from "@/components/ui/progress";
import { Shield, TrendingUp, ArrowUpCircle, ChevronRight } from "lucide-react";

interface TierBadgeProps {
  currentTier: UserTier;
  tierLimits: TierLimits;
  tierProgress: number;
  compact?: boolean;
}

const tierConfig = {
  tier_1: {
    icon: Shield,
    bg: "rgb(var(--surface))",
    color: "rgb(var(--foreground-subtle))",
    pillBg: "rgb(var(--surface-highest))",
    pillBorder: "rgb(var(--surface-high))",
  },
  tier_2: {
    icon: TrendingUp,
    bg: "rgb(var(--soft))",
    color: "rgb(var(--brand-primary))",
    pillBg: "rgb(var(--soft))",
    pillBorder: "rgb(var(--brand-primary) / 0.2)",
  },
  tier_3: {
    icon: ArrowUpCircle,
    bg: "rgb(var(--mint))",
    color: "rgb(var(--mint-deep))",
    pillBg: "rgb(var(--mint))",
    pillBorder: "rgb(var(--mint-deep) / 0.3)",
  },
};

export const TierBadge = ({
  currentTier,
  tierLimits,
  tierProgress,
  compact = false,
}: TierBadgeProps) => {
  const navigate = useNavigate();
  const { hasPendingRequest, isKYCComplete, loading: kycLoading } = useKYC();
  const cfg = tierConfig[currentTier] || tierConfig.tier_1;
  const Icon = cfg.icon;

  const showUpgradeBadge = () => {
    if (currentTier === "tier_3" || kycLoading) return false;
    const nextTier = currentTier === "tier_1" ? "tier_2" : "tier_3";
    return !hasPendingRequest() && !isKYCComplete(nextTier);
  };

  if (compact) {
    return (
      <button
        onClick={() => navigate("/account/settings")}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-semibold border transition-opacity hover:opacity-80"
        style={{
          background: cfg.pillBg,
          borderColor: cfg.pillBorder,
          color: cfg.color,
        }}
      >
        <Icon size={12} />
        <span>{tierLimits.tier_name.split(" / ")[0]}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() =>
        showUpgradeBadge()
          ? navigate("/account/kyc-verification")
          : navigate("/account/settings")
      }
      className="w-full flex items-center gap-3 p-3 rounded-xl border transition-colors hover:bg-surface text-left"
      style={{ background: cfg.pillBg, borderColor: cfg.pillBorder }}
    >
      <div
        className="w-10 h-10 rounded-pill flex items-center justify-center shrink-0"
        style={{ background: cfg.bg }}
      >
        <Icon size={18} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm">{tierLimits.tier_name}</span>
          {showUpgradeBadge() && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-pill font-semibold"
              style={{
                background: "rgb(var(--soft))",
                color: "rgb(var(--brand-primary))",
              }}
            >
              Upgrade
            </span>
          )}
        </div>
        {currentTier !== "tier_3" && showUpgradeBadge() && (
          <Progress value={tierProgress} className="h-1" />
        )}
      </div>
      <ChevronRight size={14} className="text-foreground-subtle shrink-0" />
    </button>
  );
};
