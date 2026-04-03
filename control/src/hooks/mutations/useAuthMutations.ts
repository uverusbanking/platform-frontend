import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, resetPassword } from "@/hooks/endpoints/useAuth";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { IApiResponse, TError } from "@/types/apiResponse.type";
import { ILoginPayload, ILoginResponse } from "@/types/auth.types";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<IApiResponse<ILoginResponse>, TError, ILoginPayload>({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AUTH.COMPANY_LOGIN],
      });
      // You might want to show a success toast message here
      // toast.success(data.message || "Profile updated successfully", {description: ""});
    },
  });
};

export const useResetPassword = () => {
  return useMutation<
    IApiResponse<unknown>,
    TError,
    { session_id: string; new_password: string }
  >({
    mutationFn: resetPassword,
  });
};
