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
  ValidateBvnDto,
} from "@/types";

export const usePublicValidateBvn = () => {
  return useMutation({
    mutationFn: async (data: ValidateBvnDto) => {
      const response = await AuthService.validateBvn(data);
      return response.data;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterDto) => AuthService.register(data),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginDto) => {
      const response = await AuthService.login(data);
      return response.data;
    },
    onSuccess: (data) => {
      sessionStorage.setItem("sb-access-token", data.access_token);
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
