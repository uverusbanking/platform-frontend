import { Mock, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileSettingsPage from "@/app/account/settings/profile/page";
import { useUserStore } from "@/state/userStore";
import { useUpdateProfile } from "@/hooks/endpoints/useAccount";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

vi.mock("@/state/userStore");
vi.mock("@/hooks/endpoints/useAccount");

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
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
    const user = userEvent.setup();
    render(<ProfileSettingsPage />, { wrapper });

    // findByLabelText waits for the useEffect reset() to populate the form
    const firstNameInput = await screen.findByLabelText(/First Name/i);
    expect(firstNameInput).toHaveValue("Original");
    expect(await screen.findByLabelText(/Last Name/i)).toHaveValue("Name");
    expect(screen.getByLabelText(/Email/i)).toHaveValue("test@example.com");

    // userEvent properly triggers RHF's onChange and dirty tracking
    // whereas fireEvent.change only fires the DOM change event and can
    // miss RHF's internal value/dirty state update in jsdom
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "John");

    const lastNameInput = screen.getByLabelText(/Last Name/i);
    await user.clear(lastNameInput);
    await user.type(lastNameInput, "Doe");

    // Wait for isDirty to propagate before clicking — the button is disabled
    // when !isDirty and clicking a disabled button won't submit the form
    const submitButton = screen.getByRole("button", { name: /Save Changes/i });
    await waitFor(() => expect(submitButton).not.toBeDisabled());

    await user.click(submitButton);

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
