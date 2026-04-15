import { useQuery } from "@tanstack/react-query";
import { IApiResponse, TError } from "@/types/apiResponseType";
import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  getLocations,
  getKYCDocumentTypes,
  getEmploymentStatuses,
  getNextOfKinRelationships,
  type ILocation,
} from "@/hooks/endpoints/useOptions";
import {
  IKYCDocumentType,
  IEmploymentStatus,
  IKinRelationship,
} from "@/types/options.types";
import { IGetLocationPayload } from "@shared/core";

export const useGetLocations = (payload: IGetLocationPayload) => {
  return useQuery<IApiResponse<ILocation[]>, TError>({
    queryKey: [QUERY_KEYS.LOCATIONS, payload.parent_id, payload.type],
    queryFn: () => getLocations(payload.parent_id, payload.type),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useGetKYCDocumentTypes = () => {
  return useQuery<IApiResponse<IKYCDocumentType[]>, TError>({
    queryKey: [QUERY_KEYS.KYC_DOCUMENT_TYPES],
    queryFn: getKYCDocumentTypes,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useGetEmploymentStatuses = () => {
  return useQuery<IApiResponse<IEmploymentStatus[]>, TError>({
    queryKey: [QUERY_KEYS.EMPLOYMENT_STATUSES],
    queryFn: getEmploymentStatuses,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useGetNextOfKinRelationships = () => {
  return useQuery<IApiResponse<IKinRelationship[]>, TError>({
    queryKey: [QUERY_KEYS.NEXT_OF_KIN_RELATIONSHIPS],
    queryFn: getNextOfKinRelationships,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
