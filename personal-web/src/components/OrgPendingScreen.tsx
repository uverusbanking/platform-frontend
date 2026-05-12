import { Clock, LogOut, LifeBuoy } from "lucide-react";
import type { BrandConfig } from "@shared/core";

interface OrgPendingScreenProps {
  brandConfig: BrandConfig;
}

export function OrgPendingScreen({ brandConfig }: OrgPendingScreenProps) {
  const supportHref = brandConfig.supportEmail
    ? `mailto:${brandConfig.supportEmail}`
    : (brandConfig.websiteUrl ?? "https://uverus.com/contact");

  const handleSignOut = () => {
    sessionStorage.removeItem("sb-access-token");
    sessionStorage.removeItem("sb-session-id");
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
        <Clock className="w-7 h-7 text-muted-foreground" />
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-3">
        We&rsquo;re getting things ready
      </h1>

      <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
        {brandConfig.brandName} is currently under review. You&rsquo;ll receive
        an email once your account is live and ready to use.
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
