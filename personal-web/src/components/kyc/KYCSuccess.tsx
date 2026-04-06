import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, TrendingUp, ArrowUpCircle } from 'lucide-react';

interface KYCSuccessProps {
  tier: 'tier_2' | 'tier_3';
  onDone: () => void;
}

export const KYCSuccess = ({ tier, onDone }: KYCSuccessProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className={`py-8 px-6 text-center ${
          tier === 'tier_2' 
            ? 'bg-gradient-to-br from-primary/10 to-primary/5' 
            : 'bg-gradient-to-br from-success/10 to-success/5'
        }`}>
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            tier === 'tier_2' ? 'bg-primary/20' : 'bg-success/20'
          }`}>
            <CheckCircle className={`w-10 h-10 ${tier === 'tier_2' ? 'text-primary' : 'text-success'}`} />
          </div>
          
          <h2 className="text-xl font-semibold mb-2">Verification Submitted!</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Your {tier === 'tier_2' ? 'Light KYC' : 'Full KYC'} verification request has been submitted successfully.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* What happens next */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">What happens next?</h3>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock size={16} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Document Review</p>
                <p className="text-xs text-muted-foreground">
                  Our team will review your documents within 24-48 hours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {tier === 'tier_2' ? (
                  <TrendingUp size={16} className="text-primary" />
                ) : (
                  <ArrowUpCircle size={16} className="text-success" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm">Account Upgrade</p>
                <p className="text-xs text-muted-foreground">
                  Once approved, your account will be upgraded to{' '}
                  {tier === 'tier_2' ? 'Light KYC (Tier 2)' : 'Full KYC (Tier 3)'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle size={16} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Notification</p>
                <p className="text-xs text-muted-foreground">
                  You'll receive a notification when your verification is complete
                </p>
              </div>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={onDone}>
            Done
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
