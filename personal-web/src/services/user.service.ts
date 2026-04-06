import { api } from "@/lib/api";
import type {
  UserResponseDto,
  UpdateProfileDto,
  KycStatusResponseDto,
} from "@/types";

export const UserService = {
  getProfile: () => api.get<UserResponseDto>("/api/v1/users/me"),

  updateProfile: (data: UpdateProfileDto) =>
    api.patch<UserResponseDto>("/api/v1/users/me", data),

  getKycStatus: () => api.get<KycStatusResponseDto>("/api/v1/users/kyc/status"),
};
