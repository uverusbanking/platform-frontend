import { Mock, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileSettingsPage from "@/app/account/settings/profile/page";
import { useUserStore } from "@/state/userStore";
import { useUpdateProfile } from "@/hooks/endpoints/useAccount";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock the hooks
vi.mock("@/state/userStore");
vi.mock("@/hooks/endpoints/useAccount");

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("Settings Page - Profile Tab", () => {
  const mockUserData = {
    first_name: "Original",
    last_name: "Name",
    email: "test@example.com",
    phone_number: "+2340000000000",
    gender: "MALE",
  };

  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useUserStore as unknown as Mock).mockReturnValue({
      userData: mockUserData,
    });
    (useUpdateProfile as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("renders profile information and handles submission", async () => {
    render(<ProfileSettingsPage />, { wrapper });

    // Check if initial values are rendered
    expect(screen.getByLabelText(/First Name/i)).toHaveValue("Original");
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue("Name");
    expect(screen.getByLabelText(/Email/i)).toHaveValue("test@example.com");

    // Change some values
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: "John",
          last_name: "Doe",
        }),
        expect.any(Object),
      );
    });
  });
});
