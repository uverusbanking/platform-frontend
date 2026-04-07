import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ArrowRight } from "lucide-react";
import { BrandConfigService } from "@shared/core";

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", full_name: "", phone_number: "" });
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

  const inputClass = "h-12 bg-surface-low border-0 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 transition-all duration-150";
  const labelClass = "text-xs font-medium tracking-[0.03em] text-muted-foreground uppercase";

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand / editorial */}
      <div className="hidden lg:flex lg:w-[45%] bg-[hsl(215,30%,15%)] relative overflow-hidden flex-col justify-between p-12">
        {/* Subtle geometric texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(135deg, transparent 40%, hsl(210 60% 55% / 0.3) 40%, hsl(210 60% 55% / 0.3) 41%, transparent 41%),
                            linear-gradient(225deg, transparent 60%, hsl(210 60% 55% / 0.15) 60%, hsl(210 60% 55% / 0.15) 61%, transparent 61%)`,
          backgroundSize: '80px 80px',
        }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[hsl(210,60%,55%)]/10 flex items-center justify-center shrink-0">
              {brand.brandLogoUrl ? (
                <img src={brand.brandLogoUrl} alt={brand.brandName} className="w-6 h-6 object-contain" />
              ) : (
                <Building2 className="h-6 w-6 text-[hsl(210,60%,55%)]" />
              )}
            </div>
            <span className="font-bold text-xl text-[hsl(210,20%,90%)]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {brand.brandName}
            </span>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          <h1
            className="text-[3rem] leading-[1.05] font-extrabold text-[hsl(210,20%,92%)]"
            style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em' }}
          >
            Start your<br />
            corporate<br />
            journey.
          </h1>
          <p className="text-[hsl(215,15%,60%)] text-base max-w-sm leading-relaxed">
            Create an account to begin onboarding your business — fast, secure, and fully digital.
          </p>
        </div>

        {/* Bottom trust line */}
        <div className="relative z-10">
          <p className="text-[hsl(215,15%,45%)] text-xs tracking-[0.05em] uppercase">
            256-bit SSL encrypted · CBN compliant
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-[420px] space-y-10">
          {/* Mobile brand (hidden on lg+) */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              {brand.brandLogoUrl ? (
                <img src={brand.brandLogoUrl} alt={brand.brandName} className="w-5 h-5 object-contain" />
              ) : (
                <Building2 className="h-5 w-5 text-primary" />
              )}
            </div>
            <span className="font-bold text-lg text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {brand.brandName}
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2
              className="text-[2.25rem] font-bold text-foreground leading-tight"
              style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
            >
              Create account
            </h2>
            <p className="text-muted-foreground text-sm">
              Start your corporate account onboarding
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className={labelClass}>Full Name</Label>
                <Input
                  id="full_name"
                  value={form.full_name}
                  onChange={update("full_name")}
                  placeholder="Your legal full name"
                  required
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={labelClass}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@company.com"
                  required
                  className={inputClass}
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="password" className={labelClass}>Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className={inputClass}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-sm text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-none transition-all duration-150 gap-2"
            >
              {loading ? "Creating account…" : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
