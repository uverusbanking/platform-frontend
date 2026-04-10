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
} from "@/types";

export const AuthService = {
  getPublicKey: () =>
    api.get<{ message: string; data: { public_key: string } }>(
      "/api/v1/auth/public-key",
    ),
  register: (data: RegisterDto) =>
    api.post<MessageResponseDto>("/api/v1/auth/register", data), // TODO: Verify if registration is public or org-invitation based

  login: (data: LoginDto) =>
    api.post<AuthResponseDto>("/api/v1/customers/personal/auth/login", data),

  verify2FACode: (data: Verify2FACodeDto) =>
    api.post<AuthResponseDto>(
      "/api/v1/customers/personal/auth/verify-code",
      data,
    ),

  sendOtp: (data: SendOtpDto) =>
    api.post<MessageResponseDto>(
      "/api/v1/customers/personal/auth/resend-forgot-otp",
      data,
    ),

  verifyOtp: (data: VerifyOtpDto) =>
    api.post<MessageResponseDto>(
      "/api/v1/customers/personal/auth/verify-forgot-otp",
      data,
    ),

  resendOtp: (data: ResendOtpDto) =>
    api.post<MessageResponseDto>(
      "/api/v1/customers/personal/auth/resend-forgot-otp",
      data,
    ),

  forgotPassword: (data: ForgotPasswordDto) =>
    api.post<MessageResponseDto>(
      "/api/v1/customers/personal/auth/forgot-password",
      data,
    ),

  resetPassword: (data: ResetPasswordDto) =>
    api.post<MessageResponseDto>(
      "/api/v1/customers/personal/auth/reset-password",
      data,
    ),
};
