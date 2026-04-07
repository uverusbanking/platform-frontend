import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login,
  resetPassword,
  verifyLogin,
  resendForgotOtp,
} from "@/hooks/endpoints/useAuth";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { IApiResponse, TError } from "@/types/apiResponse.type";
import {
  ILoginPayload,
  ILoginResponse,
  IVerifyLoginPayload,
  IResetPasswordPayload,
  IResendForgotOTPPayload,
} from "@shared/core";
import { IVerifyLoginResponse } from "@/types/auth.types";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<IApiResponse<ILoginResponse>, TError, ILoginPayload>({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AUTH.COMPANY_LOGIN],
      });
    },
  });
};

export const useResetPassword = () => {
  return useMutation<IApiResponse<unknown>, TError, IResetPasswordPayload>({
    mutationFn: resetPassword,
  });
};

export const useResendForgotOtp = () => {
  return useMutation<IApiResponse<unknown>, TError, IResendForgotOTPPayload>({
    mutationFn: resendForgotOtp,
  });
};

export const useVerifyLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<IVerifyLoginResponse>,
    TError,
    IVerifyLoginPayload
  >({
    mutationFn: verifyLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AUTH.COMPANY_LOGIN],
      });
    },
  });
};
