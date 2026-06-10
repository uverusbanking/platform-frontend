import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TError, IApiResponse } from "@/types/apiResponse.type";
import {
  getRoles,
  getPlatformNotificationConfigs,
  upsertPlatformNotificationConfig,
  removePlatformNotificationConfig,
  getPlatformNotificationBalance,
  getPlatformAuditLogs,
  getPlatformAuditLogDetail,
  type NotificationChannel,
  type INotificationConfig,
  type IUpsertNotificationConfigPayload,
  type INotificationBalance,
} from "@/hooks/endpoints/usePlatform";
import {
  getPlatformCustomerWallets as getPlatformCustomerWalletsList,
  getFrozenFunds,
} from "@/hooks/endpoints/usePlatform";
import type {
  IGetAuditLogsFilters,
  IAuditLogsResponse,
  IAuditLog,
} from "@/types/activity.types";
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
    staleTime: 1000 * 60 * 30,
  });
};

export const useGetPlatformNotificationConfigs = () => {
  return useQuery<IApiResponse<INotificationConfig[]>, TError>({
    queryKey: [QUERY_KEYS.PLATFORM.NOTIFICATION_CONFIG],
    queryFn: getPlatformNotificationConfigs,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpsertPlatformNotificationConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      channel,
      payload,
    }: {
      channel: NotificationChannel;
      payload: IUpsertNotificationConfigPayload;
    }) => upsertPlatformNotificationConfig({ channel, payload }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PLATFORM.NOTIFICATION_CONFIG],
      });
    },
  });
};

export const useRemovePlatformNotificationConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (channel: NotificationChannel) =>
      removePlatformNotificationConfig(channel),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PLATFORM.NOTIFICATION_CONFIG],
      });
    },
  });
};

export const useGetPlatformNotificationBalance = (
  channel: NotificationChannel,
  enabled = false,
) => {
  return useQuery<IApiResponse<INotificationBalance>, TError>({
    queryKey: [QUERY_KEYS.PLATFORM.NOTIFICATION_BALANCE, channel],
    queryFn: () => getPlatformNotificationBalance(channel),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetPlatformAuditLogs = (filters: IGetAuditLogsFilters) => {
  return useQuery<IAuditLogsResponse, TError>({
    queryKey: [QUERY_KEYS.PLATFORM.AUDIT_LOGS, filters],
    queryFn: () => getPlatformAuditLogs(filters),
    staleTime: 1000 * 30,
  });
};

export const useGetPlatformAuditLogDetail = (id: string) => {
  return useQuery<IApiResponse<IAuditLog>, TError>({
    queryKey: [QUERY_KEYS.PLATFORM.AUDIT_LOGS, "detail", id],
    queryFn: () => getPlatformAuditLogDetail(id),
    enabled: !!id,
  });
};
