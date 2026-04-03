import { renderHook, waitFor } from "@testing-library/react";
import {
  useGetLocations,
  useGetKYCDocumentTypes,
  useGetEmploymentStatuses,
  useGetNextOfKinRelationships,
} from "./useOptionsHook";
import apiClient from "@/lib/axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

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

describe("useOptionsHook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("useGetLocations fetches locations successfully", async () => {
    const mockLocations = [{ label: "Nigeria", value: "NG", slug: "nigeria" }];
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { status: "success", data: mockLocations },
    });

    const { result } = renderHook(() => useGetLocations("ng"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiClient.get).toHaveBeenCalledWith("/options/locations", {
      params: { parent_slug: "ng" },
    });
    expect(result.current.data?.data).toEqual(mockLocations);
  });

  it("useGetKYCDocumentTypes fetches KYC types successfully", async () => {
    const mockTypes = [{ label: "BVN", value: "BVN" }];
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { status: "success", data: mockTypes },
    });

    const { result } = renderHook(() => useGetKYCDocumentTypes(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiClient.get).toHaveBeenCalledWith("/options/kyc-document-types");
    expect(result.current.data?.data).toEqual(mockTypes);
  });

  it("useGetEmploymentStatuses fetches statuses successfully", async () => {
    const mockStatuses = [{ label: "Employed", value: "employed" }];
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { status: "success", data: mockStatuses },
    });

    const { result } = renderHook(() => useGetEmploymentStatuses(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiClient.get).toHaveBeenCalledWith("/options/employment-statuses");
    expect(result.current.data?.data).toEqual(mockStatuses);
  });

  it("useGetNextOfKinRelationships fetches relationships successfully", async () => {
    const mockRels = [{ label: "Spouse", value: "spouse" }];
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { status: "success", data: mockRels },
    });

    const { result } = renderHook(() => useGetNextOfKinRelationships(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiClient.get).toHaveBeenCalledWith(
      "/options/next-of-kin-relationships",
    );
    expect(result.current.data?.data).toEqual(mockRels);
  });
});
