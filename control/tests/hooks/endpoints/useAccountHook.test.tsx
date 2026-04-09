import { Mock, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUpdateProfile } from "@/hooks/endpoints/useAccount";
import apiClient from "@/lib/axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserStore } from "@/state/userStore";
import { Gender } from "@/types/enums";
import React from "react";

// Mock apiClient and useUserStore
vi.mock("@/lib/axios");
vi.mock("@/state/userStore");

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

describe("useUpdateProfile", () => {
  const mockUpdateUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useUserStore as unknown as Mock).mockReturnValue({
      _updateUser: mockUpdateUser,
      userData: { id: "1", first_name: "Original", last_name: "Name" },
    });
  });

  it("should call apiClient.patch and update user store on success", async () => {
    const mockData = { id: "1", first_name: "John", last_name: "Doe" };
    (apiClient.patch as Mock).mockResolvedValue({
      data: {
        status: true,
        message: "Success",
        data: mockData,
      },
    });

    const { result } = renderHook(() => useUpdateProfile(), { wrapper });

    const payload = {
      first_name: "John",
      last_name: "Doe",
      phone_number: "+2348123456789",
      gender: Gender.MALE,
    };

    await result.current.mutateAsync(payload);

    expect(apiClient.patch).toHaveBeenCalledWith("/account/profile", payload);
    expect(mockUpdateUser).toHaveBeenCalledWith(mockData);
  });
});
