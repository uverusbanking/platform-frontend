import { api } from "@/lib/api";
import type {
  UserResponseDto,
  UpdateProfileDto,
  KycStatusResponseDto,
  ApiResponse,
} from "@/types";

export const UserService = {
  getProfile: () => api.get<ApiResponse<UserResponseDto>>("/api/v1/users/me"),

  updateProfile: (data: UpdateProfileDto) =>
    api.patch<ApiResponse<UserResponseDto>>("/api/v1/users/me", data),

  getKycStatus: () =>
    api.get<ApiResponse<KycStatusResponseDto>>("/api/v1/users/kyc/status"),

  changePassword: (data: { old_password: string; new_password: string }) =>
    api.put<ApiResponse<{ message: string }>>(
      "/api/v1/account/change-password",
      data,
    ),

  requestAccountDeletion: () =>
    api.delete<ApiResponse<{ message: string }>>("/api/v1/account/me"),
};
