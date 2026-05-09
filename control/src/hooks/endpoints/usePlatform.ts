import { IApiResponse } from "@/types/apiResponse.type";
import { IRole } from "@/types/user.types";
import {
  IGetPlatformCustomerWalletsParams,
  IGetCustomersWalletsResponse,
  IGetFrozenFundsParams,
  IGetFrozenFundsResponse,
} from "@/types/wallet.types";
import apiClient from "@/lib/axios";

export type NotificationChannel = "SMS" | "EMAIL" | "WHATSAPP" | "PUSH";
export type NotificationProviderType =
  | "MSA"
  | "BULK_SMS_NIGERIA"
  | "TERMII"
  | "TWILIO"
  | "SENDGRID"
  | "MAILGUN"
  | "SMTP"
  | "META_CLOUD"
  | "FIREBASE";

export interface INotificationConfig {
  id: string;
  owner_type: "PLATFORM" | "ORGANISATION";
  owner_id: string;
  channel: NotificationChannel;
  provider_type: NotificationProviderType;
  has_api_key: boolean;
  metadata: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export interface IUpsertNotificationConfigPayload {
  provider_type: NotificationProviderType;
  api_key?: string;
  metadata?: Record<string, string>;
}

export interface INotificationBalance {
  value: number;
  currency: string;
}

export const getPlatformNotificationConfigs = async (): Promise<
  IApiResponse<INotificationConfig[]>
> => {
  const response = await apiClient.get("/platform/notification-config");
  return response.data;
};

export const upsertPlatformNotificationConfig = async ({
  channel,
  payload,
}: {
  channel: NotificationChannel;
  payload: IUpsertNotificationConfigPayload;
}): Promise<IApiResponse<INotificationConfig>> => {
  const response = await apiClient.put(
    `/platform/notification-config/${channel}`,
    payload,
  );
  return response.data;
};

export const removePlatformNotificationConfig = async (
  channel: NotificationChannel,
): Promise<IApiResponse<unknown>> => {
  const response = await apiClient.delete(
    `/platform/notification-config/${channel}`,
  );
  return response.data;
};

export const getPlatformNotificationBalance = async (
  channel: NotificationChannel,
): Promise<IApiResponse<INotificationBalance>> => {
  const response = await apiClient.get(
    `/platform/notification-config/${channel}/balance`,
  );
  return response.data;
};

export const getPlatformCustomerWallets = async (
  params: IGetPlatformCustomerWalletsParams,
): Promise<IGetCustomersWalletsResponse> => {
  const response = await apiClient.get<IGetCustomersWalletsResponse>(
    `/platform/wallets/customers`,
    { params },
  );
  return response.data;
};

export const getFrozenFunds = async (
  params: IGetFrozenFundsParams,
): Promise<IGetFrozenFundsResponse> => {
  const response = await apiClient.get<IGetFrozenFundsResponse>(
    `/platform/wallets/frozen-funds`,
    { params },
  );
  return response.data;
};

export const getRoles = async (
  type: "PLATFORM" | "BRAND" = "PLATFORM",
): Promise<IRole[]> => {
  const response = await apiClient.get<IApiResponse<IRole[]>>(
    `/options/roles`,
    {
      params: { type },
    },
  );
  return response.data.data;
};
