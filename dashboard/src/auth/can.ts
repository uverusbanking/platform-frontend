import { IUser } from "@/types/user.types";
import { PERMISSIONS } from "./permissions";

export function can(user: IUser, permission: string | string[]) {
  if (Array.isArray(permission)) {
    return permission.some((p) => user?.permissions?.includes(p as any));
  }
  return user?.permissions?.includes(permission as any);
}
