import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import { IUser } from "@/types/user.types";
import { ICustomer, IRegisterNewCustomerPayload } from "@/types/customer.types";

// Types extracted from hooks
export interface ICreateCustomerPayload {
  kyc_level: number;
  company_id?: string;
  organisation_id?: string;
  environment: "LIVE" | "SANDBOX";
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_country: string;
  bvn: string;
  id_type: string;
  id_number: string;
  occupation: string;
  employment_status: string;
  passport_photograph_id?: string;
  middle_name?: string;
  nin?: string;
  id_file_id?: string;
  proof_of_address_id?: string;
  employer_name: string;
  employer_address: string;
  monthly_income: number;
  next_of_kin: {
    full_name: string;
    relationship: string;
    phone_number: string;
    address: string;
  };
}

export interface IGetCustomersParams {
  page: number;
  limit: number;
  environment: "LIVE" | "SANDBOX";
  search?: string;
  status?: string;
}

// export interface IGetCustomersResponse {
//   items: ICustomer[];
//   meta: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }

export interface IGetCustomersResponse {
  status: string;
  message: string;
  data: ICustomer[];
  errors: unknown;
  meta: {
    pagination: {
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
    };
  };
  timestamp: string;
}

export const createCustomer = async (
  payload: ICreateCustomerPayload,
): Promise<IApiResponse<IUser>> => {
  const response = await apiClient.post("/customers/organisation", payload);
  return response.data;
};

export const getCustomers = async (
  params: IGetCustomersParams,
): Promise<IGetCustomersResponse> => {
  const response = await apiClient.get("/customers/organisation", { params });
  return response.data;
};

export const getCustomer = async (
  id: string,
): Promise<IApiResponse<ICustomer>> => {
  const response = await apiClient.get(`/customers/organisation/${id}`);
  return response.data;
};

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

export const freezeCustomer = async (
  id: string,
  payload: IFreezeCustomerPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    `/customers/organisation/${id}/freeze`,
    payload,
  );
  return response.data;
};

export const unfreezeCustomer = async (
  id: string,
  payload: { justification: string },
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    `/customers/organisation/${id}/unfreeze`,
    payload,
  );
  return response.data;
};

export const registerNewCustomer = async (
  payload: IRegisterNewCustomerPayload,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.post(
    "/company/register-new-customer",
    payload,
  );
  return response.data;
};
