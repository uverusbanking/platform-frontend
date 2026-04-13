import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Mail,
  CheckCircle,
  User,
  Shield,
} from "lucide-react";
import { z } from "zod";
import {
  usePublicValidateBvn,
  useRegister,
} from "@/hooks/mutations/useAuthMutations";
import { toast } from "sonner";

// Step 1: BVN Validation Schema
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

// Step 2: Account Creation Schema
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

const Register = () => {
  const navigate = useNavigate();
  const { setPendingCredentials } = useAuth();

  // Step management
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 data
  const [bvn, setBvn] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // BVN validation response
  const [bvnData, setBvnData] = useState<BVNData | null>(null);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  // Step 2 data
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { mutateAsync: validateBvnMutateAsync, isPending: isValidatingBvn } =
    usePublicValidateBvn();

  const { mutateAsync: registerMutateAsync, isPending: isRegistering } =
    useRegister();

  // Step 1: Validate BVN
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
          onError: (err: any) => {
            // Extract the actual error message from the backend response
            const errorMessage =
              err.message || err?.errors?.[0] || "An unexpected error occurred";
            setError(errorMessage);
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
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }

    setLoading(false);
  };

  // Step 2: Create Account
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
      await registerMutateAsync(
        {
          email,
          password,
          phone_number: step1Data.phone_number,
          date_of_birth: step1Data.date_of_birth,
          gender,
          first_name: bvnData.firstName,
          last_name: bvnData.lastName,
          bvn: step1Data.bvn,
        },
        {
          onError: (err: any) => {
            const errorMessage =
              err.message || err?.errors?.[0] || "An unexpected error occurred";
            setError(errorMessage);
          },
          onSuccess: () => {
            // Registration successful. Backend sends OTP for verification.
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
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
    }

    setLoading(false);
  };

  const handleContinueToVerify = () => {
    navigate("/auth/verify-otp", { state: { email, fromRegistration: true } });
  };

  // Step 1: BVN Validation
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 pb-8 sm:pb-12">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="text-center pb-2 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-primary/80 hover:text-primary transition-colors p-2 -ml-2 rounded-lg touch-manipulation active:bg-primary/10"
                  >
                    <ArrowLeft size={20} />
                    <span className="font-medium text-sm sm:text-base">
                      Back
                    </span>
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-primary flex items-center justify-center">
                      <Shield className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <div className="flex-1"></div>
              </div>

              <CardTitle className="text-xl sm:text-2xl">
                Verify Your Identity
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Step 1 of 2: Enter your BVN details to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleBVNValidation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bvn" className="text-sm">
                    BVN (Bank Verification Number)
                  </Label>
                  <Input
                    id="bvn"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 11-digit BVN"
                    value={bvn}
                    onChange={(e) =>
                      setBvn(e.target.value.replace(/\D/g, "").slice(0, 11))
                    }
                    required
                    disabled={loading || isValidatingBvn}
                    className="h-11 sm:h-10"
                    maxLength={11}
                  />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Dial *565*0# to retrieve your BVN
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">
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
                    disabled={loading || isValidatingBvn}
                    className="h-11 sm:h-10"
                  />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Use the phone number linked to your BVN
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm">
                    Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    disabled={loading || isValidatingBvn}
                    className="h-11 sm:h-10"
                    max={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 18),
                      )
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 sm:h-10"
                  variant="gradient"
                  disabled={loading || isValidatingBvn}
                >
                  {loading || isValidatingBvn ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Validate BVN"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/auth/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Account Creation
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 pb-8 sm:pb-12">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-2 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <button
                  onClick={() => {
                    setStep(1);
                    setError(null);
                    // Clear step 2 form data when going back
                    setEmail("");
                    setGender("");
                    setPassword("");
                    setConfirmPassword("");
                    setTermsAccepted(false);
                  }}
                  className="flex items-start gap-2 text-primary/80 hover:text-primary transition-colors p-2 -ml-2 rounded-lg touch-manipulation active:bg-primary/10"
                >
                  <ArrowLeft size={20} />
                  <span className="font-medium text-sm sm:text-base">Back</span>
                </button>
              </div>

              <div className="flex-1 ">
                <div className="flex justify-center items-center mx-auto mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-primary flex items-center justify-center">
                    <User className="text-white" size={24} />
                  </div>
                </div>
              </div>

              <div className="flex-1"></div>
            </div>

            <CardTitle className="text-xl sm:text-2xl">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Step 2 of 2: Confirm your details and set up your account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm">
                {error}
              </div>
            )}

            {/* Display BVN data for confirmation */}
            {bvnData && (
              <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  Your verified information:
                </p>
                <div className="space-y-1">
                  <p className="font-medium text-sm">
                    {bvnData.firstName}{" "}
                    {bvnData.middleName && `${bvnData.middleName} `}
                    {bvnData.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Phone: {bvnData.phoneNumber || step1Data?.phone_number}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleAccountCreation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
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
                  disabled={loading}
                  className="h-11 sm:h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Gender</Label>
                <RadioGroup
                  value={gender}
                  onValueChange={(value) =>
                    setGender(value as "MALE" | "FEMALE")
                  }
                  className="flex gap-4"
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MALE" id="male" />
                    <Label
                      htmlFor="male"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
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

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">
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
                    disabled={loading}
                    className="h-11 sm:h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 touch-manipulation"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm">
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
                    disabled={loading}
                    className="h-11 sm:h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 touch-manipulation"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2 py-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) =>
                    setTermsAccepted(checked as boolean)
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-10"
                variant="gradient"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
