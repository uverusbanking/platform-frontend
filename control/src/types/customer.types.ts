import { AccountType, Gender, IdType } from "./enums";

export type IVerifyNewCustomerRegistrationPayload = {
  company_id: string;
  environment: "LIVE" | "SANDBOX";
  email: string;
  bvn: string;
  phone_number: string;
  dob: string;
  gender: Gender | string;
};

export type IVerifyNewCustomerRegistrationResponse = {
  bvn: string;
  dob: string;
  firstName: string;
  lastName: string;
};

export type IRegisterNewCustomerPayload = {
  email: string;
  bvn: string;
  phoneNumber: string;
  gender: Gender;
  firstName: string;
  lastName: string;
  middleName: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  accountType: AccountType;
  officer: string;
  idType: IdType;
  idNumber: string;
  nin: string;
  idDocument: string;
  proofOfAddress: string;
  passportPhotograph: string;
  occupation: string;
  employer: string;
  monthlyIncome: string;
  employmentStatus: string;
  nextOfKinFirstName: string;
  nextOfKinMiddleName: string;
  nextOfKinLastName: string;
  nextOfKinPhone: string;
  nextOfKinRelationship: string;
  nextOfKinAddress: string;
};

export interface ICustomerKyc {
  id: string;
  user_id: string;
  user_type: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: string;
  nin: string | null;
  nin_verified_at: string | null;
  bvn: string | null;
  bvn_verified_at: string | null;
  id_type: string | null;
  id_number: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_country: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ICustomer {
  id: string;
  company_id: string;
  email: string;
  email_verified_at: string | null;
  phone_number: string;
  phone_verified_at: string | null;
  gender: string;
  date_of_birth: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  kyc_level: number;
  kyc_id: string;
  user_status: string;
  status: string;
  created_by_type: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  kyc?: ICustomerKyc;
}
export interface IFreezeCustomerPayload {
  category: "REGULATORY" | "SECURITY" | "USER";
  reason:
    | "AML_REVIEW"
    | "KYC_INCOMPLETE"
    | "NFIU_REQUEST"
    | "COURT_ORDER"
    | "SUSPECTED_FRAUD"
    | "USER_REQUEST"
    | "PARTNER_BANK_DIRECTIVE";
  referenceId: string;
}

export interface IGetCustomersParams {
  page: number;
  limit: number;
  environment: "LIVE" | "SANDBOX";
  search?: string;
  status?: string;
}

export interface ICustomerStats {
  totalCustomers: number;
  totalActiveCustomers: number;
  totalPendingCustomers: number;
}
