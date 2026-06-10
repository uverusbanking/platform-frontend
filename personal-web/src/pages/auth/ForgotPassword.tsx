import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForgotPassword } from "@/hooks/mutations/useAuthMutations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Mail,
  CheckCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { mutateAsync: forgotPasswordMutate, isPending } = useForgotPassword();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      forgotPasswordSchema.parse({ email });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }
    try {
      await forgotPasswordMutate({ email });
      setEmailSent(true);
    } catch (err: unknown) {
      setError(
        (err as Error).message || "Something went wrong. Please try again.",
      );
    }
  };

  if (emailSent) {
    return (
      <div>
        <button
          onClick={() => {
            setEmailSent(false);
            setError(null);
          }}
          className="inline-flex items-center gap-2 text-sm text-foreground-subtle hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-pill flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgb(var(--mint))" }}
          >
            <CheckCircle size={24} style={{ color: "rgb(var(--mint-deep))" }} />
          </div>
          <h1 className="display text-2xl mb-1">Check your email</h1>
          <p className="text-foreground-subtle text-sm">
            We've sent password reset instructions
          </p>
        </div>

        <div
          className="rounded-2xl p-5 mb-5 text-center"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          <p className="font-semibold text-sm break-all mb-4">{email}</p>
          <div className="flex items-start gap-3 text-left">
            <Mail
              size={16}
              className="shrink-0 mt-0.5"
              style={{ color: "rgb(var(--brand-primary))" }}
            />
            <div className="text-xs text-foreground-subtle leading-relaxed">
              <p className="font-semibold text-foreground mb-1">
                Password reset code sent
              </p>
              <p>
                Check your inbox and spam folder. The code expires in 15
                minutes.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/auth/reset-password", { state: { email } })}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity"
        >
          Enter Reset Code <ArrowRight size={14} />
        </button>

        <p className="text-xs text-foreground-subtle text-center mt-4">
          Didn't receive the email?{" "}
          <button
            onClick={() => {
              setEmailSent(false);
              setError(null);
            }}
            className="font-semibold underline"
          >
            Try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-sm text-foreground-subtle hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back to Login
      </button>

      <div className="mb-7">
        <p className="eyebrow mb-2">Password recovery</p>
        <h1 className="display text-[clamp(24px,3.5vw,36px)] m-0 leading-none">
          Forgot your{" "}
          <span
            className="serif-italic"
            style={{ color: "rgb(var(--brand-primary))" }}
          >
            password?
          </span>
        </h1>
        <p className="text-foreground-subtle text-sm mt-2">
          Enter your email and we'll send you a reset code
        </p>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide"
          >
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isPending}
            className="h-12 rounded-xl"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending…
            </>
          ) : (
            "Send Reset Code"
          )}
        </button>
      </form>

      <p
        className="text-sm text-foreground-subtle text-center mt-6 pt-5"
        style={{ borderTop: "1px solid rgb(var(--surface-high))" }}
      >
        Remember your password?{" "}
        <Link
          to="/"
          className="font-bold text-foreground hover:text-brand-primary transition-colors"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
