import { IApiResponse, TError } from "@/types/apiResponseType";
import { IVerifyLoginResponse } from "@/types/auth.types";
import {
  IPublicKey,
  ILoginPayload,
  ILoginResponse,
  IVerifyLoginPayload,
  IVerifyForgotOTPPayload,
  IForgotPasswordPayload,
  IVerifyForgotOTPResponse,
  IResetPasswordPayload,
  IResendForgotOTPPayload,
} from "@shared/core";
import {
  getEncryptionPublicKey,
  login,
  verifyLogin,
} from "@/services/authService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useGetEncryptionPublicKey = () => {
  return useQuery<IApiResponse<IPublicKey>, TError>({
    queryKey: ["encryption-public-key"],
    queryFn: getEncryptionPublicKey,
  });
};

export { useGetEncryptionPublicKey };

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

// Import forgot password mutations
import {
  forgotPassword,
  verifyForgotOTP,
  resetPassword,
  resendForgotOTP,
} from "./mutations";

/**
 * FORGOT PASSWORD HOOKS
 */

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
