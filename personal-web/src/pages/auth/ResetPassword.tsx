import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useResetPassword } from "@/hooks/mutations/useAuthMutations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { z } from "zod";
import { encryptPassword } from "@shared/core";
import { AuthService } from "@/services";

const resetPasswordSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    otp: z
      .string()
      .min(6, "Reset code must be 6 digits")
      .max(6, "Reset code must be 6 digits"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: resetPasswordMutate, isPending } = useResetPassword();

  const [email] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      resetPasswordSchema.parse({ email, otp, newPassword, confirmPassword });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }
    try {
      const keyResponse = await AuthService.getPublicKey();
      const encryptedPassword = await encryptPassword(
        newPassword,
        keyResponse.data.public_key,
      );
      await resetPasswordMutate({ email, otp, newPassword: encryptedPassword });
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        (err as Error).message ||
          "Invalid reset code or expired. Please try again.",
      );
    }
  };

  if (success) {
    return (
      <div>
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-pill flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgb(var(--mint))" }}
          >
            <CheckCircle size={24} style={{ color: "rgb(var(--mint-deep))" }} />
          </div>
          <h1 className="display text-2xl mb-1">Password Reset</h1>
          <p className="text-foreground-subtle text-sm">
            Your password has been successfully reset
          </p>
        </div>

        <div
          className="rounded-2xl p-5 mb-5"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          <div className="flex items-start gap-3">
            <Shield
              size={16}
              className="shrink-0 mt-0.5"
              style={{ color: "rgb(var(--mint-deep))" }}
            />
            <div className="text-sm">
              <p className="font-semibold mb-0.5">
                Password updated successfully
              </p>
              <p className="text-xs text-foreground-subtle leading-relaxed">
                You can now sign in with your new password. Keep it secure and
                don't share it with anyone.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity"
        >
          Continue to Login <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/auth/forgot-password")}
        className="inline-flex items-center gap-2 text-sm text-foreground-subtle hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <div className="mb-7">
        <p className="eyebrow mb-2">Password recovery</p>
        <h1 className="display text-[clamp(24px,3.5vw,36px)] m-0 leading-none">
          Reset your{" "}
          <span
            className="serif-italic"
            style={{ color: "rgb(var(--brand-primary))" }}
          >
            password.
          </span>
        </h1>
        <p className="text-foreground-subtle text-sm mt-2">
          Enter the reset code and your new password
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
            value={email}
            required
            readOnly
            disabled={isPending}
            className="h-12 rounded-xl opacity-60"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="otp"
            className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide"
          >
            Reset Code
          </Label>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
            disabled={isPending}
            className="h-12 rounded-xl text-center tracking-widest"
            maxLength={6}
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="newPassword"
            className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide"
          >
            New Password
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isPending}
              className="h-12 rounded-xl pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-foreground-subtle">
            Must be at least 8 characters
          </p>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide"
          >
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isPending}
              className="h-12 rounded-xl pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Resetting…
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>

      <p
        className="text-sm text-foreground-subtle text-center mt-6 pt-5"
        style={{ borderTop: "1px solid rgb(var(--surface-high))" }}
      >
        Didn't receive the code?{" "}
        <Link
          to="/auth/forgot-password"
          className="font-bold text-foreground hover:text-brand-primary transition-colors"
        >
          Try again
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;
