import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SecurityService } from "@/services";
import type {
  VerifyPinDto,
  SetPinDto,
  ChangePinDto,
  ResetPinDto,
} from "@/types";

export const useVerifyPin = () => {
  return useMutation({
    mutationFn: (data: VerifyPinDto) => SecurityService.verifyPin(data),
  });
};

export const useSetPin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SetPinDto) => SecurityService.setPin(data),
    onSuccess: () => {
      // Invalidate PIN status to refetch updated status
      queryClient.invalidateQueries({ queryKey: ["security", "pin-status"] });
    },
  });
};

export const useChangePin = () => {
  return useMutation({
    mutationFn: (data: ChangePinDto) => SecurityService.changePin(data),
  });
};

export const useInitiatePinReset = () => {
  return useMutation({
    mutationFn: () => SecurityService.initiatePinReset(),
  });
};

export const useResetPin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResetPinDto) => SecurityService.resetPin(data),
    onSuccess: () => {
      // Invalidate PIN status to refetch updated status
      queryClient.invalidateQueries({ queryKey: ["security", "pin-status"] });
    },
  });
};
