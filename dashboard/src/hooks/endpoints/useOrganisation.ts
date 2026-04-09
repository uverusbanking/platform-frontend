import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import {
  IOrganisationStats,
  IOrganisation,
  IUpdateOrganisationPayload,
  IOrganisationDocument,
  IUpdateDocumentsPayload,
} from "@/types/organisation.types";

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
