import { useState, useEffect, useCallback, useRef } from 'react';
import { SESSION_CONFIG, STORAGE_KEYS, ACTIVITY_EVENTS } from '@/config/sessionConfig';

interface UseSessionGuardOptions {
  isAuthenticated: boolean;
  onLogout: () => void | Promise<void>;
}

interface UseSessionGuardReturn {
  showWarningModal: boolean;
  countdown: number;
  handleStayLoggedIn: () => void;
  handleLogout: () => void;
}

export const useSessionGuard = ({
  isAuthenticated,
  onLogout,
}: UseSessionGuardOptions): UseSessionGuardReturn => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [countdown, setCountdown] = useState(SESSION_CONFIG.WARNING_TIMEOUT / 1000);

  // Timer refs
  const inactivityTimerRef = useRef<NodeJS.Timeout>();
  const warningTimerRef = useRef<NodeJS.Timeout>();
  const countdownIntervalRef = useRef<NodeJS.Timeout>();

  // Prevent event handling when modal is visible
  const isModalVisibleRef = useRef(false);

  /**
   * Clear all active timers
   */
  const clearAllTimers = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = undefined;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = undefined;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = undefined;
    }
  }, []);

  /**
   * Execute logout and cleanup
   */
  const executeLogout = useCallback(async () => {
    clearAllTimers();
    setShowWarningModal(false);
    isModalVisibleRef.current = false;

    // Clear session storage
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    localStorage.removeItem(STORAGE_KEYS.TAB_HIDDEN_TIME);
    localStorage.removeItem(STORAGE_KEYS.SESSION_START);

    await onLogout();
  }, [clearAllTimers, onLogout]);

  /**
   * Show warning modal and start countdown
   */
  const showWarning = useCallback(() => {
    setShowWarningModal(true);
    isModalVisibleRef.current = true;
    setCountdown(SESSION_CONFIG.WARNING_TIMEOUT / 1000);

    // Start countdown interval
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-logout after warning timeout
    warningTimerRef.current = setTimeout(() => {
      executeLogout();
    }, SESSION_CONFIG.WARNING_TIMEOUT);
  }, [executeLogout]);

  /**
   * Reset inactivity timer
   */
  const resetInactivityTimer = useCallback(() => {
    // Don't reset if modal is visible or user not authenticated
    if (isModalVisibleRef.current || !isAuthenticated) {
      return;
    }

    clearAllTimers();

    // Update last activity timestamp
    const now = Date.now();
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, String(now));

    // Set inactivity timer
    inactivityTimerRef.current = setTimeout(() => {
      showWarning();
    }, SESSION_CONFIG.INACTIVITY_WARNING_TIME);
  }, [isAuthenticated, clearAllTimers, showWarning]);

  /**
   * Handle "Stay Logged In" button
   */
  const handleStayLoggedIn = useCallback(() => {
    setShowWarningModal(false);
    isModalVisibleRef.current = false;
    clearAllTimers();
    resetInactivityTimer();
  }, [clearAllTimers, resetInactivityTimer]);

  /**
   * Handle "Logout" button
   */
  const handleLogout = useCallback(() => {
    executeLogout();
  }, [executeLogout]);

  /**
   * Check if session is valid based on stored timestamps
   */
  const checkSessionValidity = useCallback((): boolean => {
    if (!isAuthenticated) return true;

    const tabHiddenTime = localStorage.getItem(STORAGE_KEYS.TAB_HIDDEN_TIME);
    const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);

    // Check tab hidden timeout (15 minutes)
    if (tabHiddenTime) {
      const hiddenDuration = Date.now() - parseInt(tabHiddenTime, 10);
      if (hiddenDuration > SESSION_CONFIG.HIDDEN_TAB_TIMEOUT) {
        executeLogout();
        return false;
      }
      // Clear the hidden time if within valid duration
      localStorage.removeItem(STORAGE_KEYS.TAB_HIDDEN_TIME);
    }

    // Check tab close timeout (5 minutes of inactivity)
    if (lastActivity) {
      const inactiveDuration = Date.now() - parseInt(lastActivity, 10);
      if (inactiveDuration > SESSION_CONFIG.TAB_CLOSE_TIMEOUT) {
        executeLogout();
        return false;
      }
    }

    return true;
  }, [isAuthenticated, executeLogout]);

  /**
   * Setup activity listeners and visibility handlers
   */
  useEffect(() => {
    if (!isAuthenticated) {
      clearAllTimers();
      setShowWarningModal(false);
      isModalVisibleRef.current = false;
      localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
      localStorage.removeItem(STORAGE_KEYS.TAB_HIDDEN_TIME);
      localStorage.removeItem(STORAGE_KEYS.SESSION_START);
      return;
    }

    // Check session validity on mount/auth change
    if (!checkSessionValidity()) {
      return;
    }

    // Initialize session start time if not exists
    if (!localStorage.getItem(STORAGE_KEYS.SESSION_START)) {
      localStorage.setItem(STORAGE_KEYS.SESSION_START, String(Date.now()));
    }

    // Activity event handler
    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Visibility change handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab/window is hidden - store timestamp
        localStorage.setItem(STORAGE_KEYS.TAB_HIDDEN_TIME, String(Date.now()));
      } else {
        // Tab/window is visible again - check validity
        if (!checkSessionValidity()) {
          return;
        }
        // Only reset timer if modal is not visible
        if (!isModalVisibleRef.current) {
          resetInactivityTimer();
        }
      }
    };

    // Before unload handler
    const handleBeforeUnload = () => {
      // Store timestamp when tab is being closed
      localStorage.setItem(STORAGE_KEYS.TAB_HIDDEN_TIME, String(Date.now()));
    };

    // Focus handler
    const handleFocus = () => {
      // Check session validity when window regains focus
      if (!checkSessionValidity()) {
        return;
      }
      // Only reset timer if modal is not visible
      if (!isModalVisibleRef.current) {
        resetInactivityTimer();
      }
    };

    // Register activity listeners
    ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true, capture: true });
    });

    // Register visibility and lifecycle listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('focus', handleFocus);

    // Start initial timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        document.removeEventListener(event, handleActivity, { capture: true });
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('focus', handleFocus);
      clearAllTimers();
    };
  }, [isAuthenticated, resetInactivityTimer, checkSessionValidity, clearAllTimers]);

  return {
    showWarningModal,
    countdown,
    handleStayLoggedIn,
    handleLogout,
  };
};
