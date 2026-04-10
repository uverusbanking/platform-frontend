import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate("/auth/register");
    }
  }, [email, navigate]);

  // Countdown timer for resend
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

    // If we have pending password (from login or registration), verify and auto-authenticate
    if (hasPassword && pendingPassword) {
      const { error } = await verifyAndAuthenticate(
        email,
        otp,
        pendingPassword,
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

      // Redirect to dashboard after verification
      setTimeout(() => {
        navigate("/account/dashboard");
      }, 1500);
    } else {
      // Just verify OTP without auto-login (for forgot password/default)
      const { error } = await verifyOTP(email, otp);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setVerified(true);
      setSuccess("Verification successful!");

      // Redirect accordingly
      setTimeout(() => {
        navigate(fromLogin ? "/account/dashboard" : "/auth/login");
      }, 1500);
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
      "A new verification code has been sent to your email. Please check your inbox and spam folder.",
    );
    setCountdown(60);
    setOtp("");
    setResending(false);
  };

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !loading && !verified) {
      handleVerify();
    }
  }, [otp]);

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="p-4 safe-top">
        <button
          onClick={() => navigate(fromLogin ? "/auth/login" : "/auth/register")}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors p-2 -ml-2 rounded-lg touch-manipulation active:bg-white/10"
        >
          <ArrowLeft size={20} />
          <span className="font-medium text-sm sm:text-base">Back</span>
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 pb-8 sm:pb-12">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-2 px-4 sm:px-6">
            <div className="mx-auto mb-3 sm:mb-4">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${verified ? "bg-success/10" : "bg-gradient-primary"} flex items-center justify-center`}
              >
                {verified ? (
                  <CheckCircle className="text-success" size={24} />
                ) : (
                  <Mail className="text-white" size={24} />
                )}
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl">
              {verified
                ? "Verification successful!"
                : is2FA
                  ? "Verify your identity"
                  : "Verify your email"}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {verified ? (
                "Redirecting you securely..."
              ) : (
                <>
                  {is2FA
                    ? "Enter the 6-digit security code sent to"
                    : "Enter the 6-digit code sent to"}
                  <br />
                  <span className="font-medium text-foreground">{email}</span>
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-xs sm:text-sm text-center">
                {success}
              </div>
            )}

            {/* Helpful tip */}
            {!verified && !success && (
              <div className="mb-4 p-3 rounded-lg bg-muted/50 text-xs sm:text-sm text-muted-foreground text-center">
                💡 Check your inbox and spam folder for the verification email
                from {brandConfig.brandName}.
              </div>
            )}

            {!verified && (
              <div className="flex flex-col items-center space-y-6">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={loading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-14 text-xl" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-xl" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-xl" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-xl" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-xl" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-xl" />
                  </InputOTPGroup>
                </InputOTP>

                <Button
                  onClick={handleVerify}
                  className="w-full h-11 sm:h-10"
                  variant="gradient"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : is2FA ? (
                    "Verify & Login"
                  ) : (
                    "Verify Email"
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Didn't receive the code?
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResend}
                    disabled={resending || countdown > 0}
                    className="text-primary"
                  >
                    {resending ? (
                      <Loader2 className="animate-spin mr-2" size={16} />
                    ) : (
                      <RefreshCw className="mr-2" size={16} />
                    )}
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOTP;
