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
import {
  ArrowRight,
  Shield,
  Zap,
  Lock,
  Sparkles,
  Activity,
  Smartphone,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { z } from "zod";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Index = () => {
  const navigate = useNavigate();
  const { signIn, setPendingCredentials } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      loginSchema.parse({ email, password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    setLoading(true);

    const { error, needsVerification } = await signIn(email, password);

    if (needsVerification) {
      setPendingCredentials(email, password);
      setVerificationRequired(true);
      setLoading(false);
      return;
    }

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Invalid email or password. Please try again."
          : error.message,
      );
      setLoading(false);
      return;
    }

    navigate("/account/dashboard");
  };

  const handleContinueToVerify = () => {
    navigate("/auth/verify-otp", { state: { email, fromLogin: true } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-white/30">
      <Helmet>
        <title>Login - UverusPay Personal Banking</title>
        <meta
          name="description"
          content="Login to your UverusPay account. Access secure digital banking, instant transfers, and financial management for African businesses."
        />
        <meta name="robots" content="index, nofollow" />
      </Helmet>

      {/* Hero / Background Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[120px]"
          />

          {/* Floating Shapes */}
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[5%] md:left-[10%] w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
          >
            <Zap className="w-8 h-8 text-white/50" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 40, 0], rotate: [0, -15, 10, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-[25%] right-[5%] md:right-[15%] w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
          >
            <Shield className="w-10 h-10 text-white/40" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 15, 0], rotate: [-10, 5, -10] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-[15%] left-[10%] md:left-[25%] w-24 h-16 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
          >
            <CreditCard className="w-8 h-8 text-white/50" />
          </motion.div>
        </div>

        {/* Header - Simple Logo Only */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 cursor-pointer text-white"
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Uverus Pay
              </span>
            </motion.div>
          </div>
        </header>

        {/* Login Container - Two Column Layout */}
        <div className="container mx-auto px-6 relative z-10 max-w-7xl flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-80px)] mt-20 gap-12 lg:gap-20">
          {/* Left Column: Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md order-2 lg:order-1"
          >
            {verificationRequired ? (
              <Card className="w-full shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-4">
                    <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
                      <Mail className="text-warning" size={28} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">
                    Verification required
                  </CardTitle>
                  <CardDescription className="text-sm mt-2">
                    Your email hasn't been verified yet
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="font-medium text-foreground mb-4 break-all">
                    {email}
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                    <div className="flex items-start gap-3">
                      <CheckCircle
                        className="text-success mt-0.5 flex-shrink-0"
                        size={18}
                      />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">
                          We've sent a code
                        </p>
                        <p>
                          Check your inbox for the 6-digit code to continue.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleContinueToVerify}
                    className="w-full h-11"
                    variant="gradient"
                  >
                    Enter Verification Code
                  </Button>
                  <button
                    onClick={() => setVerificationRequired(false)}
                    className="mt-4 text-sm text-primary hover:underline font-medium"
                  >
                    Back to Login
                  </button>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-3xl font-bold tracking-tight">
                    Welcome back
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Sign in to your personal banking portal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in fade-in slide-in-from-top-1">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          to="/auth/forgot-password"
                          size="sm"
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          className="h-11 pr-10 border-border/50 focus:border-primary/50 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20"
                      variant="gradient"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Sign In to UverusPay"
                      )}
                    </Button>
                  </form>

                  <div className="mt-8 text-center pt-6 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link
                        to="/auth/register"
                        className="text-primary hover:underline font-bold"
                      >
                        Create your account
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Right Column: Recent Activity Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block flex-1 w-full max-w-[500px] perspective-1000 order-1 lg:order-2"
          >
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 p-1 rounded-3xl bg-gradient-to-br from-white/30 via-white/5 to-success/30 shadow-2xl backdrop-blur-2xl border border-white/20"
            >
              <div className="bg-primary/80 backdrop-blur-3xl rounded-[1.4rem] p-6 lg:p-8 shadow-inner border border-white/10 text-white">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-sm text-white/70 font-medium mb-1">
                      Total Balance
                    </p>
                    <h3 className="text-4xl font-bold tracking-tight">
                      ₦2,456,300
                      <span className="text-white/50 text-2xl">.00</span>
                    </h3>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-success/20 p-4 rounded-2xl border border-success/30 transition-colors hover:bg-success/30 cursor-pointer backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-full bg-success/30 flex items-center justify-center mb-3">
                      <ArrowRight className="w-4 h-4 text-white -rotate-45" />
                    </div>
                    <p className="font-semibold text-sm">Receive</p>
                  </div>
                  <div className="bg-white/15 p-4 rounded-2xl border border-white/20 transition-colors hover:bg-white/25 cursor-pointer backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-3">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <p className="font-semibold text-sm">Send</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">
                    Recent Activity
                  </p>
                  {[
                    {
                      name: "Spotify Premium",
                      amount: "-₦4,500.00",
                      date: "Today, 2:45 PM",
                      icon: Smartphone,
                      color: "text-white",
                      bg: "bg-white/15",
                    },
                    {
                      name: "Salary Deposit",
                      amount: "+₦850,000.00",
                      date: "Yesterday",
                      icon: Zap,
                      color: "text-success",
                      bg: "bg-success/20",
                    },
                  ].map((tx, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-xl border border-white/5 ${tx.bg}`}
                        >
                          <tx.icon className={`w-5 h-5 ${tx.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{tx.name}</p>
                          <p className="text-xs text-white/60">{tx.date}</p>
                        </div>
                      </div>
                      <p
                        className={`font-semibold text-sm ${tx.amount.startsWith("+") ? "text-success" : "text-white/90"}`}
                      >
                        {tx.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
