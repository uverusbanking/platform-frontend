import { IApiResponse } from "@/types/apiResponse.type";
import { IRole } from "@/types/user.types";
import apiClient from "@/lib/axios";

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
