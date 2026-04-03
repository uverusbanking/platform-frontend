import { renderHook, waitFor } from "@testing-library/react";
import { useGetWallets } from "@/hooks/endpoints/useWallet";
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
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: {
        status: "success",
        data: mockWallets,
      },
    });

    const params = { customer_id: "c1", environment: "LIVE" as const };
    const { result } = renderHook(() => useGetWallets(params), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.get).toHaveBeenCalledWith("/wallets", { params });
    expect(result.current.data?.data).toEqual(mockWallets);
  });

  it("should fetch all wallets if customer_id is missing", () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { status: "success", data: [] },
    });
    renderHook(() => useGetWallets({}), { wrapper });
    expect(apiClient.get).toHaveBeenCalledWith("/wallets", { params: {} });
  });
});
