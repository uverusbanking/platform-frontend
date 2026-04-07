import { useQuery } from "@tanstack/react-query";
import { PLATFORM_API_KEY } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";

export interface Bank {
  bank_name: string;
  bank_code: string;
  logo: string;
}

export const useBanks = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["payment", "banks"],
    queryFn: async (): Promise<Bank[]> => {
      // Use PLATFORM_API_KEY as base URL based on recent user edits
      const baseUrl = PLATFORM_API_KEY.replace(/\/$/, ""); // Remove trailing slash if present

      const response = await fetch(`${baseUrl}/api/v1/transfers/banks`, {
        headers: {
          accept: "*/*",
          // Use the token from AuthContext
          Authorization: `Bearer ${accessToken}`,
          // User also kept x-api-key in previous code, but typically Bearer token is enough.
          // Given the context of "pass token", I will prioritize Authorization header.
          // If the API requires an API Key as well, it should be in constants as a separate value,
          // but PLATFORM_API_KEY is currently acting as Base URL.
          // I will replicate the headers from the original code but add Authorization.
          "x-api-key": PLATFORM_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      let rawBanks: Bank[] = [];

      // Structure 1: { status: 200, data: { success: true, data: [...] } }
      if (
        data.status === 200 &&
        data.data?.success &&
        Array.isArray(data.data.data)
      ) {
        rawBanks = data.data.data;
      }
      // Structure 2: { status: 'success', data: [...] }
      else if (data.status === "success" && Array.isArray(data.data)) {
        rawBanks = data.data;
      }
      // Structure 3: { data: [...] }
      else if (Array.isArray(data.data)) {
        rawBanks = data.data;
      }
      // Structure 4: Direct array
      else if (Array.isArray(data)) {
        rawBanks = data;
      }

      if (rawBanks.length > 0) {
        // Deduplicate by bank_code and sort
        return Array.from(
          new Map(rawBanks.map((item) => [item.bank_code, item])).values(),
        ).sort((a, b) => a.bank_name.localeCompare(b.bank_name));
      }

      if (rawBanks.length === 0) {
        // Return empty array if no banks found, or throw error?
        // Original code set error state. Throwing error allows useQuery to handle 'isError'.
        throw new Error("No banks found");
      }

      return [];
    },
    enabled: !!accessToken, // Only run if we have a token
  });
};
