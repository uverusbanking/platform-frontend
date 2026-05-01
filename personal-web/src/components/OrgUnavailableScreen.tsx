import {
  Clock,
  Lock,
  PauseCircle,
  ZapOff,
  XCircle,
  Archive,
  LogOut,
  LifeBuoy,
} from "lucide-react";
import type { BrandConfig } from "@shared/core";

interface OrgUnavailableScreenProps {
  brandConfig: BrandConfig;
  unavailabilityCode?: string;
}

interface VariantConfig {
  Icon: React.ElementType;
  heading: string;
  body: string;
}

function getVariant(code: string | undefined): VariantConfig {
  switch (code) {
    case "ORG_FROZEN":
      return {
        Icon: Lock,
        heading: "Account frozen",
        body: "This account has been frozen. Please contact support for assistance.",
      };
    case "ORG_SUSPENDED":
      return {
        Icon: PauseCircle,
        heading: "Service temporarily suspended",
        body: "This service is temporarily suspended. Please contact support if you have questions.",
      };
    case "ORG_INACTIVE":
      return {
        Icon: ZapOff,
        heading: "Service inactive",
        body: "This banking service is currently inactive. Please contact support for more information.",
      };
    case "ORG_CLOSED":
      return {
        Icon: XCircle,
        heading: "Account closed",
        body: "This account has been closed. If you believe this is an error, please contact support.",
      };
    case "ORG_ARCHIVED":
      return {
        Icon: Archive,
        heading: "Service no longer available",
        body: "This banking service is no longer available. Please contact support for further assistance.",
      };
    case "ORG_PENDING":
    default:
      return {
        Icon: Clock,
        heading: "We’re getting things ready",
        body: "This service is currently under review. You’ll receive an email once your account is live and ready to use.",
      };
  }
}

export function OrgUnavailableScreen({
  brandConfig,
  unavailabilityCode,
}: OrgUnavailableScreenProps) {
  const { Icon, heading, body } = getVariant(unavailabilityCode);

  const supportHref = brandConfig.supportEmail
    ? `mailto:${brandConfig.supportEmail}`
    : (brandConfig.websiteUrl ?? "https://uverus.com/contact");

  const handleSignOut = () => {
    localStorage.removeItem("sb-access-token");
    localStorage.removeItem("sb-user-data");
    localStorage.removeItem("sb-session-id");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      {brandConfig.brandLogoUrl ? (
        <img
          src={brandConfig.brandLogoUrl}
          alt={brandConfig.brandName}
          className="h-12 mb-8 object-contain"
        />
      ) : (
        <p className="text-xl font-bold mb-8 text-foreground">
          {brandConfig.brandName}
        </p>
      )}

      <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-muted">
        <Icon className="w-7 h-7 text-muted-foreground" />
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-3">{heading}</h1>

      <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
        {body}
      </p>

      <div className="flex items-center gap-3">
        <a
          href={supportHref}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <LifeBuoy className="w-4 h-4" />
          Contact support
        </a>

        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
