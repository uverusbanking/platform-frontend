import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const { signIn, setPendingCredentials } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      // Store credentials for auto-login after verification
      setPendingCredentials(email, password);
      setVerificationRequired(true);
      setLoading(false);
      return;
    }

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Invalid email or password. Please try again.'
        : error.message);
      setLoading(false);
      return;
    }

    navigate('/account/dashboard');
  };

  const handleContinueToVerify = () => {
    navigate('/auth/verify-otp', { state: { email, fromLogin: true } });
  };

  if (verificationRequired) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col">
        <header className="p-4 safe-top">
          <button
            onClick={() => {
              setVerificationRequired(false);
              setError(null);
            }}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors p-2 -ml-2 rounded-lg touch-manipulation active:bg-white/10"
          >
            <ArrowLeft size={20} />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 pb-8 sm:pb-12">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="text-center pb-2 px-4 sm:px-6">
              <div className="mx-auto mb-3 sm:mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-warning/10 flex items-center justify-center">
                  <Mail className="text-warning" size={28} />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl">Email verification required</CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-2">
                Your email hasn't been verified yet
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 text-center">
              <p className="font-medium text-foreground mb-4 break-all">{email}</p>

              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-success mt-0.5 flex-shrink-0" size={18} />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">We've sent a new verification code</p>
                    <p>Please check your inbox (and spam folder) for the 6-digit code. After verifying, you'll be automatically signed in.</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleContinueToVerify}
                className="w-full h-11 sm:h-10"
                variant="gradient"
              >
                Enter Verification Code
              </Button>

              <p className="text-xs text-muted-foreground mt-4">
                Didn't receive the email? You can request a new code on the next screen.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="p-4 safe-top">
        <button
          onClick={() => navigate('/')}
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
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl sm:text-2xl">U</span>
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl">Welcome back</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Sign in to your Uverus Pay account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
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
                <Label htmlFor="password" className="text-sm">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
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
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end mb-4">
                <Link to="/auth/forgot-password" className="text-xs sm:text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full h-11 sm:h-10" variant="gradient" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-primary hover:underline font-medium">
                  Create one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
