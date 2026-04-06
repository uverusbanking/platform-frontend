import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForgotPassword } from '@/hooks/mutations/useAuthMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { mutateAsync: forgotPasswordMutate, isPending } = useForgotPassword();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      forgotPasswordSchema.parse({ email });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    try {
      await forgotPasswordMutate({ email });
      setEmailSent(true);
    } catch (error: any) {
      setError(error.message || 'Something went wrong. Please try again.');
    }
  };

  const handleContinueToReset = () => {
    navigate('/auth/reset-password', { state: { email } });
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col">
        <header className="p-4 safe-top">
          <button
            onClick={() => {
              setEmailSent(false);
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
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="text-success" size={28} />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl">Check your email</CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-2">
                We've sent password reset instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 text-center">
              <p className="font-medium text-foreground mb-4 break-all">{email}</p>

              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <Mail className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Password reset code sent</p>
                    <p>Please check your inbox (and spam folder) for the reset code. The code will expire in 15 minutes.</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleContinueToReset}
                className="w-full h-11 sm:h-10"
                variant="gradient"
              >
                Enter Reset Code
              </Button>

              <p className="text-xs text-muted-foreground mt-4">
                Didn't receive the email?{' '}
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setError(null);
                  }}
                  className="text-primary hover:underline"
                >
                  Try again
                </button>
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
          onClick={() => navigate('/auth/login')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors p-2 -ml-2 rounded-lg touch-manipulation active:bg-white/10"
        >
          <ArrowLeft size={20} />
          <span className="font-medium text-sm sm:text-base">Back to Login</span>
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
            <CardTitle className="text-xl sm:text-2xl">Forgot Password?</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Enter your email address and we'll send you a reset code
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isPending}
                  className="h-11 sm:h-10"
                />
              </div>

              <Button type="submit" className="w-full h-11 sm:h-10" variant="gradient" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : 'Send Reset Code'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link to="/auth/login" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;