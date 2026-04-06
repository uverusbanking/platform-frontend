import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KycService } from "@/services";
import type { ValidateBvnDto, SubmitKycDto } from "@/types";

export const useValidateBvn = () => {
  return useMutation({
    mutationFn: (data: ValidateBvnDto) => KycService.validateBvn(data),
  });
};

export const useSubmitKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitKycDto) => KycService.submitKyc(data),
    onSuccess: () => {
      // Invalidate KYC status to refetch updated status
      queryClient.invalidateQueries({ queryKey: ["user", "kyc-status"] });
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => KycService.uploadDocument(file),
    onSuccess: () => {
      // Invalidate KYC status to refetch updated status
      queryClient.invalidateQueries({ queryKey: ["user", "kyc-status"] });
    },
  });
};
