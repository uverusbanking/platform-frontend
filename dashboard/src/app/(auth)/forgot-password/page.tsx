"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Mail, Lock, Check } from "lucide-react";
import {
  useForgotPassword,
  useVerifyForgotOTP,
  useResetPassword,
  useResendForgotOTP,
} from "@/hooks/mutations/useAuthMutations";
import { useGetEncryptionPublicKey } from "@/hooks/queries/useAuthQueries";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { encryptPassword } from "@/utils/encryption";
import { getApiErrorMessage } from "@/utils/apiClient";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { APP_ROUTES } from "@/lib/routes";
import { emailSchema } from "@/lib/schemas/fields/email.schema";
import { otpSchema } from "@/lib/schemas/fields/otp.schema";
import { passwordSchema } from "@/lib/schemas/fields/password.schema";
import { BrandIcon } from "@/components/shared/BrandIcon";
import { BrandConfigService } from "@shared/core";

const EmailSchema = z.object({
  email: emailSchema,
});

const OTPSchema = z.object({
  otp: otpSchema,
});

const PasswordSchema = z
  .object({
    new_password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type EmailFormValues = z.infer<typeof EmailSchema>;
type OTPFormValues = z.infer<typeof OTPSchema>;
type PasswordFormValues = z.infer<typeof PasswordSchema>;

export default function ForgotPassword() {
  const brandConfig = BrandConfigService.getConfigSync("dashboard");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();

  const { mutate: forgotPasswordMutation, isPending: isSendingEmail } =
    useForgotPassword();
  const { mutate: verifyOTPMutation, isPending: isVerifyingOTP } =
    useVerifyForgotOTP();
  const { mutate: resetPasswordMutation, isPending: isResettingPassword } =
    useResetPassword();
  const { mutate: resendOTPMutation, isPending: isResendingOTP } =
    useResendForgotOTP();
  const { data: publicKey } = useGetEncryptionPublicKey();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(EmailSchema),
  });

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(OTPSchema),
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordSchema),
  });

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const onEmailSubmit = (data: EmailFormValues) => {
    forgotPasswordMutation(
      {
        email: data.email,
      },
      {
        onSuccess: () => {
          setEmail(data.email);
          setStep(2);
          setResendCountdown(60);
          toast.success("OTP sent to your email");
        },
        onError: (error: unknown) => {
          const message = getApiErrorMessage(error, "Failed to send OTP");
          toast.error(message);
        },
      },
    );
  };

  const onOTPSubmit = (data: OTPFormValues) => {
    verifyOTPMutation(
      {
        email,
        otp: data.otp,
      },
      {
        onSuccess: (response) => {
          setSessionId(response.data.session_id);
          setStep(3);
          toast.success("OTP verified successfully");
        },
        onError: (error: unknown) => {
          const message = getApiErrorMessage(error, "Invalid or expired OTP");
          toast.error(message);
        },
      },
    );
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    if (!publicKey) {
      toast.error("Encryption key not found");
      return;
    }

    try {
      const encryptedPassword = await encryptPassword(
        data.new_password,
        publicKey.data.public_key,
      );

      resetPasswordMutation(
        {
          session_id: sessionId,
          new_password: encryptedPassword,
        },
        {
          onSuccess: () => {
            toast.success("Password reset successfully!", {
              description: "Redirecting to login...",
              onAutoClose: () => navigate(APP_ROUTES.AUTH.LOGIN),
            });
          },
          onError: (error: unknown) => {
            const message = getApiErrorMessage(
              error,
              "Failed to reset password",
            );
            toast.error(message);
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleResendOTP = () => {
    if (resendCountdown > 0) return;

    resendOTPMutation(
      {
        email,
      },
      {
        onSuccess: () => {
          setResendCountdown(60);
          toast.success("New OTP sent to your email");
        },
        onError: (error: unknown) => {
          const message = getApiErrorMessage(error, "Failed to resend OTP");
          toast.error(message);
        },
      },
    );
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Dynamic background elements */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-primary/20 blur-[120px] rounded-full animate-blob pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-success/10 blur-[120px] rounded-full animate-blob [animation-delay:2s] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-warning/10 blur-[100px] rounded-full animate-blob [animation-delay:4s] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <BrandIcon
            containerClassName="inline-flex items-center justify-center p-4 rounded-2xl shadow-fintech animate-bounce-subtle"
            imageClassName="h-8 w-8 object-contain"
            size={32}
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Reset Password
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              {step === 1 && "Enter your email to receive an OTP"}
              {step === 2 && "Enter the 6-digit code sent to your email"}
              {step === 3 && "Create your new password"}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? "w-8 bg-gradient-primary"
                    : s < step
                      ? "w-2 bg-primary"
                      : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-surface/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl font-bold">
              {step === 1 && "Step 1: Email Verification"}
              {step === 2 && "Step 2: OTP Verification"}
              {step === 3 && "Step 3: New Password"}
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              {step === 1 && "We'll send a verification code to your email"}
              {step === 2 && "Check your inbox for the 6-digit code"}
              {step === 3 && "Choose a strong password for your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {/* Step 1: Email */}
              {step === 1 && (
                <motion.form
                  key="email-form"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={`admin@${brandConfig.shortBrandName.toLowerCase()}.tech`}
                        {...emailForm.register("email")}
                        disabled={isSendingEmail}
                        className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl pl-10 transition-all font-medium"
                      />
                    </div>
                    {emailForm.formState.errors.email && (
                      <p className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <span className="w-1 h-1 rounded-full bg-error" />
                        {emailForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 shadow-fintech font-bold cursor-pointer rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                    disabled={isSendingEmail}
                  >
                    {isSendingEmail ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </motion.form>
              )}

              {/* Step 2: OTP */}
              {step === 2 && (
                <motion.form
                  key="otp-form"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  onSubmit={otpForm.handleSubmit(onOTPSubmit)}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="otp"
                      className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
                    >
                      6-Digit OTP Code
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      {...otpForm.register("otp")}
                      disabled={isVerifyingOTP}
                      className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl text-center text-2xl tracking-[0.5em] font-bold transition-all"
                    />
                    {otpForm.formState.errors.otp && (
                      <p className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <span className="w-1 h-1 rounded-full bg-error" />
                        {otpForm.formState.errors.otp.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-muted-foreground hover:text-primary font-medium transition-colors"
                    >
                      Change email
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendCountdown > 0 || isResendingOTP}
                      className="text-primary hover:underline font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isResendingOTP
                        ? "Resending..."
                        : resendCountdown > 0
                          ? `Resend in ${resendCountdown}s`
                          : "Resend OTP"}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-fintech font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                    disabled={isVerifyingOTP}
                  >
                    {isVerifyingOTP ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                </motion.form>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <motion.form
                  key="password-form"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="new_password"
                      className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new_password"
                        type="password"
                        placeholder="••••••••"
                        {...passwordForm.register("new_password")}
                        disabled={isResettingPassword}
                        className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl pl-10 transition-all font-medium"
                      />
                    </div>
                    {passwordForm.formState.errors.new_password && (
                      <p className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <span className="w-1 h-1 rounded-full bg-error" />
                        {passwordForm.formState.errors.new_password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm_password"
                      className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Check className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm_password"
                        type="password"
                        placeholder="••••••••"
                        {...passwordForm.register("confirm_password")}
                        disabled={isResettingPassword}
                        className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl pl-10 transition-all font-medium"
                      />
                    </div>
                    {passwordForm.formState.errors.confirm_password && (
                      <p className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <span className="w-1 h-1 rounded-full bg-error" />
                        {passwordForm.formState.errors.confirm_password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-fintech font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                    disabled={isResettingPassword}
                  >
                    {isResettingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            to={APP_ROUTES.AUTH.LOGIN}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">
            Protected by bank-grade encryption
          </p>
        </div>
      </div>
    </div>
  );
}
