import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserTier, UserTier } from '@/hooks/useUserTier';
import { useKYC, KYCDocument } from '@/hooks/useKYC';
import {
  Shield,
  TrendingUp,
  ArrowUpCircle,
  FileCheck,
  FileX,
  Clock,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const getDocumentTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    bvn: 'BVN Verification',
    nin: 'NIN Verification',
    passport: 'International Passport',
    drivers_license: "Driver's License",
    national_id: 'National ID Card',
    utility_bill: 'Utility Bill',
    bank_statement: 'Bank Statement',
    selfie: 'Selfie/Liveness Check',
  };
  return labels[type] || type;
};

const getTierIcon = (tier: UserTier, size: number = 20) => {
  switch (tier) {
    case 'tier_1':
      return <Shield className="text-muted-foreground" size={size} />;
    case 'tier_2':
      return <TrendingUp className="text-primary" size={size} />;
    case 'tier_3':
      return <ArrowUpCircle className="text-success" size={size} />;
  }
};

const getTierBadgeStyles = (tier: UserTier) => {
  switch (tier) {
    case 'tier_1':
      return 'bg-muted/50 text-muted-foreground border-border';
    case 'tier_2':
      return 'bg-primary/10 text-primary border-primary/30';
    case 'tier_3':
      return 'bg-success/10 text-success border-success/30';
  }
};

const SimpleTierBadge = ({ tier }: { tier: UserTier }) => {
  const tierLabels: Record<UserTier, string> = {
    tier_1: 'Tier 1',
    tier_2: 'Tier 2',
    tier_3: 'Tier 3',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getTierBadgeStyles(tier)}`}>
      {getTierIcon(tier, 12)}
      <span>{tierLabels[tier]}</span>
    </div>
  );
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return (
        <Badge variant="default" className="bg-success text-success-foreground">
          <FileCheck size={12} className="mr-1" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="destructive">
          <FileX size={12} className="mr-1" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          <Clock size={12} className="mr-1" />
          Pending
        </Badge>
      );
  }
};

interface DocumentItemProps {
  document: KYCDocument;
}

const DocumentItem = ({ document }: DocumentItemProps) => (
  <div className="p-3 rounded-lg bg-muted/50 space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{getDocumentTypeLabel(document.document_type)}</span>
      {getStatusBadge(document.status)}
    </div>
    {document.document_number && (
      <p className="text-xs text-muted-foreground">
        Document: ****{document.document_number.slice(-4)}
      </p>
    )}
    {document.status === 'rejected' && document.rejection_reason && (
      <div className="flex items-start gap-2 p-2 rounded bg-destructive/10 border border-destructive/20">
        <AlertCircle size={14} className="text-destructive mt-0.5 shrink-0" />
        <p className="text-xs text-destructive">{document.rejection_reason}</p>
      </div>
    )}
  </div>
);

interface TierSectionProps {
  tierNumber: number;
  tierName: string;
  isCurrentTier: boolean;
  documents: KYCDocument[];
}

const TierSection = ({ tierNumber, tierName, isCurrentTier, documents }: TierSectionProps) => {
  const tier2Documents = documents.filter(d => ['bvn', 'nin'].includes(d.document_type));
  const tier3Documents = documents.filter(d =>
    ['passport', 'drivers_license', 'national_id', 'selfie'].includes(d.document_type)
  );

  const relevantDocs = tierNumber === 2 ? tier2Documents : tierNumber === 3 ? tier3Documents : [];

  if (tierNumber === 1 || relevantDocs.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          {tierName} Documents
        </h4>
        {isCurrentTier && (
          <Badge variant="outline" className="text-xs">Current</Badge>
        )}
      </div>
      <div className="space-y-2">
        {relevantDocs.map((doc) => (
          <DocumentItem key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  );
};

export const TierDocumentsCard = () => {
  const navigate = useNavigate();
  const { userTier, tierLimits, loading: tierLoading } = useUserTier();
  const { documents, loading: kycLoading, hasPendingRequest, getPendingRequest } = useKYC();

  const loading = tierLoading || kycLoading;
  const currentTier = userTier?.current_tier || 'tier_1';
  const pendingRequest = getPendingRequest();

  if (loading) {
    return (
      <Card>
        <CardHeader className="py-3 sm:py-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">Account Tier</CardTitle>
          <SimpleTierBadge tier={currentTier} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Current Tier Info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-hero text-white">
          <div className="p-2 rounded-full bg-white/20">
            {getTierIcon(currentTier)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{tierLimits?.tier_name || 'Basic'}</p>
            <p className="text-xs text-white/70">{tierLimits?.tier_description}</p>
          </div>
        </div>

        {/* Pending Upgrade Request */}
        {pendingRequest && (
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-warning" />
              <div>
                <p className="text-sm font-medium text-warning">Upgrade Pending</p>
                <p className="text-xs text-muted-foreground">
                  Your request to upgrade to {pendingRequest.requested_tier.replace('_', ' ').toUpperCase()} is under review
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Documents by Tier */}
        {documents.length > 0 && (
          <div className="space-y-4">
            <TierSection
              tierNumber={2}
              tierName="Tier 2"
              isCurrentTier={currentTier === 'tier_2'}
              documents={documents}
            />
            <TierSection
              tierNumber={3}
              tierName="Tier 3"
              isCurrentTier={currentTier === 'tier_3'}
              documents={documents}
            />
          </div>
        )}

        {/* Upgrade Button - Show for non-tier-3 users without pending request */}
        {currentTier !== 'tier_3' && !hasPendingRequest() && (
          <button
            onClick={() => navigate('/account/kyc-verification')}
            className="w-full p-3 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpCircle size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-primary">
                    Upgrade to {currentTier === 'tier_1' ? 'Tier 2' : 'Tier 3'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentTier === 'tier_1'
                      ? 'Complete BVN/NIN verification for higher limits'
                      : 'Complete full KYC for maximum limits'}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-primary" />
            </div>
          </button>
        )}
      </CardContent>
    </Card>
  );
};
