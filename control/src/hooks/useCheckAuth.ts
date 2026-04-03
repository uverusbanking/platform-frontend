import { useCallback, useState } from "react";
import { useUserStore } from "@/state/userStore";
import { getDecryptedLocalStorage } from "@/lib/storage";
import { apiErrorResponse, refreshSession } from "@/lib/axios";
import { IUser } from "@/types/user.types";
import { resolveUserPermissions } from "@/auth/resolveUserPermissions";

export function useCheckAuth() {
  const _loginUser = useUserStore((state) => state._loginUser);
  const _clearUserSession = useUserStore((state) => state._clearUserSession);
  const [isLoading, setIsLoading] = useState(true);

  const reAuthUser = useCallback(async () => {
    const user_data = getDecryptedLocalStorage("user");
    const session_id = localStorage.getItem("session_id");
    const hadPersistedSession = Boolean(user_data || session_id);

    setIsLoading(true);
    try {
      const response = await refreshSession();

      const user: IUser = response.data.user;
      const new_access_token: string = response.data.access_token;
      const nextSessionId = response.data.session_id || session_id || "";
      const userWithPermissions = resolveUserPermissions(user, user_data);

      _loginUser(userWithPermissions, new_access_token, nextSessionId);

      setIsLoading(false);

      return true;
    } catch (error) {
      if (hadPersistedSession) {
        apiErrorResponse(error, "Oooops, something went wrong");
        _clearUserSession();
      }

      setIsLoading(false);

      return false;
    }
  }, [_clearUserSession, _loginUser]);

  return {
    isLoading,
    setIsLoading,
    reAuthUser,
  };
}
