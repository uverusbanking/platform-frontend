/**
 * Session Security Configuration
 * All timing values are configurable via environment variables
 */

export const SESSION_CONFIG = {
  // 2 minutes of inactivity before showing warning (in milliseconds)
  INACTIVITY_WARNING_TIME: Number(import.meta.env.VITE_INACTIVITY_WARNING_MS) || 2 * 60 * 1000,

  // 30 seconds to respond to warning modal before auto-logout (in milliseconds)
  WARNING_TIMEOUT: Number(import.meta.env.VITE_WARNING_TIMEOUT_MS) || 30 * 1000,

  // 5 minutes absolute session timeout when tab is hidden (in milliseconds)
  HIDDEN_TAB_TIMEOUT: Number(import.meta.env.VITE_HIDDEN_TAB_TIMEOUT_MS) || 5 * 60 * 1000,

  // 5 minutes timeout for browser/tab close detection (in milliseconds)
  TAB_CLOSE_TIMEOUT: Number(import.meta.env.VITE_TAB_CLOSE_TIMEOUT_MS) || 5 * 60 * 1000,
} as const;

export const STORAGE_KEYS = {
  LAST_ACTIVITY: 'app-last-activity-timestamp',
  TAB_HIDDEN_TIME: 'app-tab-hidden-timestamp',
  SESSION_START: 'app-session-start-timestamp',
} as const;

export const ACTIVITY_EVENTS = [
  'mousemove',
  'click',
  'keypress',
  'scroll',
  'touchstart',
  'touchmove'
] as const;
