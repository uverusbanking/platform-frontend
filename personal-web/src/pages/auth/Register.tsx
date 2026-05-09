import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { encryptPassword } from "@shared/core";
import { usePublicKey } from "@/hooks/queries/usePublicKey";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, ArrowLeft, Shield, User } from "lucide-react";
import { z } from "zod";
import {
  usePublicValidateBvn,
  useRegister,
} from "@/hooks/mutations/useAuthMutations";
import { toast } from "sonner";

const bvnSchema = z.object({
  bvn: z
    .string()
    .length(11, "BVN must be exactly 11 digits")
    .regex(/^\d+$/, "BVN must contain only digits"),
  phone_number: z
    .string()
    .min(10, "Phone number is required")
    .regex(/^\+?\d{10,14}$/, "Enter a valid phone number"),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please select your date of birth"),
});

const accountSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    gender: z.enum(["MALE", "FEMALE"], {
      errorMap: () => ({ message: "Please select your gender" }),
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface BVNData {
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  dateOfBirth: string;
}
interface Step1Data {
  bvn: string;
  phone_number: string;
  date_of_birth: string;
}

const ErrorBox = ({ message }: { message: string }) => (
  <div
    className="p-4 rounded-2xl text-sm mb-5"
    style={{
      background: "rgb(var(--soft))",
      border: "1px solid rgb(var(--brand-primary) / 0.2)",
      color: "rgb(var(--brand-primary))",
    }}
  >
    {message}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const { setPendingCredentials } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bvn, setBvn] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bvnData, setBvnData] = useState<BVNData | null>(null);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { data: publicKeyData } = usePublicKey();
  const { mutateAsync: validateBvnMutateAsync, isPending: isValidatingBvn } =
    usePublicValidateBvn();
  const { mutateAsync: registerMutateAsync, isPending: isRegistering } =
    useRegister();

  const handleBVNValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      bvnSchema.parse({
        bvn,
        phone_number: phoneNumber,
        date_of_birth: dateOfBirth,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }
    setLoading(true);
    try {
      await validateBvnMutateAsync(
        { bvn, phone_number: phoneNumber, date_of_birth: dateOfBirth },
        {
          onError: (err: unknown) => {
            setError((err as Error).message || "An unexpected error occurred");
          },
          onSuccess: (data) => {
            setBvnData(data.details);
            setStep1Data({
              bvn,
              phone_number: phoneNumber,
              date_of_birth: dateOfBirth,
            });
            setStep(2);
          },
          onSettled: () => {
            setLoading(false);
          },
        },
      );
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred");
    }
    setLoading(false);
  };

  const handleAccountCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      accountSchema.parse({
        email,
        gender,
        password,
        confirmPassword,
        termsAccepted,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }
    if (!bvnData || !step1Data) {
      setError("Session expired. Please start over.");
      setStep(1);
      return;
    }
    setLoading(true);
    try {
      if (!publicKeyData?.data?.public_key) {
        setError("Unable to retrieve encryption key. Please try again.");
        setLoading(false);
        return;
      }
      const encryptedPassword = await encryptPassword(
        password,
        publicKeyData.data.public_key,
      );
      await registerMutateAsync(
        {
          email,
          password: encryptedPassword,
          phone_number: step1Data.phone_number,
          date_of_birth: step1Data.date_of_birth,
          gender,
          first_name: bvnData.firstName,
          last_name: bvnData.lastName,
          bvn: step1Data.bvn,
        },
        {
          onError: (err: unknown) => {
            setError((err as Error).message || "An unexpected error occurred");
          },
          onSuccess: () => {
            toast.success(
              "Account created successfully! Please verify your email.",
            );
            setPendingCredentials(email, password);
            navigate("/auth/verify-otp", {
              state: { email, fromRegistration: true },
            });
          },
          onSettled: () => {
            setLoading(false);
          },
        },
      );
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred");
    }
    setLoading(false);
  };

  const isBusy = loading || isValidatingBvn || isRegistering;

  if (step === 1) {
    return (
      <div>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-foreground-subtle hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-pill flex items-center justify-center shrink-0"
            style={{ background: "rgb(var(--soft))" }}
          >
            <Shield size={18} style={{ color: "rgb(var(--brand-primary))" }} />
          </div>
          <div>
            <p className="eyebrow mb-0">Identity verification</p>
            <p className="font-bold text-xl leading-tight">Step 1 of 2</p>
          </div>
        </div>

        {error && <ErrorBox message={error} />}

        <form onSubmit={handleBVNValidation} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="bvn"
              className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide"
            >
              BVN
            </Label>
            <Input
              id="bvn"
              type="text"
              inputMode="numeric"
              placeholder="11-digit BVN"
              value={bvn}
              onChange={(e) =>
                setBvn(e.target.value.replace(/\D/g, "").slice(0, 11))
              }
              required
              disabled={isBusy}
              className="h-12 rounded-xl"
              maxLength={11}
            />
            <p className="text-xs text-foreground-subtle">
              Dial *565*0# to retrieve your BVN
            </p>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="phone"
              className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="+2348012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={isBusy}
              className="h-12 rounded-xl"
            />
            <p className="text-xs text-foreground-subtle">
              Phone number linked to your BVN
            </p>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="dob"
              className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide"
            >
              Date of Birth
            </Label>
            <Input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              disabled={isBusy}
              className="h-12 rounded-xl"
              max={
                new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                  .toISOString()
                  .split("T")[0]
              }
            />
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isBusy ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Validating…
              </>
            ) : (
              "Validate BVN"
            )}
          </button>
        </form>

        <p
          className="text-sm text-foreground-subtle text-center mt-6 pt-5"
          style={{ borderTop: "1px solid rgb(var(--surface-high))" }}
        >
          Already have an account?{" "}
          <Link
            to="/"
            className="font-bold text-foreground hover:text-brand-primary transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => {
          setStep(1);
          setError(null);
          setEmail("");
          setGender("");
          setPassword("");
          setConfirmPassword("");
          setTermsAccepted(false);
        }}
        className="inline-flex items-center gap-2 text-sm text-foreground-subtle hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-pill flex items-center justify-center shrink-0"
          style={{ background: "rgb(var(--soft))" }}
        >
          <User size={18} style={{ color: "rgb(var(--brand-primary))" }} />
        </div>
        <div>
          <p className="eyebrow mb-0">Create account</p>
          <p className="font-bold text-xl leading-tight">Step 2 of 2</p>
        </div>
      </div>

      {error && <ErrorBox message={error} />}

      {bvnData && (
        <div
          className="rounded-2xl p-4 mb-5"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          <p className="text-xs text-foreground-subtle mb-1">
            Your verified information
          </p>
          <p className="font-semibold text-sm">
            {bvnData.firstName}
            {bvnData.middleName ? ` ${bvnData.middleName}` : ""}{" "}
            {bvnData.lastName}
          </p>
          <p className="text-xs text-foreground-subtle mt-0.5">
            Phone: {bvnData.phoneNumber || step1Data?.phone_number}
          </p>
        </div>
      )}

      <form onSubmit={handleAccountCreation} className="space-y-4">
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
            disabled={isBusy}
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide">
            Gender
          </Label>
          <RadioGroup
            value={gender}
            onValueChange={(v) => setGender(v as "MALE" | "FEMALE")}
            className="flex gap-5"
            disabled={isBusy}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="MALE" id="male" />
              <Label
                htmlFor="male"
                className="text-sm font-normal cursor-pointer"
              >
                Male
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="FEMALE" id="female" />
              <Label
                htmlFor="female"
                className="text-sm font-normal cursor-pointer"
              >
                Female
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isBusy}
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
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isBusy}
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

        <div className="flex items-start gap-3 py-1">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(c) => setTermsAccepted(c as boolean)}
            className="mt-0.5"
          />
          <label htmlFor="terms" className="text-sm leading-relaxed">
            I agree to the{" "}
            <Link to="/terms" className="font-semibold underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="font-semibold underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {isBusy ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating account…
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p
        className="text-sm text-foreground-subtle text-center mt-6 pt-5"
        style={{ borderTop: "1px solid rgb(var(--surface-high))" }}
      >
        Already have an account?{" "}
        <Link
          to="/"
          className="font-bold text-foreground hover:text-brand-primary transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
