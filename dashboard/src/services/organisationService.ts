import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";

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

export const getOrganisationStats = async (): Promise<
  IApiResponse<IOrganisationStats>
> => {
  const response = await apiClient.get("/organisation/stats");
  return response.data;
};

export const getOrganisation = async (): Promise<
  IApiResponse<IOrganisation>
> => {
  const response = await apiClient.get("/organisation/me");
  return response.data;
};

export const updateOrganisation = async (
  payload: IUpdateOrganisationPayload,
): Promise<IApiResponse<IOrganisation>> => {
  const response = await apiClient.patch("/organisation/me", payload);
  return response.data;
};

export const getOrganisationDocuments = async (): Promise<
  IApiResponse<IOrganisationDocument[]>
> => {
  const response = await apiClient.get("/organisation/documents");
  return response.data;
};

export const updateOrganisationDocuments = async (
  payload: IUpdateDocumentsPayload,
): Promise<IApiResponse<IOrganisationDocument[]>> => {
  const response = await apiClient.patch("/organisation/documents", payload);
  return response.data;
};
