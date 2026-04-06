import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useResetPassword } from '@/hooks/mutations/useAuthMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  otp: z.string().min(6, 'Reset code must be 6 digits').max(6, 'Reset code must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: resetPasswordMutate, isPending } = useResetPassword();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      resetPasswordSchema.parse({ email, otp, newPassword, confirmPassword });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    try {
      await resetPasswordMutate({ email, otp, newPassword });
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Invalid reset code or expired. Please try again.');
    }
  };

  const handleContinueToLogin = () => {
    navigate('/auth/login');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 pb-8 sm:pb-12">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="text-center pb-2 px-4 sm:px-6">
              <div className="mx-auto mb-3 sm:mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="text-success" size={28} />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl">Password Reset</CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-2">
                Your password has been successfully reset
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 text-center">
              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <Shield className="text-success mt-0.5 flex-shrink-0" size={18} />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Password updated successfully</p>
                    <p>You can now sign in with your new password. Make sure to keep it secure and don't share it with anyone.</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleContinueToLogin}
                className="w-full h-11 sm:h-10"
                variant="gradient"
              >
                Continue to Login
              </Button>
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
          onClick={() => navigate('/auth/forgot-password')}
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
            <CardTitle className="text-xl sm:text-2xl">Reset Password</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Enter the reset code and your new password
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
                  // onChange={(e) => setEmail(e.target.value)} --- IGNORE ---
                  required
                  disabled={isPending}
                  readOnly
                  className="h-11 sm:h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm">Reset Code</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  disabled={isPending}
                  className="h-11 sm:h-10 text-center tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isPending}
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
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isPending}
                    className="h-11 sm:h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 touch-manipulation"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 sm:h-10" variant="gradient" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : 'Reset Password'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{' '}
                <Link to="/auth/forgot-password" className="text-primary hover:underline font-medium">
                  Try again
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;