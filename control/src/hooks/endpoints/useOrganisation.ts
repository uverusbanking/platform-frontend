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
  IRegisterOrganisationDirector,
  IUpdateOrganisationDocumentsPayload,
  IUpdateOrganisationPayload,
  IUpdateBrandSettingsPayload,
  IUpdateConfiguredDomainsPayload,
  IBrandConfig,
  IConfiguredDomain,
} from "@/types/organisation.types";

// --- API payload transformers (camelCase → snake_case) ---

function toSnakeDoc(doc: {
  id: string;
  fileUrl?: string;
  documentType: string;
}) {
  return { id: doc.id, fileUrl: doc.fileUrl, documentType: doc.documentType };
}

function toSnakeDirector(d: IRegisterOrganisationDirector) {
  return {
    first_name: d.firstName,
    last_name: d.lastName,
    middle_name: d.middleName,
    bvn: d.bvn,
    nin: d.nin,
    id_type: d.idType,
    id_document: toSnakeDoc(d.idDocument),
    street_address: d.streetAddress,
    city: d.city,
    state: d.state,
    zip_code: d.zipCode,
    country: d.country,
    ownership_percentage: d.ownershipPercentage,
    is_beneficial_owner: d.isBeneficialOwner,
  };
}

function toRegisterPayload(p: IRegisterOrganisationPayload) {
  return {
    organisation_name: p.organisationName,
    street_address: p.streetAddress,
    city: p.city,
    state: p.state,
    zip_code: p.zipCode,
    country: p.country,
    tin: p.tin,
    cac_number: p.cacNumber,
    business_email: p.businessEmail,
    business_phone: p.businessPhone,
    directors: p.directors.map(toSnakeDirector),
    documents: {
      cac_certificate: toSnakeDoc(p.documents.cacCertificate),
      memorandum: toSnakeDoc(p.documents.memorandum),
      board_resolution: toSnakeDoc(p.documents.boardResolution),
      proof_of_address: toSnakeDoc(p.documents.proofOfAddress),
      ubo_declaration: toSnakeDoc(p.documents.uboDeclaration),
    },
  };
}

function toUpdatePayload(p: IUpdateOrganisationPayload) {
  return {
    ...(p.organisationName !== undefined && {
      organisation_name: p.organisationName,
    }),
    ...(p.streetAddress !== undefined && { street_address: p.streetAddress }),
    ...(p.city !== undefined && { city: p.city }),
    ...(p.state !== undefined && { state: p.state }),
    ...(p.zipCode !== undefined && { zip_code: p.zipCode }),
    ...(p.country !== undefined && { country: p.country }),
    ...(p.tin !== undefined && { tin: p.tin }),
    ...(p.cacNumber !== undefined && { cac_number: p.cacNumber }),
    ...(p.businessEmail !== undefined && { business_email: p.businessEmail }),
    ...(p.businessPhone !== undefined && { business_phone: p.businessPhone }),
    ...(p.status !== undefined && { status: p.status }),
    ...(p.provision_sandbox_token !== undefined && {
      provision_sandbox_token: p.provision_sandbox_token,
    }),
    ...(p.live_organisation_id !== undefined && {
      live_organisation_id: p.live_organisation_id,
    }),
  };
}

function toUpdateDocumentsPayload(p: IUpdateOrganisationDocumentsPayload) {
  const docs = p.documents;
  const entries = [
    docs.cacCertificate,
    docs.memorandum,
    docs.boardResolution,
    docs.proofOfAddress,
    docs.uboDeclaration,
  ].filter((d): d is NonNullable<typeof d> => !!d);
  return { documents: entries.map(toSnakeDoc) };
}

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
    toRegisterPayload(payload),
  );
  return response.data;
};

export const checkOrganisationExists = async (
  payload: ICheckOrganisationPayload,
): Promise<IApiResponse<boolean>> => {
  const response = await apiClient.post(
    "/organisation/check-if-organisation-exists",
    {
      cac_registration_number: payload.cacRegistrationNumber,
      tin: payload.tin,
      business_email: payload.businessEmail,
    },
  );
  return response.data;
};

export const updateOrganisation = async (
  payload: IUpdateOrganisationPayload & { id: string },
): Promise<IApiResponse<IOrganisation>> => {
  const { id, ...data } = payload;
  const response = await apiClient.patch(
    `/organisations/platform/${id}`,
    toUpdatePayload(data),
  );
  return response.data;
};

export const updateOrganisationDocuments = async (
  payload: IUpdateOrganisationDocumentsPayload & { id: string },
): Promise<IApiResponse<unknown>> => {
  const { id, ...data } = payload;
  const response = await apiClient.patch(
    `/organisations/platform/${id}/documents`,
    toUpdateDocumentsPayload(data),
  );
  return response.data;
};

export const getOrganisationById = async (
  id: string,
): Promise<IApiResponse<IOrganisation>> => {
  const response = await apiClient.get(`/organisations/platform/${id}`);
  return response.data;
};

export const getOrgBrandSettings = async (
  id: string,
): Promise<IApiResponse<IBrandConfig>> => {
  const response = await apiClient.get(
    `/organisations/platform/${id}/brand-settings`,
  );
  return response.data;
};

export const getOrgConfiguredDomains = async (
  id: string,
): Promise<IApiResponse<{ configured_domains: IConfiguredDomain[] }>> => {
  const response = await apiClient.get(
    `/organisations/platform/${id}/configured-domains`,
  );
  return response.data;
};

export const updateBrandSettings = async (
  payload: IUpdateBrandSettingsPayload,
): Promise<IApiResponse<unknown>> => {
  const { id, brand } = payload;
  const response = await apiClient.patch(
    `/organisations/platform/${id}/brand-settings`,
    brand,
  );
  return response.data;
};

export const updateConfiguredDomains = async (
  payload: IUpdateConfiguredDomainsPayload,
): Promise<IApiResponse<unknown>> => {
  const { id, configured_domains } = payload;
  const response = await apiClient.patch(
    `/organisations/platform/${id}/configured-domains`,
    { configured_domains },
  );
  return response.data;
};
