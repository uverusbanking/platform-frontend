import { IApiResponse } from "@/types/apiResponse.type";
import { IRole } from "@/types/user.types";
import apiClient from "@/lib/axios";

export interface IPlatformStats {
  total_organisations: number;
  total_active_organisations: number;
  total_pending_organisations: number;
  total_customers: number;
  total_balance: number;
  kyc_statistics: {
    upload_percentage: number;
    approval_percentage: number;
  };
}

export const getPlatformStats = async (): Promise<
  IApiResponse<IPlatformStats>
> => {
  const response = await apiClient.get("/statistics/dashboard");
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
