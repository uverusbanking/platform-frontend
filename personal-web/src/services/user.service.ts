import { api } from "@/lib/api";
import type {
  UserResponseDto,
  UpdateProfileDto,
  KycStatusResponseDto,
  ApiResponse,
} from "@/types";

export const UserService = {
  getProfile: () =>
    api.get<ApiResponse<UserResponseDto>>("/api/v1/customers/personal/auth/me"),

  updateProfile: (data: UpdateProfileDto) =>
    api.patch<ApiResponse<UserResponseDto>>("/api/v1/account/profile", data),

  getKycStatus: () =>
    api.get<ApiResponse<KycStatusResponseDto>>("/api/v1/users/kyc/status"),
};
