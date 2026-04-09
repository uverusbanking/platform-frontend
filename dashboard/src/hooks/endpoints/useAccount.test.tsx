import { renderHook } from "@testing-library/react";
import { useUpdateProfile } from "../mutations/useAccountMutations";
import apiClient from "@/lib/axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserStore } from "@/state/userStore";
import React from "react";

// Mock apiClient and useUserStore
jest.mock("@/lib/axios");
jest.mock("@/state/userStore");
jest.mock("../mutations/useAccountMutations", () => ({
  useUpdateProfile: jest.requireActual("../mutations/useAccountMutations")
    .useUpdateProfile,
}));

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
  const mockUpdateUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUserStore as any).mockReturnValue({
      _updateUser: mockUpdateUser,
      userData: { id: "1", first_name: "Original", last_name: "Name" },
    });
  });

  it("should call apiClient.patch and update user store on success", async () => {
    const mockData = { id: "1", first_name: "John", last_name: "Doe" };
    (apiClient.patch as jest.Mock).mockResolvedValue({
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
      gender: "MALE",
    };

    await result.current.mutateAsync(payload);

    expect(apiClient.patch).toHaveBeenCalledWith("/account/profile", payload);
    expect(mockUpdateUser).toHaveBeenCalledWith(mockData);
  });
});
