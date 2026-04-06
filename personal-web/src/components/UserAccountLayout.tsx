import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function UserAccountLayout() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      signOut();
      navigate("/auth/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    signOut();
    navigate("/auth/login");
    return null;
  }

  return <Outlet />;
}
