import { IApiResponse } from "@/types/apiResponse.type";
import apiClient from "@/lib/axios";
import { IUploadResponse, IUploadParams } from "@/types/upload.types";

export const uploadFile = async ({
  file,
}: IUploadParams): Promise<IApiResponse<IUploadResponse>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
