import { ICompany } from "./company.types";

export interface IUser {
  id: string;
  organisation_id: string;
  email: string;
  phone_number: string;
  role: string;
  permissions?: string[];
  status: string;
  gender: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  kyc_verified: boolean;
  kyc_level: number;
  kyc_id: string | null;
  created_at: string;
  updated_at: string;
  view_mode: "LIVE" | "SANDBOX";
  organisation: ICompany;
  kyc: Record<string, unknown>;
}
