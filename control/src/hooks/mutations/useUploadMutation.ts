import { useMutation } from "@tanstack/react-query";
import { IUploadResponse, IUploadParams } from "@/types/upload.types";
import { uploadFile } from "@/hooks/endpoints/useUpload";
import { IApiResponse, TError } from "@/types/apiResponse.type";

export const useUploadMutation = () => {
  return useMutation<IApiResponse<IUploadResponse>, TError, IUploadParams>({
    mutationFn: uploadFile,
  });
};
