import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { BrandConfigService } from "@shared/core";
import { useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    loading: authLoading,
    signIn,
    setPendingCredentials,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);

  const [email, setEmail] = useState(
    (location.state as { email?: string })?.email || "",
  );
  const [password, setPassword] = useState("");
  const brand = BrandConfigService.getConfigSync("personal");
  const isRegistered = (location.state as { registered?: boolean })?.registered;

  useEffect(() => {
    if (!authLoading && user) navigate("/account/dashboard", { replace: true });
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div
          className="w-12 h-12 border-4 border-t-transparent rounded-pill animate-spin"
          style={{
            borderColor: "rgb(var(--brand-primary))",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      loginSchema.parse({ email, password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }
    setLoading(true);
    const { error, needsVerification } = (await signIn(email, password)) as {
      error?: { message: string };
      needsVerification?: boolean;
    };
    if (needsVerification) {
      setPendingCredentials(email, password);
      setVerificationRequired(true);
      setLoading(false);
      return;
    }
    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Invalid email or password. Please try again."
          : error.message,
      );
      setLoading(false);
      return;
    }
    navigate("/account/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Helmet>
        <title>Login — {brand.brandName}</title>
        <meta
          name="description"
          content={`Login to your ${brand.brandName} account.`}
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Left branding panel */}
      <div
        className="hidden lg:flex lg:w-[440px] shrink-0 flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: "rgb(var(--foreground))", color: "#fff" }}
      >
        <div
          className="absolute -right-24 -top-24 w-80 h-80 rounded-pill opacity-50 pointer-events-none"
          style={{
            background: "rgb(var(--brand-primary))",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -left-16 bottom-0 w-64 h-64 rounded-pill opacity-30 pointer-events-none"
          style={{
            background: "rgb(var(--brand-primary))",
            filter: "blur(60px)",
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            {brand.brandLogoUrl ? (
              <img
                src={brand.brandLogoUrl}
                alt={brand.brandName}
                className="w-5 h-5 object-contain"
              />
            ) : (
              <span
                className="font-extrabold text-base"
                style={{ color: "#fff" }}
              >
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
          {verificationRequired ? (
            <div>
              <div className="text-center mb-6">
                <div
                  className="w-14 h-14 rounded-pill flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgb(var(--lemon) / 0.3)" }}
                >
                  <Mail size={24} style={{ color: "rgb(var(--foreground))" }} />
                </div>
                <h1 className="display text-2xl mb-1">Verification required</h1>
                <p className="text-foreground-subtle text-sm">
                  Your email hasn't been verified yet
                </p>
              </div>

              <div
                className="rounded-2xl p-5 mb-5"
                style={{
                  background: "rgb(var(--surface-highest))",
                  border: "1px solid rgb(var(--surface-high))",
                }}
              >
                <p className="font-semibold text-sm text-center mb-3 break-all">
                  {email}
                </p>
                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={16}
                    className="shrink-0 mt-0.5"
                    style={{ color: "rgb(var(--mint-deep))" }}
                  />
                  <div className="text-sm">
                    <p className="font-semibold mb-0.5">We've sent a code</p>
                    <p className="text-foreground-subtle text-xs leading-relaxed">
                      Check your inbox for the 6-digit code to continue.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate("/auth/verify-otp", {
                    state: { email, fromLogin: true },
                  })
                }
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity mb-3"
              >
                Enter Verification Code <ArrowRight size={14} />
              </button>
              <button
                onClick={() => setVerificationRequired(false)}
                className="w-full text-center text-sm text-foreground-subtle hover:text-foreground transition-colors py-2"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-7">
                <p className="eyebrow mb-2">Welcome back</p>
                <h1 className="display text-[clamp(28px,4vw,40px)] m-0 leading-none">
                  Sign in to{" "}
                  <span
                    className="serif-italic"
                    style={{ color: "rgb(var(--brand-primary))" }}
                  >
                    {brand.shortBrandName}.
                  </span>
                </h1>
              </div>

              {error && (
                <div
                  className="p-4 rounded-2xl text-sm mb-5"
                  style={{
                    background: "rgb(var(--soft))",
                    border: "1px solid rgb(var(--brand-primary) / 0.2)",
                    color: "rgb(var(--brand-primary))",
                  }}
                >
                  {error}
                </div>
              )}

              {isRegistered && (
                <div
                  className="p-4 rounded-2xl mb-5 flex items-start gap-3"
                  style={{
                    background: "rgb(var(--mint))",
                    border: "1px solid rgb(var(--mint-deep) / 0.3)",
                  }}
                >
                  <CheckCircle
                    size={16}
                    className="shrink-0 mt-0.5"
                    style={{ color: "rgb(var(--mint-deep))" }}
                  />
                  <div className="text-sm">
                    <p
                      className="font-semibold mb-0.5"
                      style={{ color: "rgb(var(--mint-deep))" }}
                    >
                      Registration Successful!
                    </p>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "rgb(var(--mint-deep) / 0.8)" }}
                    >
                      Welcome to {brand.brandName}. Please sign in with your
                      password.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="password"
                      className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide"
                    >
                      Password
                    </Label>
                    <Link
                      to="/auth/forgot-password"
                      className="text-xs font-semibold text-foreground-subtle hover:text-foreground transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="h-12 rounded-xl pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity disabled:opacity-60 mt-2"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  {loading
                    ? "Signing in…"
                    : `Sign In to ${brand.shortBrandName}`}
                </button>
              </form>

              <p
                className="text-sm text-foreground-subtle text-center mt-7 pt-5"
                style={{ borderTop: "1px solid rgb(var(--surface-high))" }}
              >
                Don't have an account?{" "}
                <Link
                  to="/auth/register"
                  className="font-bold text-foreground hover:text-brand-primary transition-colors"
                >
                  Create your account
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
