import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";

export interface ILocation {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  type: "country" | "region" | "state" | "lga";
  level: number;
  children?: ILocation[];
}

export interface IKYCDocumentType {
  label: string;
  value: string;
}

export interface IEmploymentStatus {
  label: string;
  value: string;
}

export interface IKinRelationship {
  label: string;
  value: string;
}

export const getLocations = async (
  parent_slug?: string,
): Promise<IApiResponse<ILocation[]>> => {
  const params = parent_slug ? { parent_slug } : {};
  const response = await apiClient.get("/options/locations", { params });
  return response.data;
};

export const getKYCDocumentTypes = async (): Promise<
  IApiResponse<IKYCDocumentType[]>
> => {
  const response = await apiClient.get("/options/kyc-document-types");
  return response.data;
};

export const getEmploymentStatuses = async (): Promise<
  IApiResponse<IEmploymentStatus[]>
> => {
  const response = await apiClient.get("/options/employment-statuses");
  return response.data;
};

export const getNextOfKinRelationships = async (): Promise<
  IApiResponse<IKinRelationship[]>
> => {
  const response = await apiClient.get("/options/next-of-kin-relationships");
  return response.data;
};
