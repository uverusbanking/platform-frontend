"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultApiResponse } from "@/lib/resources";
import DisplayRespondsMessage from "@/components/DisplayResponse";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AnimatePresence, motion } from "framer-motion";

import {
  useForgotPassword,
  useVerifyForgotOtp,
  useGetEncryptionPublicKey,
} from "@/hooks/endpoints/useAuth";
import { VerifyOtpResponse } from "@shared/core";
import { useResetPassword } from "@/hooks/mutations/useAuthMutations";
import { encryptPassword } from "@/lib/encryption";
import { emailSchema } from "@/lib/schemas/fields/email.schema";
import { otpSchema } from "@/lib/schemas/fields/otp.schema";
import { passwordSchema } from "@/lib/schemas/fields/password.schema";
import { BrandIcon } from "@/components/layouts/layout/BrandIcon";

// Validation Schemas
const EmailSchema = z.object({
  email: emailSchema,
});

const OtpSchema = z.object({
  otp: otpSchema,
});

const ResetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Step = "EMAIL" | "OTP" | "RESET";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiError | undefined;
  return apiError?.response?.data?.message || fallback;
};

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [sessionId, setSessionId] = useState("");

  // Components relative to step
  const renderStep = () => {
    switch (step) {
      case "EMAIL":
        return (
          <EmailStep
            onSuccess={(email) => {
              setEmail(email);
              setStep("OTP");
            }}
          />
        );
      case "OTP":
        return (
          <OtpStep
            email={email}
            onSuccess={(sid) => {
              setSessionId(sid);
              setStep("RESET");
            }}
            onBack={() => setStep("EMAIL")}
          />
        );
      case "RESET":
        return <ResetStep sessionId={sessionId} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* dynamic background elements */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-primary/20 blur-[120px] rounded-full animate-blob pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-success/10 blur-[120px] rounded-full animate-blob [animation-delay:2s] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-warning/10 blur-[100px] rounded-full animate-blob [animation-delay:4s] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Step 1: Email Form
function EmailStep({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);
  const { mutateAsync: forgotPasswordMutation } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(EmailSchema),
    mode: "onChange",
  });

  const onSubmit = async (formData: z.infer<typeof EmailSchema>) => {
    setApiResponse(defaultApiResponse);

    try {
      await forgotPasswordMutation({
        email: formData.email,
      });

      toast.success("Recovery link sent to your email");
      onSuccess(formData.email);
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Failed to send recovery link. Please try again.",
      );
      toast.error(message);
      setApiResponse({
        display: true,
        status: false,
        message,
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10 space-y-4">
        <BrandIcon
          containerClassName="inline-flex items-center justify-center p-4 rounded-2xl shadow-fintech animate-bounce-subtle"
          imageClassName="h-8 w-8 object-contain"
          size={32}
        />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Account Recovery
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Admin Banking Infrastructure
          </p>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-surface/60 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-50 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-xl font-bold">Forgot Password?</CardTitle>
          <CardDescription className="text-sm font-medium">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  aria-invalid={!!errors.email}
                  placeholder="admin@uverus.tech"
                  {...register("email")}
                  disabled={isSubmitting}
                  className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 pl-11 transition-all font-medium"
                />
                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground/50" />
              </div>
              {errors.email && (
                <p className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <span className="w-1 h-1 rounded-full bg-error" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <DisplayRespondsMessage response={apiResponse} />
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending Link...
                </>
              ) : (
                "Send Recovery Link"
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Step 2: OTP Verification
function OtpStep({
  email,
  onSuccess,
  onBack,
}: {
  email: string;
  onSuccess: (sessionId: string) => void;
  onBack: () => void;
}) {
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);
  const { mutateAsync: verifyOtpMutation } = useVerifyForgotOtp();
  const [otpValue, setOtpValue] = useState("");

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(OtpSchema),
    mode: "onChange",
  });

  const onSubmit = async () => {
    setApiResponse(defaultApiResponse);

    verifyOtpMutation(
      {
        email,
        otp: otpValue,
      },
      {
        onSuccess: (data: VerifyOtpResponse) => {
          const session = data.session_id ?? data.data?.session_id;
          if (!session) {
            const message =
              "Verification succeeded but session was missing. Please try again.";
            toast.error(message);
            setApiResponse({
              display: true,
              status: false,
              message,
            });
            return;
          }
          toast.success("OTP verified successfully");
          onSuccess(session); // Handle varying response structure
        },
        onError: (error: unknown) => {
          const message = getErrorMessage(
            error,
            "Invalid OTP or expired. Please try again.",
          );
          toast.error(message);
          setApiResponse({
            display: true,
            status: false,
            message,
          });
        },
      },
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10 space-y-4">
        <BrandIcon
          containerClassName="inline-flex items-center justify-center p-4 bg-gradient-primary rounded-2xl shadow-fintech animate-bounce-subtle"
          imageClassName="h-8 w-8 object-contain"
          size={32}
        />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Verify Identity
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Admin Banking Infrastructure
          </p>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-surface/60 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-50 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-xl font-bold text-center">
            Enter Verification Code
          </CardTitle>
          <CardDescription className="text-sm font-medium text-center">
            We sent a 6-digit code to{" "}
            <span className="font-bold text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col items-center"
          >
            <div className="space-y-2">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => {
                  setOtpValue(value);
                  setValue("otp", value);
                }}
                disabled={isSubmitting}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="w-full">
              <DisplayRespondsMessage response={apiResponse} />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-fintech font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
              disabled={isSubmitting || otpValue.length !== 6}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Change Email
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Step 3: Reset Password
function ResetStep({ sessionId }: { sessionId: string }) {
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);
  const { mutateAsync: resetPasswordMutation } = useResetPassword();
  const { data: encryptionKey } = useGetEncryptionPublicKey();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (formData: z.infer<typeof ResetPasswordSchema>) => {
    if (!encryptionKey?.public_key) {
      toast.error("Encryption key not found. Please try again.");
      return;
    }

    setApiResponse(defaultApiResponse);

    try {
      const encryptedPassword = await encryptPassword(
        formData.password,
        encryptionKey.public_key,
      );

      await resetPasswordMutation({
        session_id: sessionId,
        new_password: encryptedPassword,
      });

      toast.success("Password reset successfully");
      router.push("/");
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Failed to reset password. Please try again.",
      );
      toast.error(message);
      setApiResponse({
        display: true,
        status: false,
        message,
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10 space-y-4">
        <BrandIcon
          containerClassName="inline-flex items-center justify-center p-4 bg-gradient-primary rounded-2xl shadow-fintech animate-bounce-subtle"
          imageClassName="h-8 w-8 object-contain"
          size={32}
        />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Reset Password
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Admin Banking Infrastructure
          </p>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-surface/60 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-50 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-xl font-bold">New Password</CardTitle>
          <CardDescription className="text-sm font-medium">
            Create a strong password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  aria-invalid={!!errors.password}
                  {...register("password")}
                  disabled={isSubmitting}
                  className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 pl-11 pr-10 transition-all font-medium"
                />
                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground/50" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <span className="w-1 h-1 rounded-full bg-error" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                  disabled={isSubmitting}
                  className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 pl-11 pr-10 transition-all font-medium"
                />
                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground/50" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <span className="w-1 h-1 rounded-full bg-error" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <DisplayRespondsMessage response={apiResponse} />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-fintech font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
