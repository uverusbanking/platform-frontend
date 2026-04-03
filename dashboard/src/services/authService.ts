import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import {
  ILoginPayload,
  IVerifyLoginPayload,
  IVerifyLoginResponse,
  IForgotPasswordPayload,
  IVerifyForgotOTPPayload,
  IVerifyForgotOTPResponse,
  IResetPasswordPayload,
  IResendForgotOTPPayload,
  IPublicKey,
  ILoginSuccessResponse,
} from "@/types/auth.types";

export const getEncryptionPublicKey = async (): Promise<
  IApiResponse<IPublicKey>
> => {
  const response = await apiClient.get(`/auth/public-key`);
  return response.data;
};

export const login = async (
  payload: ILoginPayload,
): Promise<IApiResponse<ILoginSuccessResponse>> => {
  const response = await apiClient.post("/auth/login", payload);
  return response.data;
};

export const verifyLogin = async (
  payload: IVerifyLoginPayload,
): Promise<IApiResponse<IVerifyLoginResponse>> => {
  const response = await apiClient.post("/auth/verify-code", payload);
  return response.data;
};

export const forgotPassword = async (
  payload: IForgotPasswordPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post("/auth/forgot-password", payload);
  return response.data;
};

export const verifyForgotOTP = async (
  payload: IVerifyForgotOTPPayload,
): Promise<IApiResponse<IVerifyForgotOTPResponse>> => {
  const response = await apiClient.post("/auth/verify-forgot-otp", payload);
  return response.data;
};

export const resetPassword = async (
  payload: IResetPasswordPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post("/auth/reset-password", payload);
  return response.data;
};

export const resendForgotOTP = async (
  payload: IResendForgotOTPPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post("/auth/resend-forgot-otp", payload);
  return response.data;
};
