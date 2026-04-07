"use client";

import { useEffect, useState } from "react";
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
import Link from "next/link";
import { BrandIcon } from "@/components/layouts/layout/BrandIcon";
import { useGetEncryptionPublicKey } from "@/hooks/endpoints/useAuth";
import { useLogin } from "@/hooks/mutations/useAuthMutations";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultApiResponse, passwordRegex } from "@/lib/resources";
import { encryptPassword } from "@/lib/encryption";
import DisplayRespondsMessage from "@/components/DisplayResponse";
import { useUserStore } from "@/state/userStore";
import { loginSchema } from "@/lib/schemas/auth/login.schema";

const FormSchema = loginSchema;

export default function Login() {
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);
  const { data: publicKey } = useGetEncryptionPublicKey();
  const { mutateAsync: loginMutation } = useLogin();
  const router = useRouter();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const _setTempLoginData = useUserStore((state) => state._setTempLoginData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/account/dashboard");
    }
  }, [isLoggedIn, router]);
  if (isLoggedIn) return null;

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    setApiResponse(defaultApiResponse);
    try {
      if (!publicKey) {
        toast.error("Encryption key not found");
        setApiResponse({
          display: true,
          status: false,
          message: "Encryption key not found",
        });
        return;
      }

      const encryptedPassword = await encryptPassword(
        formData.password,
        publicKey.public_key,
      );
      const payload = {
        email: formData.email,
        type: "PLATFORM",
        encrypted_password: encryptedPassword,
      };

      await loginMutation(payload, {
        onSuccess: (data) => {
          toast.success("Logged in successfully");
          _setTempLoginData(payload);

          reset(); // after submit
          router.replace(`/verify/${data.data.session_id}`);
        },
        onError: (error) => {
          const message =
            error?.response?.data?.message || "Something went wrong";
          toast.error(message);
          setApiResponse({
            display: true,
            status: false,
            message: message,
          });
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error?.response?.data?.message || "An error occurred";
      toast.error(message);
      setApiResponse({
        display: true,
        status: false,
        message,
      });
    }
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
              Welcome to Uverus
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              Admin Banking Infrastructure
            </p>
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-surface/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl font-bold">Secure Access</CardTitle>
            <CardDescription className="text-sm font-medium">
              Enter your administrative credentials to continue
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
                    aria-describedby="email-error"
                    placeholder="admin@uverus.tech"
                    {...register("email")}
                    disabled={isSubmitting}
                    className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 transition-all font-medium"
                  />
                </div>
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-error" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label
                    htmlFor="password"
                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tight"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.password}
                    aria-describedby="password-error"
                    className="h-12 bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 transition-all font-medium"
                  />
                </div>
                {errors.password && (
                  <p
                    id="password-error"
                    className="text-error text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-error" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <DisplayRespondsMessage response={apiResponse} />
              </div>

              <Button
                type="submit"
                className="w-full h-12 cursor-pointer font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Securing Session...
                  </>
                ) : (
                  "Authenticate Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center space-y-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">
            Protected by bank-grade encryption
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
