import { IApiResponse } from "@/types/apiResponse.type";
import { IRole } from "@/types/user.types";
import {
  IGetPlatformCustomerWalletsParams,
  IGetCustomersWalletsResponse,
  IGetFrozenFundsParams,
  IGetFrozenFundsResponse,
} from "@/types/wallet.types";
import apiClient from "@/lib/axios";

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
