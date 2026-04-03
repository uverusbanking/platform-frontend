export const QUERY_KEYS = {
  ORGANISATION: {
    GET_ALL: "organisations",
    GET_BY_ID: "platform-organisation",
    USERS: "organisation-users",
    DOCUMENTS: "organisation-documents",
    STATS: "organisation-stats",
    STATISTICS: "organisation-statistics",
    API_KEYS: "api-keys",
  },
  PLATFORM: {
    ORGANISATIONS: "platform-organisations",
    STATS: "platform-stats",
    ROLES: "roles",
    USERS: "platform-users",
  },
  CUSTOMER: {
    GET_ALL: "customers",
    GET_BY_ID: "customer",
    STATS: "customer-stats",
  },
  USER: {
    PROFILE: "user-profile",
  },
  WALLET: {
    GET_ALL: "wallets",
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
