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

export const useGetLocations = (parent_slug?: string) => {
  return useQuery<IApiResponse<ILocation[]>, TError>({
    queryKey: [QUERY_KEYS.OPTIONS.LOCATIONS, parent_slug],
    queryFn: () => getLocations(parent_slug),
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
