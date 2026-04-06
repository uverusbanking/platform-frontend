import { useNavigate } from 'react-router-dom';
import { UserTier, TierLimits } from '@/hooks/useUserTier';
import { useKYC } from '@/hooks/useKYC';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, TrendingUp, ArrowUpCircle, ChevronRight } from 'lucide-react';

interface TierBadgeProps {
  currentTier: UserTier;
  tierLimits: TierLimits;
  tierProgress: number;
  compact?: boolean;
}

const getTierIcon = (tier: UserTier, size: number = 16) => {
  switch (tier) {
    case 'tier_1':
      return <Shield size={size} />;
    case 'tier_2':
      return <TrendingUp size={size} />;
    case 'tier_3':
      return <ArrowUpCircle size={size} />;
  }
};

const getTierColor = (tier: UserTier) => {
  switch (tier) {
    case 'tier_1':
      return 'bg-muted/50 text-muted-foreground border-border';
    case 'tier_2':
      return 'bg-primary/10 text-primary border-primary/30';
    case 'tier_3':
      return 'bg-success/10 text-success border-success/30';
  }
};

export const TierBadge = ({ currentTier, tierLimits, tierProgress, compact = false }: TierBadgeProps) => {
  const navigate = useNavigate();
  const { hasPendingRequest, isKYCComplete, loading: kycLoading } = useKYC();

  // Determine if we should show upgrade badge
  const showUpgradeBadge = () => {
    if (currentTier === 'tier_3') return false;
    if (kycLoading) return false;

    // Check next tier KYC status
    const nextTier = currentTier === 'tier_1' ? 'tier_2' : 'tier_3';

    // Don't show if pending request or KYC is complete for next tier
    if (hasPendingRequest()) return false;
    if (isKYCComplete(nextTier)) return false;

    return true;
  };

  if (compact) {
    return (
      <button
        onClick={() => navigate('/account/settings')}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:opacity-80 ${getTierColor(currentTier)}`}
      >
        {getTierIcon(currentTier, 12)}
        <span>{tierLimits.tier_name.split(' / ')[0]}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => showUpgradeBadge() ? navigate('/account/kyc-verification') : navigate('/account/settings')}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md active:scale-[0.99] ${getTierColor(currentTier)}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentTier === 'tier_1' ? 'bg-muted' :
        currentTier === 'tier_2' ? 'bg-primary/20' : 'bg-success/20'
        }`}>
        {getTierIcon(currentTier, 20)}
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{tierLimits.tier_name}</span>
          {showUpgradeBadge() && (
            <Badge variant="outline" className="text-[10px] h-4 px-1.5">
              Upgrade
            </Badge>
          )}
        </div>
        {currentTier !== 'tier_3' && showUpgradeBadge() && (
          <div className="mt-1.5">
            <Progress value={tierProgress} className="h-1.5" />
          </div>
        )}
      </div>
      <ChevronRight size={18} className="text-muted-foreground" />
    </button>
  );
};
