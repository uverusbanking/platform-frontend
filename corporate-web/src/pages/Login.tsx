import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error ?? "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand / editorial */}
      <div className="hidden lg:flex lg:w-[45%] bg-[hsl(215,30%,15%)] relative overflow-hidden flex-col justify-between p-12">
        {/* Subtle geometric texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(135deg, transparent 40%, hsl(210 60% 55% / 0.3) 40%, hsl(210 60% 55% / 0.3) 41%, transparent 41%),
                            linear-gradient(225deg, transparent 60%, hsl(210 60% 55% / 0.15) 60%, hsl(210 60% 55% / 0.15) 61%, transparent 61%)`,
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[hsl(210,60%,55%)]/10 flex items-center justify-center shrink-0">
              {brand.brandLogoUrl ? (
                <img
                  src={brand.brandLogoUrl}
                  alt={brand.brandName}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <Building2 className="h-6 w-6 text-[hsl(210,60%,55%)]" />
              )}
            </div>
            <span
              className="font-bold text-xl text-[hsl(210,20%,90%)]"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {brand.brandName}
            </span>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          <h1
            className="text-[3rem] leading-[1.05] font-extrabold text-[hsl(210,20%,92%)]"
            style={{
              fontFamily: "Manrope, sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            Corporate
            <br />
            onboarding,
            <br />
            simplified.
          </h1>
          <p className="text-[hsl(215,15%,60%)] text-base max-w-sm leading-relaxed">
            Open accounts, manage compliance, and track approvals — all from one
            powerful portal.
          </p>
        </div>

        {/* Bottom trust line */}
        <div className="relative z-10">
          <p className="text-[hsl(215,15%,45%)] text-xs tracking-[0.05em] uppercase">
            Trusted by 2,400+ businesses
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-[400px] space-y-10">
          {/* Mobile brand (hidden on lg+) */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              {brand.brandLogoUrl ? (
                <img
                  src={brand.brandLogoUrl}
                  alt={brand.brandName}
                  className="w-5 h-5 object-contain"
                />
              ) : (
                <Building2 className="h-5 w-5 text-primary" />
              )}
            </div>
            <span
              className="font-bold text-lg text-foreground"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {brand.brandName}
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2
              className="text-[2.25rem] font-bold text-foreground leading-tight"
              style={{
                fontFamily: "Manrope, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm">
              Sign in to your corporate onboarding portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium tracking-[0.03em] text-muted-foreground uppercase"
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
                  className="h-12 bg-surface-low border-0 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 transition-all duration-150"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium tracking-[0.03em] text-muted-foreground uppercase"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-surface-low border-0 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 transition-all duration-150"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-none transition-all duration-150 gap-2"
            >
              {loading ? (
                "Signing in…"
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Register
            </Link>
          </p>

          {/* Quick login */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                Demo accounts
              </span>
              <div className="h-px flex-1 bg-border" />
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
                  className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 text-left transition-colors duration-150 group"
                >
                  <u.icon className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {u.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
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
