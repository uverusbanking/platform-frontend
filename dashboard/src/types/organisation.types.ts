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
  id?: string;
  name: string;
  url: string;
}

export interface IUpdateBrandSettingsPayload {
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

export interface IUpdateConfiguredDomainsPayload {
  configured_domains: { name: string; url: string }[];
}

export interface IOrganisationStats {
  members: {
    total: number;
    active: number;
  };
  documents: {
    total: number;
    pending: number;
  };
  kyc_level: number;
}

export interface IMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  [key: string]: unknown;
}

export interface IOrganisation {
  id: string;
  organisation_name: string;
  business_email: string;
  business_phone: string;
  registered_address_street: string;
  registered_address_city: string;
  registered_address_state: string;
  registered_address_postal_code: string;
  registered_address_country: string;
  description?: string;
  website?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
  members?: IMember[];
}

export interface IUpdateOrganisationPayload {
  name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  description?: string;
  website?: string;
  logo_url?: string;
}

export interface IOrganisationDocument {
  id: string;
  organisation_id: string;
  type: string;
  file_url: string;
  file_id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export type OrganisationDocumentType =
  | "CAC_CERTIFICATE"
  | "MEMORANDUM"
  | "BOARD_RESOLUTION"
  | "PROOF_OF_ADDRESS"
  | "UBO_DECLARATION";

export interface IUpdateDocumentPayload {
  type: OrganisationDocumentType;
  file_id: string;
  file_url: string;
}

export interface IUpdateDocumentsPayload {
  documents: IUpdateDocumentPayload[];
}
