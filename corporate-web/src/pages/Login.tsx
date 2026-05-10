import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  ArrowRight,
  Shield,
  Send,
  CheckSquare,
  Eye,
} from "lucide-react";
import { BrandConfigService } from "@shared/core";

const DEMO_USERS = [
  {
    label: "Super Admin",
    email: "admin@technovasolutions.com",
    role: "owner" as const,
    icon: Shield,
    description: "Full access to all features",
  },
  {
    label: "Initiator",
    email: "initiator@technovasolutions.com",
    role: "initiator" as const,
    icon: Send,
    description: "Create & submit transactions",
  },
  {
    label: "Authorizer",
    email: "authorizer@technovasolutions.com",
    role: "authorizer" as const,
    icon: CheckSquare,
    description: "Review & approve requests",
  },
  {
    label: "Viewer / Auditor",
    email: "auditor@technovasolutions.com",
    role: "viewer" as const,
    icon: Eye,
    description: "Read-only monitoring",
  },
];

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const brand = BrandConfigService.getConfigSync("corporate");

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (result.success) navigate("/dashboard");
    else setError(result.error ?? "Login failed");
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "rgb(var(--background))" }}
    >
      {/* Left panel — dark ink with blue glow */}
      <div
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "rgb(var(--foreground))" }}
      >
        {/* Dot grid texture */}
        <div className="absolute inset-0 dot-grid opacity-40" />

        {/* Blue radial glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-20%",
            right: "-10%",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgb(var(--brand-primary) / 0.3) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10">
          <div className="logo-mark flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgb(var(--brand-primary) / 0.15)" }}
            >
              {brand.brandLogoUrl ? (
                <img
                  src={brand.brandLogoUrl}
                  alt={brand.brandName}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <Building2
                  className="h-6 w-6"
                  style={{ color: "rgb(var(--brand-primary))" }}
                />
              )}
            </div>
            <span
              className="font-bold text-xl"
              style={{
                fontFamily: "Manrope, sans-serif",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {brand.brandName}
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-5">
          <h1
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "clamp(2.25rem, 4vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "rgba(255,255,255,0.95)",
            }}
          >
            Corporate
            <br />
            onboarding,{" "}
            <span
              className="serif-italic"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              simplified.
            </span>
          </h1>
          <p
            className="text-base max-w-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Open accounts, manage compliance, and track approvals — all from one
            powerful portal.
          </p>
        </div>

        <div className="relative z-10">
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Trusted by 2,400+ businesses
          </p>
        </div>
      </div>

      {/* Right panel — warm form */}
      <div
        className="flex-1 flex items-center justify-center p-6 sm:p-12"
        style={{ background: "rgb(var(--background))" }}
      >
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile brand */}
          <div className="flex items-center gap-3 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgb(var(--soft))" }}
            >
              {brand.brandIconUrl ? (
                <img
                  src={brand.brandIconUrl}
                  alt={brand.brandName}
                  className="w-5 h-5 object-contain"
                />
              ) : (
                <Building2
                  className="h-5 w-5"
                  style={{ color: "rgb(var(--brand-primary))" }}
                />
              )}
            </div>
            <span
              className="font-bold text-lg"
              style={{
                fontFamily: "Manrope, sans-serif",
                color: "rgb(var(--foreground))",
              }}
            >
              {brand.brandName}
            </span>
          </div>

          <div>
            <p className="eyebrow mb-2">Corporate portal</p>
            <h2
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "2rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "rgb(var(--foreground))",
              }}
            >
              Welcome back
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "rgb(var(--foreground-subtle))" }}
            >
              Sign in to your corporate onboarding portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="p-3 text-sm rounded-xl"
                style={{
                  background: "rgb(var(--destructive) / 0.1)",
                  color: "rgb(var(--destructive))",
                }}
              >
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="eyebrow"
                style={{ color: "rgb(var(--foreground-subtle))" }}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-0 focus-visible:ring-2"
                style={{ background: "rgb(var(--surface))" }}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="eyebrow"
                style={{ color: "rgb(var(--foreground-subtle))" }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl border-0 focus-visible:ring-2"
                style={{ background: "rgb(var(--surface))" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-pill btn-primary w-full h-12 justify-center text-sm disabled:opacity-50"
            >
              {loading ? (
                "Signing in…"
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </form>

          <p
            className="text-center text-sm"
            style={{ color: "rgb(var(--foreground-subtle))" }}
          >
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold hover:opacity-70"
              style={{ color: "rgb(var(--brand-primary))" }}
            >
              Register
            </Link>
          </p>

          {/* Demo accounts */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="h-px flex-1"
                style={{ background: "rgb(var(--border))" }}
              />
              <span className="eyebrow">Demo accounts</span>
              <div
                className="h-px flex-1"
                style={{ background: "rgb(var(--border))" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.role}
                  type="button"
                  onClick={async () => {
                    setLoading(true);
                    const result = await login(u.email, "demo");
                    setLoading(false);
                    if (result.success) navigate("/dashboard");
                  }}
                  disabled={loading}
                  className="flex items-start gap-2.5 p-3 rounded-xl text-left transition-colors"
                  style={{
                    background: "rgb(var(--surface))",
                    border: "1px solid rgb(var(--border))",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgb(var(--surface-high))")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgb(var(--surface))")
                  }
                >
                  <u.icon
                    className="h-4 w-4 mt-0.5 shrink-0"
                    style={{ color: "rgb(var(--foreground-subtle))" }}
                  />
                  <div className="min-w-0">
                    <p
                      className="text-sm font-semibold leading-tight"
                      style={{ color: "rgb(var(--foreground))" }}
                    >
                      {u.label}
                    </p>
                    <p
                      className="text-[11px] leading-snug mt-0.5"
                      style={{ color: "rgb(var(--foreground-subtle))" }}
                    >
                      {u.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
