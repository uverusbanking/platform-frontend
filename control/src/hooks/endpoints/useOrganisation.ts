import apiClient from "@/lib/axios";
import {
  IGetOrganisationsParams,
  IGetOrganisationsResponse,
} from "@/types/organisation.types";
import { IApiResponse } from "@/types/apiResponse.type";
import {
  IApiKey,
  ICreateApiKeyPayload,
  IGenerateApiKeyResponse,
  IOrganisationDocument,
  IOrganisation,
} from "@/types/organisation.types";

import {
  IGetOrganisationUsersParams,
  IGetOrganisationUsersResponse,
  IAddOrganisationUserPayload,
  IGetOrganisationStatsParams,
  IOrganisationStatsSummary,
  IOrganisationStats,
} from "@/types/organisation.types";
import {
  ICheckOrganisationPayload,
  IRegisterOrganisationPayload,
  IUpdateOrganisationDocumentsPayload,
  IUpdateOrganisationPayload,
} from "@/types/organisation.types";

export const getOrganisations = async (
  params: IGetOrganisationsParams,
): Promise<IGetOrganisationsResponse> => {
  const response = await apiClient.get<IGetOrganisationsResponse>(
    "/organisations/platform",
    { params },
  );
  return response.data;
};

export const getOrganisationUsers = async (
  params: IGetOrganisationUsersParams,
): Promise<IGetOrganisationUsersResponse> => {
  const { organisationId, ...queryParams } = params;

  if (!organisationId) {
    throw new Error("organisationId is required");
  }

  // The API returns { status, data: IUser[], meta: {...} } at the root level
  const response = await apiClient.get(
    `/organisations/platform/${organisationId}/members`,
    {
      params: queryParams,
    },
  );

  // Extract meta from the root response, not from response.data
  const responseData = response.data;

  return {
    users: responseData.data || [],
    meta: responseData.meta || {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
  };
};

export const addOrganisationUser = async (
  payload: IAddOrganisationUserPayload & { organisationId: string },
): Promise<IApiResponse<unknown>> => {
  const { organisationId, ...data } = payload;
  const response = await apiClient.post(
    `/organisations/platform/${organisationId}/members`,
    data,
  );
  return response.data;
};

export const updateOrganisationUser = async (
  payload: Partial<IAddOrganisationUserPayload> & { userId: string },
): Promise<IApiResponse<unknown>> => {
  const { userId, ...data } = payload;
  const response = await apiClient.patch(`/organisation/users/${userId}`, data);
  return response.data;
};

export const deleteOrganisationUser = async (
  userId: string,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.delete(`/organisation/users/${userId}`);
  return response.data;
};

export const getApiKeys = async (
  environment: "LIVE" | "SANDBOX",
): Promise<IApiKey[]> => {
  const response = await apiClient.get(
    `/organisation/api-keys?environment=${environment}`,
  );
  return response.data.data;
};

export const createApiKey = async (
  payload: ICreateApiKeyPayload,
): Promise<IApiResponse<IGenerateApiKeyResponse>> => {
  const response = await apiClient.post("/organisation/api-keys", payload);
  return response.data;
};

export const deleteApiKey = async (params: {
  id: string;
  environment: "LIVE" | "SANDBOX";
}): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.delete(
    `/organisation/api-keys/${params.id}`,
    {
      params: { environment: params.environment },
    },
  );
  return response.data;
};

export const getOrganisationDocuments = async (
  organisationId: string,
): Promise<IOrganisationDocument[]> => {
  const response = await apiClient.get<IApiResponse<IOrganisationDocument[]>>(
    `/organisations/platform/${organisationId}/documents`,
  );
  return response.data.data;
};

export interface IUpdateDocumentStatusPayload {
  documentId: string;
  status: "APPROVED" | "DECLINED" | "PENDING";
  reason?: string;
}

export const updateOrganisationDocumentStatus = async (
  payload: IUpdateDocumentStatusPayload,
): Promise<IApiResponse<unknown>> => {
  const { documentId, ...data } = payload;
  const response = await apiClient.patch(
    `/organisations/platform/documents/${documentId}/status`,
    data,
  );
  return response.data;
};

export const getOrganisationStatistics = async (
  params?: IGetOrganisationStatsParams,
): Promise<IApiResponse<IOrganisationStatsSummary>> => {
  const response = await apiClient.get("/organisations/platform/stats", {
    params,
  });
  return response.data;
};

export const getOrganisationStatsById = async (
  id: string,
  params?: IGetOrganisationStatsParams,
): Promise<IApiResponse<IOrganisationStats>> => {
  const response = await apiClient.get(`/organisations/platform/stats`, {
    params: { ...params, organisationId: id },
  });
  return response.data;
};

export const registerOrganisation = async (
  payload: IRegisterOrganisationPayload,
): Promise<IApiResponse<IOrganisation>> => {
  const response = await apiClient.post(
    "/organisations/platform/register",
    payload,
  );
  return response.data;
};

export const checkOrganisationExists = async (
  payload: ICheckOrganisationPayload,
): Promise<IApiResponse<boolean>> => {
  const response = await apiClient.post(
    "/organisation/check-if-organisation-exists",
    payload,
  );
  return response.data;
};

export const updateOrganisation = async (
  payload: IUpdateOrganisationPayload & { id: string },
): Promise<IApiResponse<IOrganisation>> => {
  const { id, ...data } = payload;
  const response = await apiClient.patch(`/organisations/platform/${id}`, data);
  return response.data;
};

export const updateOrganisationDocuments = async (
  payload: IUpdateOrganisationDocumentsPayload & { id: string },
): Promise<IApiResponse<unknown>> => {
  const { id, ...data } = payload;
  const response = await apiClient.patch(
    `/organisations/platform/${id}/documents`,
    data,
  );
  return response.data;
};

export const getOrganisationById = async (
  id: string,
): Promise<IApiResponse<IOrganisation>> => {
  const response = await apiClient.get(`/organisations/platform/${id}`);
  return response.data;
};
