import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, ArrowLeft, Mail, RefreshCw, CheckCircle } from "lucide-react";
import { BrandConfigService } from "@shared/core";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    verifyOTP,
    verifyAndAuthenticate,
    resendOTP,
    pendingEmail,
    pendingPassword,
  } = useAuth();
  const brandConfig = BrandConfigService.getConfigSync("personal");

  const email = location.state?.email || pendingEmail;
  const fromLogin = location.state?.fromLogin;
  const is2FA = location.state?.is2FA;
  const fromRegistration = location.state?.fromRegistration;
  const hasPassword = pendingPassword || false;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!email) navigate("/auth/register");
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (hasPassword && pendingPassword) {
      const { error } = await verifyAndAuthenticate(
        email,
        otp,
        pendingPassword,
        fromRegistration,
      );
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setVerified(true);
      setSuccess(
        is2FA
          ? "Verification successful! Signing you in..."
          : "Email verified successfully! Signing you in...",
      );
      setTimeout(() => navigate("/account/dashboard"), 1500);
    } else {
      const { error } = await verifyOTP(email, otp, fromRegistration);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setVerified(true);
      setSuccess("Verification successful!");
      setTimeout(
        () => navigate(fromLogin ? "/account/dashboard" : "/auth/login"),
        1500,
      );
    }
  };

  const handleResend = async () => {
    setError(null);
    setSuccess(null);
    setResending(true);
    const { error } = await resendOTP(email);
    if (error) {
      setError(error.message);
      setResending(false);
      return;
    }
    setSuccess(
      "A new verification code has been sent. Please check your inbox and spam folder.",
    );
    setCountdown(60);
    setOtp("");
    setResending(false);
  };

  useEffect(() => {
    if (otp.length === 6 && !loading && !verified) handleVerify();
  }, [otp]);

  if (!email) return null;

  return (
    <div>
      <button
        onClick={() => navigate(fromLogin ? "/" : "/auth/register")}
        className="inline-flex items-center gap-2 text-sm text-foreground-subtle hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <div className="text-center mb-7">
        <div
          className={`w-14 h-14 rounded-pill flex items-center justify-center mx-auto mb-4`}
          style={{
            background: verified ? "rgb(var(--mint))" : "rgb(var(--soft))",
          }}
        >
          {verified ? (
            <CheckCircle size={24} style={{ color: "rgb(var(--mint-deep))" }} />
          ) : (
            <Mail size={24} style={{ color: "rgb(var(--brand-primary))" }} />
          )}
        </div>
        <h1 className="display text-2xl mb-1">
          {verified
            ? "Verification successful!"
            : is2FA
              ? "Verify your identity"
              : "Verify your email"}
        </h1>
        <p className="text-foreground-subtle text-sm">
          {verified ? (
            "Redirecting you securely…"
          ) : (
            <>
              {is2FA
                ? "Enter the 6-digit security code sent to"
                : "Enter the 6-digit code sent to"}
              <br />
              <span className="font-semibold text-foreground">{email}</span>
            </>
          )}
        </p>
      </div>

      {error && (
        <div
          className="p-4 rounded-2xl text-sm mb-4 text-center"
          style={{
            background: "rgb(var(--soft))",
            border: "1px solid rgb(var(--brand-primary) / 0.2)",
            color: "rgb(var(--brand-primary))",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="p-4 rounded-2xl text-sm mb-4 text-center"
          style={{
            background: "rgb(var(--mint))",
            border: "1px solid rgb(var(--mint-deep) / 0.3)",
            color: "rgb(var(--mint-deep))",
          }}
        >
          {success}
        </div>
      )}

      {!verified && !success && (
        <div
          className="p-4 rounded-2xl text-xs text-foreground-subtle text-center mb-5"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          Check your inbox and spam folder for the verification email from{" "}
          {brandConfig.brandName}.
        </div>
      )}

      {!verified && (
        <div className="flex flex-col items-center gap-5">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                className="w-12 h-14 text-xl rounded-xl"
              />
              <InputOTPSlot
                index={1}
                className="w-12 h-14 text-xl rounded-xl"
              />
              <InputOTPSlot
                index={2}
                className="w-12 h-14 text-xl rounded-xl"
              />
              <InputOTPSlot
                index={3}
                className="w-12 h-14 text-xl rounded-xl"
              />
              <InputOTPSlot
                index={4}
                className="w-12 h-14 text-xl rounded-xl"
              />
              <InputOTPSlot
                index={5}
                className="w-12 h-14 text-xl rounded-xl"
              />
            </InputOTPGroup>
          </InputOTP>

          <button
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Verifying…" : is2FA ? "Verify & Login" : "Verify Email"}
          </button>

          <div className="text-center">
            <p className="text-sm text-foreground-subtle mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resending || countdown > 0}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground-subtle hover:text-foreground transition-colors disabled:opacity-50"
            >
              {resending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyOTP;
