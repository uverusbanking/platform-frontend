export const ROLES = {
  BRAND_ADMIN: "BRAND_ADMIN",
  BRAND_SUPPORT: "BRAND_SUPPORT",
  BRAND_COMPLIANCE: "BRAND_COMPLIANCE",
  BRAND_AUDITOR: "BRAND_AUDITOR",
} as const;

export const staffRoles = [
  { value: ROLES.BRAND_ADMIN, label: "Organisation Admin" },
  { value: ROLES.BRAND_SUPPORT, label: "Organisation Support" },
  { value: ROLES.BRAND_COMPLIANCE, label: "Organisation Compliance" },
  { value: ROLES.BRAND_AUDITOR, label: "Organisation Auditor" },
] as const;
