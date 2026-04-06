import { useQuery } from "@tanstack/react-query";
import { SecurityService } from "@/services";

export const usePinStatus = () => {
  return useQuery({
    queryKey: ["security", "pin-status"],
    queryFn: SecurityService.checkPinStatus,
  });
};
