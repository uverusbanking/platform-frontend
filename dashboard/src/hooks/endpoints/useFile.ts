import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";
import { IFileUploadResponse, IUploadFilePayload } from "@/types/file.types";

export const uploadFile = async (
  payload: IUploadFilePayload,
): Promise<IApiResponse<IFileUploadResponse>> => {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("documentType", payload.documentType);
  if (payload.userId) formData.append("userId", payload.userId);
  if (payload.fileType) formData.append("fileType", payload.fileType);

  const response = await apiClient.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "*/*",
    },
  });
  return response.data;
};
