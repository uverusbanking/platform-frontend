import { TierLimits, UserTier } from '@/hooks/useUserTier';
import { useKYC } from '@/hooks/useKYC';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currency';
import {
  Shield,
  TrendingUp,
  ArrowUpCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface TierCardProps {
  currentTier: UserTier;
  tierLimits: TierLimits;
  tierProgress: number;
  nextTier: TierLimits | null;
}

const getTierIcon = (tier: UserTier) => {
  switch (tier) {
    case 'tier_1':
      return <Shield className="text-muted-foreground" size={24} />;
    case 'tier_2':
      return <TrendingUp className="text-primary" size={24} />;
    case 'tier_3':
      return <ArrowUpCircle className="text-success" size={24} />;
  }
};

const getTierBadgeVariant = (tier: UserTier): 'default' | 'secondary' | 'outline' => {
  switch (tier) {
    case 'tier_1':
      return 'secondary';
    case 'tier_2':
      return 'default';
    case 'tier_3':
      return 'outline';
  }
};

export const TierCard = ({ currentTier, tierLimits, tierProgress, nextTier }: TierCardProps) => {
  const navigate = useNavigate();
  const { hasPendingRequest, isKYCComplete, loading: kycLoading } = useKYC();

  // Determine if we should show the upgrade prompt
  const showUpgradePrompt = () => {
    if (!nextTier) return false;
    if (kycLoading) return false;

    const targetTier = currentTier === 'tier_1' ? 'tier_2' : 'tier_3';

    // Don't show if pending request or KYC is complete for next tier
    if (hasPendingRequest()) return false;
    if (isKYCComplete(targetTier)) return false;

    return true;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-hero text-white py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white/20">
              {getTierIcon(currentTier)}
            </div>
            <div>
              <p className="text-white/70 text-xs sm:text-sm">Current Tier</p>
              <CardTitle className="text-lg sm:text-xl text-white">
                {tierLimits.tier_name}
              </CardTitle>
            </div>
          </div>
          <Badge
            variant={getTierBadgeVariant(currentTier)}
            className="text-xs sm:text-sm"
          >
            {currentTier === 'tier_3' ? 'Max Tier' : `Tier ${currentTier.replace('tier_', '')}`}
          </Badge>
        </div>

        {/* Progress to next tier - only show if upgrade available */}
        {nextTier && showUpgradePrompt() && (
          <div className="mt-4">
            <div className="flex justify-between text-xs sm:text-sm text-white/70 mb-2">
              <span>Progress to {nextTier.tier_name}</span>
              <span>{Math.round(tierProgress)}%</span>
            </div>
            <Progress value={tierProgress} className="h-2 bg-white/20" />
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        <p className="text-sm text-muted-foreground">{tierLimits.tier_description}</p>

        {/* Transaction Limits */}
        <div>
          <h4 className="font-medium text-sm mb-3">Transaction Limits</h4>
          <div className="grid grid-cols-2 gap-3">
            <LimitItem
              label="Max Send/Tx"
              value={formatCurrency(tierLimits.max_send_per_tx)}
            />
            <LimitItem
              label="Max Receive/Tx"
              value={formatCurrency(tierLimits.max_receive_per_tx)}
            />
            <LimitItem
              label="Daily Send"
              value={formatCurrency(tierLimits.daily_send_limit)}
            />
            <LimitItem
              label="Daily Receive"
              value={formatCurrency(tierLimits.daily_receive_limit)}
            />
            <LimitItem
              label="Monthly Limit"
              value={formatCurrency(tierLimits.monthly_limit)}
              className="col-span-2"
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-medium text-sm mb-3">Available Features</h4>
          <div className="space-y-2">
            {tierLimits.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-success shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade prompt - only show if KYC not complete */}
        {nextTier && showUpgradePrompt() && (
          <button
            onClick={() => navigate('/account/kyc-verification')}
            className="w-full p-3 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors text-left"
          >
            <div className="flex items-start gap-2">
              <Clock size={16} className="text-primary mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">Upgrade to {nextTier.tier_name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Complete verification to unlock higher limits up to {formatCurrency(nextTier.monthly_limit)}/month
                </p>
              </div>
            </div>
          </button>
        )}
      </CardContent>
    </Card>
  );
};

const LimitItem = ({ label, value, className = '' }: { label: string; value: string; className?: string }) => (
  <div className={`p-3 rounded-lg bg-muted/50 ${className}`}>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-semibold text-sm">{value}</p>
  </div>
);
