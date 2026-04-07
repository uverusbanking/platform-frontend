import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useKYC } from "@/hooks/useKYC";
import { usePlatformKYC, UserTier } from "@/hooks/usePlatformKYC";
import { AppLayout } from "@/components/AppLayout";
import { TierCard } from "@/components/settings/TierCard";
import { TierComparisonTable } from "@/components/settings/TierComparisonTable";
import { TierUpgradeDialog } from "@/components/settings/TierUpgradeDialog";
import {
  SettingsSection,
  SettingsToggle,
  SettingsButton,
} from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Shield,
  Fingerprint,
  Eye,
  Globe,
  Clock,
  CreditCard,
  HelpCircle,
  FileText,
  LogOut,
  ChevronUp,
  AlertTriangle,
  ArrowUpCircle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { usePinStatus } from "@/hooks/queries/useSecurity";
import {
  SetupPinDialog,
  VerifyPinDialog,
} from "@/components/TransactionPinDialog";
import { ChangePasswordDialog } from "@/components/settings/ChangePasswordDialog";

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  const {
    currentTier: apiTier,
    allTiers,
    loading: statusLoading,
    customerId,
    fetchTierLevel,
  } = usePlatformKYC();

  const currentTierLevel = apiTier?.kyc_level || 1;
  const currentTier = `tier_${currentTierLevel}` as UserTier;
  // allTiers comes from useUverusKYC now.
  const tierLimits =
    allTiers.find((t) => t.tier === currentTier) ||
    allTiers.find((t) => t.tier === "tier_1");
  const tierLoading = statusLoading;

  const getTierProgress = () => (currentTierLevel / 3) * 100;
  const getNextTier = () => {
    if (currentTierLevel >= 3) return null;
    return (
      allTiers.find((t) => t.tier === `tier_${currentTierLevel + 1}`) || null
    );
  };

  const {
    settings,
    loading: settingsLoading,
    toggleSetting,
    saving,
  } = useUserSettings();
  const { hasPendingRequest, isKYCComplete, loading: kycLoading } = useKYC();
  const {
    data: pinStatus,
    isLoading: pinStatusLoading,
    refetch: refreshPin,
  } = usePinStatus();
  const isPinSet = !!pinStatus?.status;

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [setupPinOpen, setSetupPinOpen] = useState(false);
  const [verifyPinOpen, setVerifyPinOpen] = useState(false);

  // Determine if we should show the upgrade section
  const showUpgradeSection = () => {
    if (currentTier === "tier_3") return false;
    if (kycLoading) return false;

    const nextTier = currentTier === "tier_1" ? "tier_2" : "tier_3";

    // Show if no pending request and KYC not complete for next tier
    return !hasPendingRequest() && !isKYCComplete(nextTier);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const loading = tierLoading || settingsLoading;

  return (
    <AppLayout showHeader={false}>
      {/* Header */}
      <header className="bg-gradient-hero safe-top">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-4xl">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors text-white touch-manipulation"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-white">
              Account Settings
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-4xl">
        {/* Tier Card */}
        {loading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : tierLimits ? (
          <TierCard
            currentTier={currentTier}
            // cast tierLimits to any if types mismatch slightly (though they shouldn't)
            tierLimits={tierLimits}
            tierProgress={getTierProgress()}
            nextTier={getNextTier()}
          />
        ) : null}

        {/* Upgrade Section - only show if KYC not complete */}
        {showUpgradeSection() && (
          <SettingsSection
            title="Upgrade Your Account"
            description="Verify your identity to unlock higher transaction limits"
          >
            <SettingsButton
              icon={<ArrowUpCircle size={18} />}
              label="Upgrade Tier"
              description="Complete KYC to upgrade your tier"
              onClick={() => navigate("/account/kyc-verification")}
              badge={
                <Badge variant="default" className="text-[10px]">
                  Recommended
                </Badge>
              }
            />
          </SettingsSection>
        )}

        {/* Notification Settings */}
        <SettingsSection
          title="Notifications"
          description="Control how you receive alerts and updates"
        >
          {loading || !settings ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <>
              <SettingsToggle
                icon={<Mail size={18} />}
                label="Email Notifications"
                description="Receive updates via email"
                checked={settings.email_notifications}
                onToggle={() => toggleSetting("email_notifications")}
                loading={saving}
              />
              <SettingsToggle
                icon={<MessageSquare size={18} />}
                label="SMS Notifications"
                description="Get text message alerts"
                checked={settings.sms_notifications}
                onToggle={() => toggleSetting("sms_notifications")}
                loading={saving}
              />
              <SettingsToggle
                icon={<Smartphone size={18} />}
                label="Push Notifications"
                description="In-app push notifications"
                checked={settings.push_notifications}
                onToggle={() => toggleSetting("push_notifications")}
                loading={saving}
              />
              <SettingsToggle
                icon={<Bell size={18} />}
                label="Transaction Alerts"
                description="Get notified for every transaction"
                checked={settings.transaction_alerts}
                onToggle={() => toggleSetting("transaction_alerts")}
                loading={saving}
              />
              <SettingsToggle
                icon={<AlertTriangle size={18} />}
                label="Daily Limit Alerts"
                description="Warn when approaching limits"
                checked={settings.daily_limit_alerts}
                onToggle={() => toggleSetting("daily_limit_alerts")}
                loading={saving}
              />
            </>
          )}
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection
          title="Security"
          description="Protect your account and transactions"
        >
          {loading || !settings ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <>
              <SettingsButton
                icon={<Lock size={18} />}
                label="Change Password"
                description="Update your account password"
                onClick={() => setChangePasswordOpen(true)}
              />
              <SettingsButton
                icon={<Shield size={18} />}
                label={
                  isPinSet ? "Change Transaction PIN" : "Set Transaction PIN"
                }
                description={
                  isPinSet
                    ? "Update your 4-digit PIN"
                    : "Protect your transfers"
                }
                onClick={() => {
                  if (isPinSet) {
                    setVerifyPinOpen(true);
                  } else {
                    setSetupPinOpen(true);
                  }
                }}
              />
              <SettingsToggle
                icon={<Shield size={18} />}
                label="Two-Factor Authentication"
                description="Add an extra layer of security"
                checked={settings.two_factor_enabled}
                onToggle={() => toggleSetting("two_factor_enabled")}
                loading={saving}
              />
              <SettingsToggle
                icon={<Fingerprint size={18} />}
                label="Biometric Login"
                description="Use fingerprint or face ID"
                checked={settings.biometric_enabled}
                onToggle={() => toggleSetting("biometric_enabled")}
                disabled={currentTier !== "tier_3"}
                loading={saving}
              />
              <SettingsToggle
                icon={<Eye size={18} />}
                label="Login Alerts"
                description="Get notified of new logins"
                checked={settings.login_alerts}
                onToggle={() => toggleSetting("login_alerts")}
                loading={saving}
              />
            </>
          )}
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection
          title="Preferences"
          description="Customize your experience"
        >
          <SettingsButton
            icon={<Globe size={18} />}
            label="Language"
            description="English"
            onClick={() => toast.info("Language settings coming soon")}
          />
          <SettingsButton
            icon={<Clock size={18} />}
            label="Timezone"
            description="Africa/Lagos (WAT)"
            onClick={() => toast.info("Timezone settings coming soon")}
          />
          <SettingsButton
            icon={<CreditCard size={18} />}
            label="Linked Accounts"
            description="Manage bank accounts and cards"
            onClick={() => toast.info("Linked accounts coming soon")}
          />
        </SettingsSection>

        {/* Tier Comparison Table */}
        {!loading && allTiers.length > 0 && tierLimits && (
          <TierComparisonTable allTiers={allTiers} currentTier={currentTier} />
        )}

        {/* Support & Legal */}
        <SettingsSection title="Support & Legal">
          <SettingsButton
            icon={<HelpCircle size={18} />}
            label="Help Center"
            onClick={() => toast.info("Help center coming soon")}
          />
          <SettingsButton
            icon={<FileText size={18} />}
            label="Terms of Service"
            onClick={() => toast.info("Terms coming soon")}
          />
          <SettingsButton
            icon={<Shield size={18} />}
            label="Privacy Policy"
            onClick={() => toast.info("Privacy policy coming soon")}
          />
        </SettingsSection>

        {/* Admin Access */}
        {isAdmin && (
          <SettingsSection title="Administration">
            <SettingsButton
              icon={<Shield size={18} />}
              label="Admin Console"
              description="Access administrative features"
              onClick={() => navigate("/admin")}
              variant="warning"
            />
          </SettingsSection>
        )}

        {/* Sign Out */}
        <Button
          variant="destructive"
          className="w-full h-11 sm:h-10"
          onClick={handleSignOut}
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </Button>

        {/* Version info */}
        <p className="text-center text-xs text-muted-foreground">
          Version 1.0.0 • UverusPay
        </p>
      </div>

      {/* Tier Upgrade Dialog */}
      {tierLimits && (
        <TierUpgradeDialog
          open={upgradeDialogOpen}
          onOpenChange={setUpgradeDialogOpen}
          currentTier={currentTier}
          allTiers={allTiers}
        />
      )}

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />

      <SetupPinDialog
        open={setupPinOpen}
        onOpenChange={setSetupPinOpen}
        onSuccess={refreshPin}
      />

      <VerifyPinDialog
        open={verifyPinOpen}
        onOpenChange={setVerifyPinOpen}
        onSuccess={() => {
          setSetupPinOpen(true);
        }}
        title="Change Transaction PIN"
        description="Please verify your current PIN first"
      />
    </AppLayout>
  );
};

export default Settings;
