"use client";

import { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/lib/routes";
import { ILoginPayload } from "@shared/core";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultApiResponse } from "@/utils/resources";
import { encryptPassword } from "@/utils/encryption";
import { getApiErrorMessage } from "@/utils/apiClient";
import DisplayRespondsMessage from "@/components/DisplayResponse";
import { useUserStore } from "@/state/userStore";
import { BrandIcon } from "@/components/shared/BrandIcon";
import { BrandConfigService } from "@shared/core";
import { motion } from "framer-motion";
import { useGetEncryptionPublicKey } from "@/hooks/queries/useAuthQueries";
import { useLogin } from "@/hooks/mutations/useAuthMutations";

const FormSchema = z.object({
  email: z.email("Please enter a valid email").nonempty("Email is required"),

  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters")
    .nonempty("Password is required"),
});

export default function Login() {
  const brandConfig = BrandConfigService.getConfigSync("dashboard");
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);
  const { data: publicKey } = useGetEncryptionPublicKey();
  const { mutate: loginMutation, isPending: isLoggingIn } = useLogin();
  const navigate = useNavigate();
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
      navigate(APP_ROUTES.ACCOUNT.DASHBOARD);
    }
  }, [isLoggedIn, navigate]);
  if (isLoggedIn) return null;

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    setApiResponse(defaultApiResponse);

    if (!publicKey) {
      toast.error("Encryption key not found");
      setApiResponse({
        display: true,
        status: false,
        message: "Encryption key not found",
      });
      return;
    }

    try {
      const encryptedPassword = await encryptPassword(
        formData.password,
        publicKey.data.public_key,
      );
      const payload: ILoginPayload = {
        email: formData.email,
        encrypted_password: encryptedPassword,
      };

      loginMutation(payload, {
        onSuccess: (response) => {
          toast.success("Logged in successfully");
          _setTempLoginData(payload);

          reset();
          navigate(APP_ROUTES.AUTH.VERIFY(response.data.session_id));
        },
        onError: (error) => {
          const message = getApiErrorMessage(
            error,
            "Email or password incorrect",
          );
          toast.error(message);
          setApiResponse({
            display: true,
            status: false,
            message,
          });
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Signature Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_400px_at_50%_0%,hsl(var(--primary)/0.12),transparent)] pointer-events-none" />

      {/* Floating Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-3xl rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10 space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center shadow-sm"
          >
            <BrandIcon
              containerClassName="flex items-center justify-center"
              imageClassName="h-6 w-6 object-contain"
              size={24}
            />
          </motion.div>
          <div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-sans text-3xl font-bold tracking-tight text-foreground"
            >
              Welcome to {brandConfig.brandName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-muted-foreground font-medium mt-1 font-sans"
            >
              Organisation Infrastructure
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            boxShadow:
              "0 0 60px -20px hsl(var(--primary)/0.3), 0 0 120px -40px hsl(var(--primary)/0.15)",
          }}
          className="rounded-xl"
        >
          <Card className="border-none bg-surface/60 backdrop-blur-xl group">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl font-bold font-sans tracking-tight">
                Secure Access
              </CardTitle>
              <CardDescription className="text-sm font-medium font-sans">
                Enter your administrative credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="space-y-2"
                >
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
                      placeholder={`admin@${brandConfig.shortBrandName.toLowerCase()}.tech`}
                      {...register("email")}
                      disabled={isSubmitting}
                      className="h-12 bg-muted/30 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 transition-all font-medium font-sans"
                    />
                  </div>
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-destructive text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-destructive" />
                      {errors.email.message}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between ml-1">
                    <Label
                      htmlFor="password"
                      className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      Password
                    </Label>
                    <Link to={APP_ROUTES.AUTH.FORGOT_PASSWORD}>
                      <button
                        type="button"
                        className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tight"
                      >
                        Forgot Password?
                      </button>
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
                      className="h-12 bg-muted/30 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl px-4 transition-all font-medium font-sans"
                    />
                  </div>
                  {errors.password && (
                    <p
                      id="password-error"
                      className="text-destructive text-xs font-bold mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-destructive" />
                      {errors.password.message}
                    </p>
                  )}
                </motion.div>

                <div className="pt-2">
                  <DisplayRespondsMessage response={apiResponse} />
                </div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 shadow-fintech font-bold cursor-pointer rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Securing Session...
                      </>
                    ) : (
                      "Authenticate Account"
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-8 text-center space-y-4"
        >
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">
            Protected by bank-grade encryption
          </p>
          <div className="flex items-center justify-center gap-6 opacity-30">
            <div className="h-6 w-12 bg-muted rounded animate-pulse" />
            <div className="h-6 w-12 bg-muted rounded animate-pulse" />
            <div className="h-6 w-12 bg-muted rounded animate-pulse" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
