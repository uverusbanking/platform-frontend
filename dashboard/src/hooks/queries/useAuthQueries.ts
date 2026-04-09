import { useQuery } from "@tanstack/react-query";
import { IApiResponse, TError } from "@/types/apiResponseType";
import { IPublicKey } from "@shared/core";
import { getEncryptionPublicKey } from "@/hooks/endpoints/useAuth";

export const useGetEncryptionPublicKey = () => {
  return useQuery<IApiResponse<IPublicKey>, TError>({
    queryKey: ["encryption-public-key"],
    queryFn: getEncryptionPublicKey,
  });
};
