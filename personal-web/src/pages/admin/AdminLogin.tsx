import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signIn, loading: authLoading, user } = useAuth();
  const { isAdminAuthenticated, loading: adminLoading, refreshAdminUser } = useAdmin();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!adminLoading && isAdminAuthenticated) {
      navigate('/admin-dashboard');
    }
  }, [isAdminAuthenticated, adminLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError(signInError.message);
        setIsSubmitting(false);
        return;
      }

      // Wait for admin user to be fetched
      await refreshAdminUser();
      
      // Give a brief moment for state to update, then check
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // If still not authenticated as admin after refresh, show error
      // The useEffect will handle redirect if isAdminAuthenticated becomes true
      setIsSubmitting(false);
      
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Show error if user signed in but is not an admin
  useEffect(() => {
    if (!adminLoading && !authLoading && !isSubmitting && user && !isAdminAuthenticated) {
      setError('This account is not authorized for admin access.');
    }
  }, [adminLoading, authLoading, isSubmitting, user, isAdminAuthenticated]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-destructive border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-white h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your admin credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@uveruspay.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-destructive hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              This is a restricted area. Unauthorized access is prohibited.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
