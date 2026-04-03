const ROOT = {
  ACCOUNT: "/account",
};

const ACCOUNT_ROOT = ROOT.ACCOUNT;
const BANKING_ROOT = `${ACCOUNT_ROOT}/banking`;
const LOANS_ROOT = `${ACCOUNT_ROOT}/loans`;
const SETTINGS_ROOT = `${ACCOUNT_ROOT}/settings`;
const CUSTOMERS_ROOT = `${ACCOUNT_ROOT}/customers`;

export const APP_ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    VERIFY: (sessionId: string) => `/verify/${sessionId}`,
  },
  ACCOUNT: {
    DASHBOARD: `${ACCOUNT_ROOT}/dashboard`,
    ANALYTICS: `${ACCOUNT_ROOT}/analytics`,
    BRANCHES: `${ACCOUNT_ROOT}/branches`,
    CUSTOMERS: {
      LIST: CUSTOMERS_ROOT,
      DETAILS: (id: string) => `${CUSTOMERS_ROOT}/${id}`,
    },
    STAFF: `${ACCOUNT_ROOT}/staff`,
    BANKING: {
      ROOT: BANKING_ROOT,
      ACCOUNTS: `${BANKING_ROOT}/accounts`,
      TRANSACTIONS: `${BANKING_ROOT}/transactions`,
      LIMITS: `${BANKING_ROOT}/limits`,
    },
    LOANS: {
      ROOT: LOANS_ROOT,
      APPLICATIONS: `${LOANS_ROOT}/applications`,
      ACTIVE: `${LOANS_ROOT}/active`,
      PRODUCTS: `${LOANS_ROOT}/products`,
    },
    CARDS: `${ACCOUNT_ROOT}/cards`,
    USSD: `${ACCOUNT_ROOT}/ussd`,
    WHATSAPP: `${ACCOUNT_ROOT}/whatsapp`,
    POS: `${ACCOUNT_ROOT}/pos`,
    EXPENSES: `${ACCOUNT_ROOT}/expenses`,
    NOTIFICATIONS: `${ACCOUNT_ROOT}/notifications`,
    REPORTS: `${ACCOUNT_ROOT}/reports`,
    SETTINGS: {
      ROOT: SETTINGS_ROOT,
      PROFILE: `${SETTINGS_ROOT}/profile`,
      SECURITY: `${SETTINGS_ROOT}/security`,
      ORGANISATION: `${SETTINGS_ROOT}/organisation`,
      DOCUMENTS: `${SETTINGS_ROOT}/documents`,
    },
  },
};
