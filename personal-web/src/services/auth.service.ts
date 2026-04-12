import { api } from "@/lib/api";
import type {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  SendOtpDto,
  VerifyOtpDto,
  ResendOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  MessageResponseDto,
  Verify2FACodeDto,
  ValidateBvnDto,
  ValidateBvnResponseDto,
  ApiResponse,
} from "@/types";

export const AuthService = {
  getPublicKey: () =>
    api.get<{ message: string; data: { public_key: string } }>(
      "/api/v1/auth/public-key",
    ),

  validateBvn: (data: ValidateBvnDto) =>
    api.post<ApiResponse<ValidateBvnResponseDto>>(
      "/api/v1/customers/personal/auth/validate-bvn",
      data,
    ),

  register: (data: RegisterDto) =>
    api.post<ApiResponse<MessageResponseDto>>(
      "/api/v1/customers/personal/auth/register",
      data,
    ),

  login: (data: LoginDto) =>
    api.post<ApiResponse<AuthResponseDto>>(
      "/api/v1/customers/personal/auth/login",
      data,
    ),

  verify2FACode: (data: Verify2FACodeDto) =>
    api.post<ApiResponse<AuthResponseDto>>(
      "/api/v1/customers/personal/auth/verify-code",
      data,
    ),

  sendOtp: (data: SendOtpDto) =>
    api.post<ApiResponse<MessageResponseDto>>(
      "/api/v1/customers/personal/auth/resend-forgot-otp",
      data,
    ),

  verifyOtp: (data: VerifyOtpDto) =>
    api.post<ApiResponse<MessageResponseDto>>(
      "/api/v1/customers/personal/auth/verify-forgot-otp",
      data,
    ),

  resendOtp: (data: ResendOtpDto) =>
    api.post<ApiResponse<MessageResponseDto>>(
      "/api/v1/customers/personal/auth/resend-forgot-otp",
      data,
    ),

  forgotPassword: (data: ForgotPasswordDto) =>
    api.post<ApiResponse<MessageResponseDto>>(
      "/api/v1/customers/personal/auth/forgot-password",
      data,
    ),

  resetPassword: (data: ResetPasswordDto) =>
    api.post<ApiResponse<MessageResponseDto>>(
      "/api/v1/customers/personal/auth/reset-password",
      data,
    ),
};
