import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
    mutations: {
      onError: (error) => {
        const body = axios.isAxiosError(error)
          ? (error.response?.data as
              | { message?: string | string[] }
              | undefined)
          : undefined;
        const msg = Array.isArray(body?.message)
          ? body.message[0]
          : (body?.message ??
            (error as Error).message ??
            "An unexpected error occurred");
        toast.error(msg);
      },
    },
  },
});
