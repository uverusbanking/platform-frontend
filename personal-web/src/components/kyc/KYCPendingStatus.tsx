import { UpgradeRequest } from '@/hooks/useKYC';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, TrendingUp, ArrowUpCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface KYCPendingStatusProps {
  request: UpgradeRequest;
}

export const KYCPendingStatus = ({ request }: KYCPendingStatusProps) => {
  const getTierInfo = () => {
    if (request.requested_tier === 'tier_2') {
      return {
        name: 'Light KYC (Tier 2)',
        icon: TrendingUp,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
      };
    }
    return {
      name: 'Full KYC (Tier 3)',
      icon: ArrowUpCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    };
  };

  const tierInfo = getTierInfo();
  const TierIcon = tierInfo.icon;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${tierInfo.bgColor}`}>
            <Clock className={`w-8 h-8 ${tierInfo.color}`} />
          </div>
          
          <h2 className="text-lg font-semibold mb-1">Verification In Progress</h2>
          <p className="text-muted-foreground text-sm">
            Your upgrade request is being reviewed
          </p>
        </div>

        <div className="space-y-4">
          {/* Request Details */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Requested Tier</span>
              <div className="flex items-center gap-2">
                <TierIcon size={16} className={tierInfo.color} />
                <span className="font-medium text-sm">{tierInfo.name}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="secondary" className="gap-1">
                <Clock size={12} />
                Pending Review
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Submitted</span>
              <span className="text-sm">
                {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Verification Progress</h3>
            
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
              
              {/* Step 1: Submitted */}
              <div className="relative pb-4">
                <div className="absolute left-[-18px] w-4 h-4 rounded-full bg-success flex items-center justify-center">
                  <CheckCircle size={10} className="text-white" />
                </div>
                <p className="font-medium text-sm">Documents Submitted</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                </p>
              </div>

              {/* Step 2: Under Review */}
              <div className="relative pb-4">
                <div className="absolute left-[-18px] w-4 h-4 rounded-full bg-warning flex items-center justify-center">
                  <Clock size={10} className="text-white" />
                </div>
                <p className="font-medium text-sm">Under Review</p>
                <p className="text-xs text-muted-foreground">Our team is reviewing your documents</p>
              </div>

              {/* Step 3: Approval */}
              <div className="relative">
                <div className="absolute left-[-18px] w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                </div>
                <p className="font-medium text-sm text-muted-foreground">Account Upgrade</p>
                <p className="text-xs text-muted-foreground">Pending completion</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Document review typically takes 24-48 hours. 
              You'll receive a notification once the review is complete.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
