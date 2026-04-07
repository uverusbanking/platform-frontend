import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import { IVerifyLoginResponse } from "@/types/auth.types";
import {
  IPublicKey,
  ILoginPayload,
  ILoginResponse,
  IVerifyLoginPayload,
  IForgotPasswordPayload,
  IVerifyForgotOTPPayload,
  IVerifyForgotOTPResponse,
  IResetPasswordPayload,
  IResendForgotOTPPayload,
} from "@shared/types/auth.types";

export const getEncryptionPublicKey = async (): Promise<
  IApiResponse<IPublicKey>
> => {
  const response = await apiClient.get(`/auth/public-key`);
  return response.data;
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

export const forgotPassword = async (
  payload: IForgotPasswordPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    "/platform/auth/forgot-password",
    payload,
  );
  return response.data;
};

export const verifyForgotOTP = async (
  payload: IVerifyForgotOTPPayload,
): Promise<IApiResponse<IVerifyForgotOTPResponse>> => {
  const response = await apiClient.post(
    "/platform/auth/verify-forgot-otp",
    payload,
  );
  return response.data;
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

export const resendForgotOTP = async (
  payload: IResendForgotOTPPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    "/platform/auth/resend-forgot-otp",
    payload,
  );
  return response.data;
};
