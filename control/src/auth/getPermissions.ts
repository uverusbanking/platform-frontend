import { ROLE_PERMISSIONS } from "./rolePermissions";

export const getPermissions = (role?: string) => {
  if (!role) {
    return [];
  }

  if (role in ROLE_PERMISSIONS) {
    return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
  }

  return [];
};
