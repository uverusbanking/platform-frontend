import { renderHook, waitFor } from "@testing-library/react";
import { useGetWallets } from "./useWalletHook";
import apiClient from "@/lib/axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock apiClient
jest.mock("@/lib/axios");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useGetWallets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("should fetch wallets successfully", async () => {
    const mockWallets = [
      {
        id: "w1",
        customer_id: "c1",
        account_number: "123",
        balance: 1000,
        currency: "NGN",
        status: "ACTIVE",
      },
    ];
    const mockResponse = {
      items: mockWallets,
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: {
        status: "success",
        data: mockResponse,
      },
    });

    const params = { customer_id: "c1", environment: "LIVE" as const };
    const { result } = renderHook(() => useGetWallets(params), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.get).toHaveBeenCalledWith("/wallets/organisation", {
      params,
    });
    expect(result.current.data?.data).toEqual(mockResponse);
  });

  it("should not fetch if customer_id is missing", () => {
    renderHook(() => useGetWallets({}), { wrapper });
    expect(apiClient.get).not.toHaveBeenCalled();
  });
});
