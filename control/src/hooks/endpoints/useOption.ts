import { IApiResponse } from "@/types/apiResponse.type";
import apiClient from "@/lib/axios";
import {
  ILocation,
  IKYCDocumentType,
  IEmploymentStatus,
  IKinRelationship,
} from "@/types/option.types";
import { IRole } from "@/types/user.types";

// Locations
export const getLocations = async (
  parent_slug?: string,
): Promise<IApiResponse<ILocation[]>> => {
  const params = parent_slug ? { parent_slug } : {};
  const response = await apiClient.get("/options/locations", { params });
  return response.data;
};

// KYC Document Types
export const getKYCDocumentTypes = async (): Promise<
  IApiResponse<IKYCDocumentType[]>
> => {
  const response = await apiClient.get("/options/kyc-document-types");
  return response.data;
};

// Employment Statuses
export const getEmploymentStatuses = async (): Promise<
  IApiResponse<IEmploymentStatus[]>
> => {
  const response = await apiClient.get("/options/employment-statuses");
  return response.data;
};

// Next of Kin Relationships
export const getNextOfKinRelationships = async (): Promise<
  IApiResponse<IKinRelationship[]>
> => {
  const response = await apiClient.get("/options/next-of-kin-relationships");
  return response.data;
};

// http://localhost:4000/api/v1/options/roles?type=PLATFORM
export const getRoles = async (
  type: "PLATFORM" | "ORGANIZATION",
): Promise<IApiResponse<IRole[]>> => {
  const response = await apiClient.get("/options/roles", { params: { type } });
  return response.data;
};
