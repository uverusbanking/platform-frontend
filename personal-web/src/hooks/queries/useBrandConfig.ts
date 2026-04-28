import { useQuery } from "@tanstack/react-query";
import { BrandConfigService } from "@shared/core";

const API_BASE = import.meta.env.VITE_API_URL || "";

export function useBrandConfig() {
  return useQuery({
    queryKey: ["brand-config"],
    queryFn: async () => {
      const config = await BrandConfigService.forceRefresh(
        "personal",
        API_BASE,
      );
      BrandConfigService.applyToDocument(config);
      return config;
    },
    staleTime: 60 * 60 * 1000, // treat as fresh for 1 hour
    gcTime: 2 * 60 * 60 * 1000, // keep in cache for 2 hours
    refetchInterval: 60 * 60 * 1000, // passive background refresh every hour
    refetchOnWindowFocus: false,
    retry: false,
  });
}
