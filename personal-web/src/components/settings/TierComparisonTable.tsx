import { TierLimits, UserTier } from '@/hooks/useUserTier';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatCompactAmount } from '@/lib/currency';
import { CheckCircle, Circle, Crown } from 'lucide-react';

const formatLimit = (amount: number) => `₦${formatCompactAmount(amount)}`;

interface TierComparisonTableProps {
  allTiers: TierLimits[];
  currentTier: UserTier;
}

export const TierComparisonTable = ({ allTiers, currentTier }: TierComparisonTableProps) => {
  const getTierNumber = (tier: UserTier) => parseInt(tier.replace('tier_', ''));
  const currentTierNum = getTierNumber(currentTier);

  return (
    <Card>
      <CardHeader className="py-3 sm:py-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Crown size={18} className="text-warning" />
          Tier Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-medium">Feature</th>
                {allTiers.map((tier) => (
                  <th key={tier.tier} className="text-center p-3 font-medium min-w-[100px]">
                    <div className="flex flex-col items-center gap-1">
                      <span>{tier.tier_name.split(' / ')[0]}</span>
                      {tier.tier === currentTier && (
                        <Badge variant="secondary" className="text-[10px]">Current</Badge>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Limits rows */}
              <tr className="border-b border-border">
                <td className="p-3 text-muted-foreground">Max Send/Tx</td>
                {allTiers.map((tier) => (
                  <td key={tier.tier} className="p-3 text-center font-medium">
                    {formatLimit(tier.max_send_per_tx)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 text-muted-foreground">Max Receive/Tx</td>
                {allTiers.map((tier) => (
                  <td key={tier.tier} className="p-3 text-center font-medium">
                    {formatLimit(tier.max_receive_per_tx)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 text-muted-foreground">Daily Send</td>
                {allTiers.map((tier) => (
                  <td key={tier.tier} className="p-3 text-center font-medium">
                    {formatLimit(tier.daily_send_limit)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 text-muted-foreground">Daily Receive</td>
                {allTiers.map((tier) => (
                  <td key={tier.tier} className="p-3 text-center font-medium">
                    {formatLimit(tier.daily_receive_limit)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 text-muted-foreground">Monthly Limit</td>
                {allTiers.map((tier) => (
                  <td key={tier.tier} className="p-3 text-center font-medium">
                    {formatLimit(tier.monthly_limit)}
                  </td>
                ))}
              </tr>

              {/* Feature availability */}
              <tr className="border-b border-border bg-muted/30">
                <td colSpan={4} className="p-3 font-medium">Features</td>
              </tr>
              
              <FeatureRow 
                label="Basic Settings" 
                tiers={allTiers} 
                check={(tier) => true} 
              />
              <FeatureRow 
                label="2FA Security" 
                tiers={allTiers} 
                check={(tier) => true} 
              />
              <FeatureRow 
                label="SMS/Email Alerts" 
                tiers={allTiers} 
                check={(tier) => getTierNumber(tier.tier) >= 2} 
              />
              <FeatureRow 
                label="Linked Bank Accounts" 
                tiers={allTiers} 
                check={(tier) => getTierNumber(tier.tier) >= 2} 
              />
              <FeatureRow 
                label="Biometric Login" 
                tiers={allTiers} 
                check={(tier) => getTierNumber(tier.tier) >= 3} 
              />
              <FeatureRow 
                label="Scheduled Transfers" 
                tiers={allTiers} 
                check={(tier) => getTierNumber(tier.tier) >= 3} 
              />
              <FeatureRow 
                label="Priority Support" 
                tiers={allTiers} 
                check={(tier) => getTierNumber(tier.tier) >= 3} 
              />
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

interface FeatureRowProps {
  label: string;
  tiers: TierLimits[];
  check: (tier: TierLimits) => boolean;
}

const FeatureRow = ({ label, tiers, check }: FeatureRowProps) => (
  <tr className="border-b border-border last:border-b-0">
    <td className="p-3 text-muted-foreground">{label}</td>
    {tiers.map((tier) => (
      <td key={tier.tier} className="p-3 text-center">
        {check(tier) ? (
          <CheckCircle size={18} className="inline text-success" />
        ) : (
          <Circle size={18} className="inline text-muted-foreground/30" />
        )}
      </td>
    ))}
  </tr>
);
