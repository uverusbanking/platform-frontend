import { useQuery } from "@tanstack/react-query";
import { TError, IApiResponse } from "@/types/apiResponse.type";
import {
  getLocations,
  getKYCDocumentTypes,
  getEmploymentStatuses,
  getNextOfKinRelationships,
} from "@/hooks/endpoints/useOption";
import {
  ILocation,
  IKYCDocumentType,
  IEmploymentStatus,
  IKinRelationship,
} from "@/types/option.types";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { IGetLocationPayload } from "@shared/core";

export const useGetLocations = (payload: IGetLocationPayload) => {
  return useQuery<IApiResponse<ILocation[]>, TError>({
    queryKey: [QUERY_KEYS.OPTIONS.LOCATIONS, payload.parent_id, payload.type],
    queryFn: () => getLocations(payload.parent_id, payload.type),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useGetKYCDocumentTypes = () => {
  return useQuery<IApiResponse<IKYCDocumentType[]>, TError>({
    queryKey: [QUERY_KEYS.OPTIONS.KYC_DOCUMENT_TYPES],
    queryFn: getKYCDocumentTypes,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useGetEmploymentStatuses = () => {
  return useQuery<IApiResponse<IEmploymentStatus[]>, TError>({
    queryKey: [QUERY_KEYS.OPTIONS.EMPLOYMENT_STATUSES],
    queryFn: getEmploymentStatuses,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useGetNextOfKinRelationships = () => {
  return useQuery<IApiResponse<IKinRelationship[]>, TError>({
    queryKey: [QUERY_KEYS.OPTIONS.NEXT_OF_KIN_RELATIONSHIPS],
    queryFn: getNextOfKinRelationships,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
