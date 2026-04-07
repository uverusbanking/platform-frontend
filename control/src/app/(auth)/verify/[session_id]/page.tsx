"use client";

import { useState, use, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultApiResponse } from "@/lib/resources";
import DisplayRespondsMessage from "@/components/DisplayResponse";
import { useUserStore } from "@/state/userStore";
import { useVerifyLogin } from "@/hooks/mutations/useAuthMutations";
import { useLogin } from "@/hooks/mutations/useAuthMutations";
import { codeSchema } from "@/lib/schemas/fields/code.schema";
import { resolveUserPermissions } from "@/auth/resolveUserPermissions";
import { IVerifyLoginResponse } from "@/types/auth.types";
import { ResendLoginResponse } from "@shared/core";
import { BrandIcon } from "@/components/layouts/layout/BrandIcon";
import { IApiResponse, TErrorResponse } from "@/types/apiResponse.type";

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as TErrorResponse | undefined;
  return apiError?.data?.message || fallback;
};

const FormSchema = z.object({
  code: codeSchema,
});

export default function Verify({
  params,
}: {
  params: Promise<{ session_id: string }>;
}) {
  const { session_id } = use(params);
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);
  const router = useRouter();
  const _loginUser = useUserStore((state) => state._loginUser);
  const tempLoginData = useUserStore((state) => state.tempLoginData);
  const { mutateAsync: verifyLoginMutation } = useVerifyLogin();
  const { mutate: loginMutation, isPending: isResending } = useLogin();
  const [countdown, setCountdown] = useState(0);

  // handle resend countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    setApiResponse(defaultApiResponse);
    try {
      const payload = {
        code: formData.code,
        session_id: session_id,
      };

      await verifyLoginMutation(payload, {
        onSuccess: (data: IApiResponse<IVerifyLoginResponse>) => {
          toast.success("Logged in successfully");
          const userWithPermissions = resolveUserPermissions(data.data.user);
          _loginUser(
            userWithPermissions,
            data.data.access_token,
            data.data.session_id || session_id,
          );

          reset(); // after submit
          router.replace("/account/dashboard");
        },
        onError: (error: unknown) => {
          const message = getErrorMessage(error, "Something went wrong");
          toast.error(message);
          setApiResponse({
            display: true,
            status: false,
            message: message,
          });
        },
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Something went wrong");
      toast.error(message);
      setApiResponse({
        display: true,
        status: false,
        message,
      });
    }
  };

  const handleResend = () => {
    if (countdown > 0 || isResending) return;

    if (!tempLoginData) {
      toast.error("Please login again to request a new code");
      router.push("/");
      return;
    }

    setCountdown(30);
    loginMutation(tempLoginData, {
      onSuccess: (data: IApiResponse<ResendLoginResponse>) => {
        toast.success("A new verification code has been sent.");
        // Update URL if session ID changed (though typically it stays same)
        if (data?.data?.session_id && data.data.session_id !== session_id) {
          router.replace(`/verify/${data.data.session_id}`);
        }
      },
      onError: (error: unknown) => {
        setCountdown(0);
        const message = getErrorMessage(error, "Failed to resend code");
        toast.error(message);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* dynamic background elements */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-primary/20 blur-[120px] rounded-full animate-blob pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-success/10 blur-[120px] rounded-full animate-blob [animation-delay:2s] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-warning/10 blur-[100px] rounded-full animate-blob [animation-delay:4s] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-10 space-y-4">
          <BrandIcon
            containerClassName="inline-flex items-center justify-center p-4 rounded-2xl shadow-fintech animate-bounce-subtle"
            imageClassName="h-8 w-8 object-contain"
            size={32}
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Verify Identity
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              Multi-factor Authentication Required
            </p>
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-surface/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl font-bold">
              Two-Step Verification
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Enter the 6-digit code sent to your registered email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="code"
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Verification Code <span className="text-error">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="code"
                    type="text"
                    placeholder="••••••"
                    {...register("code")}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.code}
                    aria-describedby="code-error"
                    maxLength={6}
                    className="h-14 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 transition-all font-bold text-2xl tracking-[0.5em] text-center"
                  />
                </div>
                {errors.code && (
                  <p
                    id="code-error"
                    className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-error" />
                    {errors.code.message}
                  </p>
                )}
              </div>

              <DisplayRespondsMessage response={apiResponse} />

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  className="w-full h-12 font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authorizing...
                    </>
                  ) : (
                    "Verify & Access Dashboard"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || isResending}
                  className="w-full text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Requesting New Code...
                    </>
                  ) : countdown > 0 ? (
                    `Resend code in ${countdown}s`
                  ) : (
                    "Didn't receive a code? Resend"
                  )}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center space-y-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">
            Your session is protected by HMAC encryption
          </p>
          <div className="flex items-center justify-center gap-6 opacity-30">
            <div className="h-6 w-12 bg-muted rounded animate-pulse" />
            <div className="h-6 w-12 bg-muted rounded animate-pulse" />
            <div className="h-6 w-12 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
