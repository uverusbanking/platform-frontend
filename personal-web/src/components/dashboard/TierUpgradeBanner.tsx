import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserTier, TierLimits } from '@/hooks/useUserTier';
import { useKYC } from '@/hooks/useKYC';
import { ArrowUpCircle, Shield, TrendingUp, Sparkles } from 'lucide-react';

interface TierUpgradeBannerProps {
  currentTier: UserTier;
  tierLimits: TierLimits;
}

const getNextTierInfo = (currentTier: UserTier) => {
  switch (currentTier) {
    case 'tier_1':
      return {
        name: 'Tier 2',
        icon: TrendingUp,
        benefits: ['₦200,000 per transaction', '₦10M monthly limit', 'Faster transfers'],
        gradient: 'from-primary/20 to-primary/5',
        buttonColor: 'bg-primary hover:bg-primary/90',
      };
    case 'tier_2':
      return {
        name: 'Tier 3',
        icon: ArrowUpCircle,
        benefits: ['₦1,000,000 per transaction', '₦50M monthly limit', 'Priority support'],
        gradient: 'from-success/20 to-success/5',
        buttonColor: 'bg-success hover:bg-success/90',
      };
    default:
      return null;
  }
};

export const TierUpgradeBanner = ({ currentTier, tierLimits }: TierUpgradeBannerProps) => {
  const navigate = useNavigate();
  const { hasPendingRequest, loading: kycLoading } = useKYC();

  // Don't show for tier 3 users
  if (currentTier === 'tier_3') return null;

  // Don't show while loading KYC status
  if (kycLoading) return null;

  // Don't show if there's a pending upgrade request
  if (hasPendingRequest()) return null;

  const nextTier = getNextTierInfo(currentTier);
  if (!nextTier) return null;

  const NextTierIcon = nextTier.icon;

  return (
    <Card className={`overflow-hidden border-0 bg-gradient-to-r ${nextTier.gradient}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-background/80 shrink-0">
            <NextTierIcon size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={14} className="text-warning" />
              <p className="text-sm font-semibold">Upgrade to {nextTier.name}</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Unlock higher transaction limits and premium features
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {nextTier.benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-background/60 text-foreground/80"
                >
                  {benefit}
                </span>
              ))}
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/account/kyc-verification')}
              className={`${nextTier.buttonColor} text-white h-8 text-xs`}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
