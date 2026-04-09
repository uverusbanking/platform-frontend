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

export const useGetLocations = (parent_slug?: string) => {
  return useQuery<IApiResponse<ILocation[]>, TError>({
    queryKey: ["locations", parent_slug], // Add 'locations' to keys if not present
    queryFn: () => getLocations(parent_slug),
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
