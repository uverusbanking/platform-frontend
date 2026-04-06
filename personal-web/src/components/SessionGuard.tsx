import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSessionGuard } from '@/hooks/useSessionGuard';
import { SessionWarningModal } from './SessionWarningModal';
import { STORAGE_KEYS } from '@/config/sessionConfig';

interface SessionGuardProps {
  children: React.ReactNode;
}

/**
 * SessionGuard Component
 * 
 * Wraps the application to provide automatic session timeout functionality.
 * Monitors user activity and enforces security policies for idle sessions.
 */
export const SessionGuard: React.FC<SessionGuardProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle logout: clear session and redirect to login
   */
  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      navigate('/auth/login', { replace: true });
    } catch (error) {
      console.error('SessionGuard: Logout error', error);

      // Force logout even if signOut fails
      localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
      localStorage.removeItem(STORAGE_KEYS.TAB_HIDDEN_TIME);
      localStorage.removeItem(STORAGE_KEYS.SESSION_START);

      // Also clear auth tokens to prevent any potential issues
      localStorage.removeItem("sb-access-token");
      localStorage.removeItem("sb-user-data");
      navigate('/auth/login', { replace: true });
    }
  }, [signOut, navigate]);

  /**
   * Use session guard hook
   */
  const { showWarningModal, countdown, handleStayLoggedIn, handleLogout: handleImmediateLogout } = useSessionGuard({
    isAuthenticated: !!user,
    onLogout: handleLogout,
  });

  return (
    <>
      {children}
      <SessionWarningModal
        isOpen={showWarningModal}
        countdown={countdown}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleImmediateLogout}
      />
    </>
  );
};
