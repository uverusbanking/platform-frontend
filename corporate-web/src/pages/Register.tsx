import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ArrowRight } from "lucide-react";
import { BrandConfigService } from "@shared/core";

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const brand = BrandConfigService.getConfigSync("corporate");

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await register(form);
    setLoading(false);
    if (result.success) navigate("/dashboard");
    else setError(result.error ?? "Registration failed");
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
            Start your
            <br />
            corporate{" "}
            <span
              className="serif-italic"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              journey.
            </span>
          </h1>
          <p
            className="text-base max-w-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Create an account to begin onboarding your business — fast, secure,
            and fully digital.
          </p>
        </div>

        <div className="relative z-10">
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            256-bit SSL encrypted · CBN compliant
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
              Create account
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "rgb(var(--foreground-subtle))" }}
            >
              Start your corporate account onboarding
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
                htmlFor="full_name"
                className="eyebrow"
                style={{ color: "rgb(var(--foreground-subtle))" }}
              >
                Full Name
              </Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={update("full_name")}
                placeholder="Your legal full name"
                required
                className="h-12 rounded-xl border-0 focus-visible:ring-2"
                style={{ background: "rgb(var(--surface))" }}
              />
            </div>
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
                value={form.email}
                onChange={update("email")}
                placeholder="you@company.com"
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
                value={form.password}
                onChange={update("password")}
                placeholder="Min. 8 characters"
                required
                minLength={8}
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
                "Creating account…"
              ) : (
                <>
                  Create account <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </form>

          <p
            className="text-center text-sm"
            style={{ color: "rgb(var(--foreground-subtle))" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold hover:opacity-70"
              style={{ color: "rgb(var(--brand-primary))" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
