import { IApiResponse, TError } from "@/types/apiResponse.type";
import {
  ILoginPayload,
  ILoginResponse,
  IPublicKey,
  IVerifyLoginPayload,
  IVerifyLoginResponse,
} from "@/types/auth.types";
import apiClient from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const response = await apiClient.post("/auth/login", payload);
  return response.data;
};

const verifyLogin = async (
  payload: IVerifyLoginPayload,
): Promise<IVerifyLoginResponse> => {
  const response = await apiClient.post("/auth/verify-code", payload);
  return response.data.data;
};

export const useVerifyLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<IVerifyLoginResponse, TError, IVerifyLoginPayload>({
    mutationFn: verifyLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AUTH.COMPANY_LOGIN],
      });
      // You might want to show a success toast message here
      // toast.success(data.message || "Profile updated successfully", {description: ""});
    },
  });
};

const forgotPassword = async (payload: {
  email: string;
  type: "PLATFORM";
}): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post("/auth/forgot-password", payload);
  return response.data;
};

export const useForgotPassword = () => {
  return useMutation<
    IApiResponse<unknown>,
    TError,
    { email: string; type: "PLATFORM" }
  >({
    mutationFn: forgotPassword,
  });
};

const verifyForgotOtp = async (payload: {
  email: string;
  type: "PLATFORM";
  otp: string;
}): Promise<{ session_id: string }> => {
  const response = await apiClient.post("/auth/verify-forgot-otp", payload);
  return response.data;
};

export const useVerifyForgotOtp = () => {
  return useMutation<
    { session_id: string },
    TError,
    { email: string; type: "PLATFORM"; otp: string }
  >({
    mutationFn: verifyForgotOtp,
  });
};

export const resetPassword = async (payload: {
  session_id: string;
  new_password: string;
}): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post("/auth/reset-password", payload);
  return response.data;
};
