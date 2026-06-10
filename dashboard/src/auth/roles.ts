export const ROLES = {
  ORGANISATION_ADMIN: "ORGANISATION_ADMIN",
  ORGANISATION_COMPLIANCE: "ORGANISATION_COMPLIANCE",
  ORGANISATION_FINANCE: "ORGANISATION_FINANCE",
  ORGANISATION_OWNER: "ORGANISATION_OWNER",
} as const;

export const staffRoles = [
  { value: ROLES.ORGANISATION_ADMIN, label: "Organisation Admin" },
  { value: ROLES.ORGANISATION_COMPLIANCE, label: "Organisation Compliance" },
  { value: ROLES.ORGANISATION_FINANCE, label: "Organisation Finance" },
  { value: ROLES.ORGANISATION_OWNER, label: "Organisation Owner" },
] as const;
