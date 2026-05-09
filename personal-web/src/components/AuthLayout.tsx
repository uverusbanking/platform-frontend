import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BrandConfigService } from "@shared/core";

export function AuthLayout() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const brand = BrandConfigService.getConfigSync("personal");

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/account/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-pill animate-spin mx-auto mb-4" />
          <p className="text-foreground-subtle text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left branding panel — desktop only */}
      <div className="hidden lg:flex lg:w-[440px] shrink-0 flex-col justify-between p-10 bg-foreground text-surface-highest relative overflow-hidden">
        {/* Decorative red blur */}
        <div
          className="absolute -right-24 -top-24 w-80 h-80 rounded-pill opacity-50"
          style={{
            background: "rgb(var(--brand-primary))",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -left-16 bottom-0 w-64 h-64 rounded-pill opacity-30"
          style={{
            background: "rgb(var(--brand-primary))",
            filter: "blur(60px)",
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-highest/10 flex items-center justify-center">
            {brand.brandLogoUrl ? (
              <img
                src={brand.brandLogoUrl}
                alt={brand.brandName}
                className="w-5 h-5 object-contain"
              />
            ) : (
              <span className="text-surface-highest font-extrabold text-base tracking-tighter">
                {brand.brandName.charAt(0)}
              </span>
            )}
          </div>
          <span className="font-extrabold text-xl tracking-[-0.04em]">
            {brand.brandName}
          </span>
        </div>

        {/* Tagline */}
        <div className="relative">
          <p
            className="eyebrow mb-4"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {brand.brandName}
          </p>
          <h2
            className="display text-[40px] leading-[1] mb-5"
            style={{ color: "#fff" }}
          >
            Banking
            <br />
            built for{" "}
            <span
              className="serif-italic"
              style={{ color: "rgb(var(--brand-primary))" }}
            >
              you.
            </span>
          </h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
            Secure, instant, and always at your fingertips.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
