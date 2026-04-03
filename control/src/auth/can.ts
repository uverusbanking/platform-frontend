import { IUser } from "@/types/user.types";
import { PERMISSIONS } from "./permissions";

export function can(
  user: IUser | null | undefined,
  permission: (typeof PERMISSIONS)[keyof typeof PERMISSIONS],
) {
  return user?.permissions?.includes(permission);
}
