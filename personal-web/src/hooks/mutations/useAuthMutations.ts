import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services";
import type {
  RegisterDto,
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  ResendOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "@/types";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterDto) => AuthService.register(data),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginDto) => AuthService.login(data),
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("sb-access-token", data.accessToken);
      // Invalidate user queries to refetch with new token
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (data: SendOtpDto) => AuthService.sendOtp(data),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpDto) => AuthService.verifyOtp(data),
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: ResendOtpDto) => AuthService.resendOtp(data),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordDto) => AuthService.forgotPassword(data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordDto) => AuthService.resetPassword(data),
  });
};
