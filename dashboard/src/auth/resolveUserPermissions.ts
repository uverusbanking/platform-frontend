import { IUser } from "@/types/user.types";
import { getPermissions } from "@/auth/getPermissions";

export const resolveUserPermissions = (
  user: IUser,
  storedUser?: IUser | null,
) => {
  if (user.permissions?.length) {
    return user;
  }

  if (storedUser?.role === user.role && storedUser.permissions?.length) {
    return { ...user, permissions: storedUser.permissions };
  }

  return { ...user, permissions: getPermissions(user.role) };
};
