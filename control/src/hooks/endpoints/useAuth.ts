import { IApiResponse, TError } from "@/types/apiResponse.type";
import {
  ILoginPayload,
  ILoginResponse,
  IVerifyLoginPayload,
  IPublicKey,
  IForgotPasswordPayload,
  IVerifyForgotOTPPayload,
  IVerifyForgotOTPResponse,
  IResetPasswordPayload,
  IResendForgotOTPPayload,
} from "@shared/core";
import { IVerifyLoginResponse } from "@/types/auth.types";
import apiClient from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";

const getEncryptionPublicKey = async (): Promise<IPublicKey> => {
  const response = (await apiClient.get(`/auth/public-key`)).data;
  return response.data;
};

// query is not supposed to be here
export const useGetEncryptionPublicKey = () => {
  return useQuery<IPublicKey, TError>({
    queryKey: [QUERY_KEYS.AUTH.ENCRYPTION_PUBLIC_KEY],
    queryFn: getEncryptionPublicKey,
  });
};

export const login = async (
  payload: ILoginPayload,
): Promise<IApiResponse<ILoginResponse>> => {
  const response = await apiClient.post("/platform/auth/login", payload);
  return response.data;
};

export const verifyLogin = async (
  payload: IVerifyLoginPayload,
): Promise<IApiResponse<IVerifyLoginResponse>> => {
  const response = await apiClient.post("/platform/auth/verify-code", payload);
  return response.data;
};

const forgotPassword = async (
  payload: IForgotPasswordPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    "/platform/auth/forgot-password",
    payload,
  );
  return response.data;
};

export const useForgotPassword = () => {
  return useMutation<IApiResponse<unknown>, TError, IForgotPasswordPayload>({
    mutationFn: forgotPassword,
  });
};

const verifyForgotOtp = async (
  payload: IVerifyForgotOTPPayload,
): Promise<IApiResponse<IVerifyForgotOTPResponse>> => {
  const response = await apiClient.post(
    "/platform/auth/verify-forgot-otp",
    payload,
  );
  return response.data;
};

export const useVerifyForgotOtp = () => {
  return useMutation<
    IApiResponse<IVerifyForgotOTPResponse>,
    TError,
    IVerifyForgotOTPPayload
  >({
    mutationFn: verifyForgotOtp,
  });
};

export const resetPassword = async (
  payload: IResetPasswordPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    "/platform/auth/reset-password",
    payload,
  );
  return response.data;
};

export const resendForgotOtp = async (
  payload: IResendForgotOTPPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    "/platform/auth/resend-forgot-otp",
    payload,
  );
  return response.data;
};
