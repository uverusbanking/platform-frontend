import { api } from "@/lib/api";
import type {
  ValidateBvnDto,
  ValidateBvnResponseDto,
  SubmitKycDto,
  SubmitKycResponseDto,
  DocumentUploadResponseDto,
  ApiResponse,
} from "@/types";

export const KycService = {
  validateBvn: (data: ValidateBvnDto) =>
    api.post<ApiResponse<ValidateBvnResponseDto>>(
      "/api/v1/kyc/bvn/validate",
      data,
    ),

  submitKyc: (data: SubmitKycDto) =>
    api.post<ApiResponse<SubmitKycResponseDto>>("/api/v1/kyc/submit", data),

  uploadDocument: (file: File) =>
    api.uploadFile<ApiResponse<DocumentUploadResponseDto>>(
      "/api/v1/kyc/documents",
      file,
    ),
};
