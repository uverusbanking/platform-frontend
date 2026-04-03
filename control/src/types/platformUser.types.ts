import { IUser, UserStatus } from "@/types/user.types";
import { ROLES } from "@/auth/roles";
import { Gender } from "./enums";

export interface IGetPlatformUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: (typeof ROLES)[keyof typeof ROLES] | "all";
  status?: UserStatus;
}

export interface IGetPlatformUsersResponse {
  data: IUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ICreatePlatformUserPayload {
  platform_id?: string;
  email: string;
  phone_number: string;
  role: (typeof ROLES)[keyof typeof ROLES];
  status: UserStatus;
  gender: Gender;
  first_name: string;
  last_name: string;
  middle_name?: string;
  password?: string;
}

export interface IUpdatePlatformUserPayload {
  userId: string;
  email?: string;
  phone_number?: string;
  role?: (typeof ROLES)[keyof typeof ROLES];
  status?: UserStatus;
  gender?: Gender;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
}
