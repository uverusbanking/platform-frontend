import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services";

export const PUBLIC_KEY_QUERY_KEY = ["public-key"] as const;

export function usePublicKey() {
  return useQuery({
    queryKey: PUBLIC_KEY_QUERY_KEY,
    queryFn: () => AuthService.getPublicKey(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
