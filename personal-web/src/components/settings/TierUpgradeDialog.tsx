import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TierLimits, UserTier } from '@/hooks/useUserTier';
import { formatCurrency } from '@/lib/currency';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Shield,
  TrendingUp,
  ArrowUpCircle,
  CheckCircle,
  FileText,
  User,
  CreditCard,
  Camera,
  Home,
  ArrowRight
} from 'lucide-react';

interface TierUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTier: UserTier;
  allTiers: TierLimits[];
}

const getTierIcon = (tier: UserTier, size: number = 24) => {
  switch (tier) {
    case 'tier_1':
      return <Shield size={size} />;
    case 'tier_2':
      return <TrendingUp size={size} />;
    case 'tier_3':
      return <ArrowUpCircle size={size} />;
  }
};

const getRequirementIcon = (doc: string) => {
  if (doc.toLowerCase().includes('bvn') || doc.toLowerCase().includes('nin')) {
    return <CreditCard size={16} />;
  }
  if (doc.toLowerCase().includes('id') || doc.toLowerCase().includes('passport')) {
    return <FileText size={16} />;
  }
  if (doc.toLowerCase().includes('selfie') || doc.toLowerCase().includes('photo')) {
    return <Camera size={16} />;
  }
  if (doc.toLowerCase().includes('address') || doc.toLowerCase().includes('utility')) {
    return <Home size={16} />;
  }
  return <User size={16} />;
};

export const TierUpgradeDialog = ({
  open,
  onOpenChange,
  currentTier,
  allTiers
}: TierUpgradeDialogProps) => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<UserTier | null>(null);

  const currentTierNum = parseInt(currentTier.replace('tier_', ''));
  const availableUpgrades = allTiers.filter(
    tier => parseInt(tier.tier.replace('tier_', '')) > currentTierNum
  );

  const handleStartVerification = (tier: UserTier) => {
    onOpenChange(false);
    navigate(`/account/kyc-verification?tier=${tier}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpCircle className="text-primary" size={20} />
            Upgrade Your Account
          </DialogTitle>
          <DialogDescription>
            Complete verification to unlock higher transaction limits and premium features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Current Tier Status */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                  {getTierIcon(currentTier, 20)}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Tier</p>
                  <p className="font-semibold">
                    {allTiers.find(t => t.tier === currentTier)?.tier_name || 'Basic'}
                  </p>
                </div>
                <Badge variant="secondary" className="ml-auto">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Available Upgrades */}
          {availableUpgrades.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Available Upgrades</h4>

              {availableUpgrades.map((tier) => (
                <Card
                  key={tier.tier}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedTier === tier.tier
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:border-primary/50'
                    }`}
                  onClick={() => setSelectedTier(tier.tier)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tier.tier === 'tier_2' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                        }`}>
                        {getTierIcon(tier.tier, 20)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-sm">{tier.tier_name}</h5>
                          {tier.tier === 'tier_3' && (
                            <Badge className="text-[10px] bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {tier.tier_description}
                        </p>

                        {/* Limits Preview */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="p-2 rounded bg-muted/50">
                            <p className="text-[10px] text-muted-foreground">Max Send/Tx</p>
                            <p className="text-xs font-medium">{formatCurrency(tier.max_send_per_tx)}</p>
                          </div>
                          <div className="p-2 rounded bg-muted/50">
                            <p className="text-[10px] text-muted-foreground">Monthly Limit</p>
                            <p className="text-xs font-medium">{formatCurrency(tier.monthly_limit)}</p>
                          </div>
                        </div>

                        {/* Requirements */}
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1.5">Requirements:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {tier.required_documents.map((doc, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-[10px] gap-1 py-0.5"
                              >
                                {getRequirementIcon(doc)}
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {selectedTier === tier.tier && (
                        <CheckCircle className="text-primary shrink-0" size={20} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                <h4 className="font-semibold">Maximum Tier Reached!</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  You've unlocked all available features and the highest transaction limits.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Button */}
          {availableUpgrades.length > 0 && (
            <Button
              className="w-full"
              size="lg"
              disabled={!selectedTier}
              onClick={() => selectedTier && handleStartVerification(selectedTier)}
            >
              Start Verification
              <ArrowRight size={18} className="ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
