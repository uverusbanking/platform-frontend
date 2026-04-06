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
} from "@/types";

export const AuthService = {
  register: (data: RegisterDto) =>
    api.post<MessageResponseDto>("/api/v1/auth/register", data),

  login: (data: LoginDto) =>
    api.post<AuthResponseDto>("/api/v1/auth/login", data),

  sendOtp: (data: SendOtpDto) =>
    api.post<MessageResponseDto>("/api/v1/auth/send-otp", data),

  verifyOtp: (data: VerifyOtpDto) =>
    api.post<MessageResponseDto>("/api/v1/auth/verify-otp", data),

  resendOtp: (data: ResendOtpDto) =>
    api.post<MessageResponseDto>("/api/v1/auth/resend-otp", data),

  forgotPassword: (data: ForgotPasswordDto) =>
    api.post<MessageResponseDto>("/api/v1/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordDto) =>
    api.post<MessageResponseDto>("/api/v1/auth/reset-password", data),
};
