import { useQuery } from "@tanstack/react-query";
import { TError } from "@/types/apiResponse.type";
import { getRoles, getFrozenFunds } from "@/hooks/endpoints/usePlatform";
import { getPlatformCustomerWallets as getPlatformCustomerWalletsList } from "@/hooks/endpoints/usePlatform";
import { getOrganisations } from "@/hooks/endpoints/useOrganisation";
import { IRole } from "@/types/user.types";
import {
  IGetOrganisationsParams,
  IGetOrganisationsResponse,
} from "@/types/organisation.types";
import {
  IGetPlatformCustomerWalletsParams,
  IGetCustomersWalletsResponse,
  IGetFrozenFundsParams,
  IGetFrozenFundsResponse,
} from "@/types/wallet.types";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useGetPlatformCustomerWallets = (
  params: IGetPlatformCustomerWalletsParams,
) => {
  return useQuery<IGetCustomersWalletsResponse, TError>({
    queryKey: [QUERY_KEYS.PLATFORM.CUSTOMER_WALLETS, params],
    queryFn: () => getPlatformCustomerWalletsList(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useGetOrganisations = (
  params: IGetOrganisationsParams = { page: 1, limit: 10 },
) => {
  return useQuery<IGetOrganisationsResponse, TError>({
    queryKey: [QUERY_KEYS.PLATFORM.ORGANISATIONS, params],
    queryFn: () => getOrganisations(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetFrozenFunds = (params: IGetFrozenFundsParams) => {
  return useQuery<IGetFrozenFundsResponse, TError>({
    queryKey: [QUERY_KEYS.WALLET.FROZEN_FUNDS, params],
    queryFn: () => getFrozenFunds(params),
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetRoles = (type: "PLATFORM" | "BRAND" = "PLATFORM") => {
  return useQuery<IRole[], TError>({
    queryKey: [QUERY_KEYS.PLATFORM.ROLES, type],
    queryFn: () => getRoles(type),
    staleTime: 1000 * 60 * 30, // 30 minutes - roles don't change often
  });
};
