import apiClient from "@/lib/axios";
import { IApiResponse } from "@/types/apiResponseType";

export interface IFileUploadResponse {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
}

export interface IUploadFilePayload {
  file: File;
  documentType: string;
  userType: string;
  userId?: string;
  fileType?: string;
}

export const uploadFile = async (
  payload: IUploadFilePayload,
): Promise<IApiResponse<IFileUploadResponse>> => {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("documentType", payload.documentType);
  formData.append("userType", payload.userType);
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
