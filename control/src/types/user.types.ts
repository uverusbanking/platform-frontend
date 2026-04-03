import { ROLES } from "@/auth/roles";
import { IOrganisation } from "./organisation.types";
import { PERMISSIONS } from "@/auth/permissions";
import { Gender } from "./enums";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
}

export interface IRole {
  name: string;
  value: string;
  type: string;
}

export interface IUpdateProfilePayload {
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone_number: string;
  gender: Gender;
}

export interface IUser {
  id: string;
  platform_id: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  role: (typeof ROLES)[keyof typeof ROLES];
  permissions: (typeof PERMISSIONS)[keyof typeof PERMISSIONS][];
  status: UserStatus;
  gender: Gender;
  created_at: string;
  updated_at?: string;
  // Optional or legacy fields
  organisation_id?: string;
  email_verified_at?: string | null;
  phone_verified_at?: string | null;
  kyc_verified?: boolean;
  kyc_level?: number;
  kyc_id?: string | null;
  view_mode?: "LIVE" | "SANDBOX";
  organisation?: IOrganisation;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kyc?: any;
}
