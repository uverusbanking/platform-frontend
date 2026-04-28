import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import {
  IOrganisationStats,
  IOrganisation,
  IUpdateOrganisationPayload,
  IOrganisationDocument,
  IUpdateDocumentsPayload,
  IBrandConfig,
  IConfiguredDomains,
  IUpdateBrandSettingsPayload,
  IUpdateConfiguredDomainsPayload,
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

export const getBrandSettings = async (): Promise<
  IApiResponse<IBrandConfig>
> => {
  const response = await apiClient.get("/organisation/brand-settings");
  return response.data;
};

export const updateBrandSettings = async (
  payload: IUpdateBrandSettingsPayload,
): Promise<IApiResponse<IBrandConfig>> => {
  const response = await apiClient.patch(
    "/organisation/brand-settings",
    payload,
  );
  return response.data;
};

export const getConfiguredDomains = async (): Promise<
  IApiResponse<{ configured_domains: IConfiguredDomains }>
> => {
  const response = await apiClient.get("/organisation/configured-domains-list");
  return response.data;
};

export const updateConfiguredDomains = async (
  payload: IUpdateConfiguredDomainsPayload,
): Promise<IApiResponse<{ configured_domains: IConfiguredDomains }>> => {
  const response = await apiClient.patch(
    "/organisation/configured-domains",
    payload,
  );
  return response.data;
};
