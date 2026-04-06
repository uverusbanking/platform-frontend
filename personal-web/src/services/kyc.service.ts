import { api } from "@/lib/api";
import type {
  ValidateBvnDto,
  ValidateBvnResponseDto,
  SubmitKycDto,
  SubmitKycResponseDto,
  DocumentUploadResponseDto,
} from "@/types";

export const KycService = {
  validateBvn: (data: ValidateBvnDto) =>
    api.post<ValidateBvnResponseDto>("/api/v1/kyc/bvn/validate", data),

  submitKyc: (data: SubmitKycDto) =>
    api.post<SubmitKycResponseDto>("/api/v1/kyc/submit", data),

  uploadDocument: (file: File) =>
    api.uploadFile<DocumentUploadResponseDto>("/api/v1/kyc/documents", file),
};
