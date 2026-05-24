const ROOT = {
  ACCOUNT: "/account",
};

const ACCOUNT_ROOT = ROOT.ACCOUNT;
const BANKING_ROOT = `${ACCOUNT_ROOT}/banking`;
const LOANS_ROOT = `${ACCOUNT_ROOT}/loans`;
const SETTINGS_ROOT = `${ACCOUNT_ROOT}/settings`;
const CUSTOMERS_ROOT = `${ACCOUNT_ROOT}/customers`;
const PAYMENT_LINKS_ROOT = `${ACCOUNT_ROOT}/payment-links`;
const PAYOUTS_ROOT = `${ACCOUNT_ROOT}/payouts`;
const DEVELOPERS_ROOT = `${ACCOUNT_ROOT}/developers`;

export const APP_ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    VERIFY: (session_id: string) => `/verify/${session_id}`,
  },
  ACCOUNT: {
    DASHBOARD: `${ACCOUNT_ROOT}/dashboard`,
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
    ANALYTICS: `${ACCOUNT_ROOT}/analytics`,
    PAYMENT_LINKS: {
      LIST: PAYMENT_LINKS_ROOT,
      DETAILS: (id: string) => `${PAYMENT_LINKS_ROOT}/${id}`,
    },
    PAYOUTS: {
      LIST: PAYOUTS_ROOT,
    },
    DEVELOPERS: {
      ROOT: DEVELOPERS_ROOT,
      API_KEYS: `${DEVELOPERS_ROOT}/api-keys`,
      WEBHOOKS: `${DEVELOPERS_ROOT}/webhooks`,
      SDK: `${DEVELOPERS_ROOT}/sdk`,
      LOGS: `${DEVELOPERS_ROOT}/logs`,
    },
    SETTINGS: {
      ROOT: SETTINGS_ROOT,
      PROFILE: `${SETTINGS_ROOT}/profile`,
      SECURITY: `${SETTINGS_ROOT}/security`,
      ORGANISATION: `${SETTINGS_ROOT}/organisation`,
      DOCUMENTS: `${SETTINGS_ROOT}/documents`,
    },
  },
};
