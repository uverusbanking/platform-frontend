import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IApiResponse, TError } from "@/types/apiResponseType";
import {
  ILoginPayload,
  ILoginResponse,
  IVerifyLoginPayload,
  IForgotPasswordPayload,
  IVerifyForgotOTPPayload,
  IVerifyForgotOTPResponse,
  IResetPasswordPayload,
  IResendForgotOTPPayload,
} from "@shared/core";
import {
  login,
  verifyLogin,
  forgotPassword,
  verifyForgotOTP,
  resetPassword,
  resendForgotOTP,
} from "@/hooks/endpoints/useAuth";
import { IVerifyLoginResponse } from "@/types/auth.types";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<IApiResponse<ILoginResponse>, TError, ILoginPayload>({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-login"] });
      // You might want to show a success toast message here
      // toast.success(data.message || "Profile updated successfully", {description: ""});
    },
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
      queryClient.invalidateQueries({ queryKey: ["company-login"] });
      // You might want to show a success toast message here
      // toast.success(data.message || "Profile updated successfully", {description: ""});
    },
  });
};

export const useForgotPassword = () => {
  return useMutation<IApiResponse<unknown>, TError, IForgotPasswordPayload>({
    mutationFn: forgotPassword,
  });
};

export const useVerifyForgotOTP = () => {
  return useMutation<
    IApiResponse<IVerifyForgotOTPResponse>,
    TError,
    IVerifyForgotOTPPayload
  >({
    mutationFn: verifyForgotOTP,
  });
};

export const useResetPassword = () => {
  return useMutation<IApiResponse<unknown>, TError, IResetPasswordPayload>({
    mutationFn: resetPassword,
  });
};

export const useResendForgotOTP = () => {
  return useMutation<IApiResponse<unknown>, TError, IResendForgotOTPPayload>({
    mutationFn: resendForgotOTP,
  });
};
