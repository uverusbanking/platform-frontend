import { IUser } from "@/types/user.types";

export interface IOrganisation {
  id: string;
  platform_id: string;
  organisation_name: string;
  cac_registration_number: string;
  tin: string;
  business_email: string;
  business_phone: string;
  registered_address_street: string;
  registered_address_city: string;
  registered_address_state: string;
  registered_address_postal_code: string;
  registered_address_country: string;
  document_cac_certificate: string;
  document_memorandum: string;
  document_board_resolution: string;
  document_proof_of_address: string;
  document_ubo_declaration: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
  kYCId: string;
  brand_settings?: IBrandConfig;
  configured_domains?: IConfiguredDomain[];
}

export interface IApiKey {
  id: string;
  name: string;
  key: string;
  environment: "LIVE" | "SANDBOX";
  created_at: string;
  updated_at: string;
}

export interface ICreateApiKeyPayload {
  name: string;
  environment: "LIVE" | "SANDBOX";
}

export interface IGenerateApiKeyResponse {
  id: string;
  name: string;
  key: string;
  environment: "LIVE" | "SANDBOX";
}

export interface IOrganisationDocument {
  id: string;
  organisation_id: string;
  name: string;
  file_url: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface IGetOrganisationsParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

/////
export interface IGetOrganisationsResponse {
  data: IOrganisation[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  statistics: {
    total_organisations: number;
    total_customers: number;
    total_balance: number;
    kyc_statistics: {
      upload_percentage: number;
      approval_percentage: number;
    };
  };
}

export interface IAddOrganisationUserPayload {
  email: string;
  phone_number: string;
  role: string;
  gender: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  password?: string;
}

export interface IGetOrganisationUsersParams {
  organisationId?: string;
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export interface IGetOrganisationUsersResponse {
  users: IUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IGetOrganisationStatsParams {
  startDate?: string;
  endDate?: string;
}

export interface IKycStatistics {
  approval_percentage: number;
  upload_percentage: number;
}

export interface IOrganisationTimeRange {
  end: string | number | undefined;
  start: string | number | undefined;
}

export interface IOrganisationStatsSummary {
  total_organisations: number;
  total_active_organisations: number;
  total_balance: number;
  total_customers: number;
  total_pending_organisations: number;
  kyc_statistics: IKycStatistics;
  time_range: IOrganisationTimeRange;
}

export interface IOrganisationStats {
  total_organisations: number;
  total_customers: number;
  total_balance: number;
  kyc_statistics: {
    upload_percentage: number;
    approval_percentage: number;
  };
  volume_change_percentage: number;
}

export interface IGetOrganisationStatsParams {
  startDate?: string;
  endDate?: string;
}

export interface IRegisterOrganisationDirector {
  firstName: string;
  lastName: string;
  middleName?: string;
  bvn: string;
  nin: string;
  idType: string;
  idDocument: { id: string; fileUrl?: string; documentType: string };
  streetAddress: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  ownershipPercentage: number;
  isBeneficialOwner: boolean;
}

export interface IRegisterOrganisationPayload {
  organisationName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  tin: string;
  cacNumber: string;
  businessEmail: string;
  businessPhone: string;
  directors: IRegisterOrganisationDirector[];
  documents: {
    cacCertificate: { id: string; fileUrl?: string; documentType: string };
    memorandum: { id: string; fileUrl?: string; documentType: string };
    boardResolution: { id: string; fileUrl?: string; documentType: string };
    proofOfAddress: { id: string; fileUrl?: string; documentType: string };
    uboDeclaration: { id: string; fileUrl?: string; documentType: string };
  };
}

export interface ICheckOrganisationPayload {
  cacRegistrationNumber: string;
  tin: string;
  businessEmail: string;
}

export interface IUpdateOrganisationPayload {
  organisationName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  tin?: string;
  cacNumber?: string;
  businessEmail?: string;
  businessPhone?: string;
  status?: string;
  provision_sandbox_token?: boolean;
  live_organisation_id?: string;
}

export interface IUpdateOrganisationDocumentsPayload {
  documents: {
    cacCertificate?: { id: string; fileUrl: string; documentType: string };
    memorandum?: { id: string; fileUrl: string; documentType: string };
    boardResolution?: { id: string; fileUrl: string; documentType: string };
    proofOfAddress?: { id: string; fileUrl: string; documentType: string };
    uboDeclaration?: { id: string; fileUrl: string; documentType: string };
  };
}

export interface IBrandSeo {
  title: string;
  description: string;
  author: string;
}

export interface IBrandConfig {
  brandName?: string;
  shortBrandName?: string;
  brandLogoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  supportEmail?: string;
  supportPhone?: string;
  websiteUrl?: string;
  privacyUrl?: string;
  termsUrl?: string;
  seo?: IBrandSeo;
}

export interface IConfiguredDomain {
  name: string;
  url: string;
}

export interface IUpdateBrandSettingsPayload {
  id: string;
  brand: IBrandConfig;
}

export interface IUpdateConfiguredDomainsPayload {
  id: string;
  configured_domains: IConfiguredDomain[];
}
