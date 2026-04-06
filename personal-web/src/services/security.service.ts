import { api } from "@/lib/api";
import type {
  PinResponseDto,
  VerifyPinDto,
  SetPinDto,
  ChangePinDto,
  ResetPinDto,
} from "@/types";

export const SecurityService = {
  checkPinStatus: () => api.get<PinResponseDto>("/api/v1/security/pin/status"),

  verifyPin: (data: VerifyPinDto) =>
    api.post<PinResponseDto>("/api/v1/security/pin/verify", data),

  setPin: (data: SetPinDto) =>
    api.post<PinResponseDto>("/api/v1/security/pin/set", data),

  changePin: (data: ChangePinDto) =>
    api.post<PinResponseDto>("/api/v1/security/pin/change-pin", data),

  initiatePinReset: () =>
    api.post<PinResponseDto>("/api/v1/security/pin/initiate-reset"),

  resetPin: (data: ResetPinDto) =>
    api.post<PinResponseDto>("/api/v1/security/pin/reset-pin", data),
};
