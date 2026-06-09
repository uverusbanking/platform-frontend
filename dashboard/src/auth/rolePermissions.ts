import { PERMISSIONS } from "./permissions";
import { ROLES } from "./roles";

export const ROLE_PERMISSIONS = {
  [ROLES.ORGANISATION_COMPLIANCE]: [
    PERMISSIONS.FREEZE_CUSTOMER,
    PERMISSIONS.UNFREEZE_CUSTOMER,
  ],
};
