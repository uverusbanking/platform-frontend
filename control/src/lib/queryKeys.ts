export const QUERY_KEYS = {
  ORGANISATION: {
    GET_ALL: "organisations",
    GET_BY_ID: "platform-organisation",
    USERS: "organisation-users",
    DOCUMENTS: "organisation-documents",
    STATS: "organisation-stats",
    STATISTICS: "organisation-statistics",
    API_KEYS: "api-keys",
    BRAND_SETTINGS: "org-brand-settings",
    CONFIGURED_DOMAINS: "org-configured-domains",
    DOMAIN_VERIFICATION: "org-domain-verification",
    GO_LIVE_CHECKLIST: "org-go-live-checklist",
    PAYMENT_CONFIG: "org-payment-config",
    NOTIFICATION_CONFIG: "org-notification-config",
  },
  PLATFORM: {
    ORGANISATIONS: "platform-organisations",
    ROLES: "roles",
    USERS: "platform-users",
    CUSTOMER_WALLETS: "platform-customer-wallets",
    NOTIFICATION_CONFIG: "platform-notification-config",
    NOTIFICATION_BALANCE: "platform-notification-balance",
  },
  CUSTOMER: {
    GET_ALL: "customers",
    GET_BY_ID: "customer",
    STATS: "customer-stats",
    ACTIVITY: "customer-activity",
  },
  TRANSACTION: {
    PLATFORM_LIST: "platform-transactions",
    GET_DETAIL: "platform-transaction-detail",
  },
  USER: {
    PROFILE: "user-profile",
  },
  WALLET: {
    GET_ALL: "wallets",
    CUSTOMER_WALLETS: "customer-wallets",
    FROZEN_FUNDS: "platform-frozen-funds",
  },
  AUTH: {
    ENCRYPTION_PUBLIC_KEY: "encryption-public-key",
    COMPANY_LOGIN: "company-login",
  },
  OPTIONS: {
    LOCATIONS: "locations",
    KYC_DOCUMENT_TYPES: "kyc-document-types",
    EMPLOYMENT_STATUSES: "employment-statuses",
    NEXT_OF_KIN_RELATIONSHIPS: "next-of-kin-relationships",
  },
} as const;
