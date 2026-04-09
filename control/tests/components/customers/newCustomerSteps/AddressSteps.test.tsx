/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mock, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { AddressSteps } from "@/components/features/customers/newCustomerSteps/AddressSteps";
import { useGetLocations } from "@/hooks/queries/useOptionsQueries";
import { ICustomerData } from "@/components/features/customers/AddCustomerDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock the hook
vi.mock("@/hooks/queries/useOptionsQueries");
vi.mock("@/state/userStore");

// Mock UI components
vi.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange, value, disabled }: any) => (
    <div data-testid="select-wrapper">
      <select
        data-testid="mock-select"
        disabled={disabled}
        onChange={(e) => onValueChange(e.target.value)}
        value={value}
      >
        <option value="">Select...</option>
        {children}
      </select>
    </div>
  ),
  SelectTrigger: ({ children }: any) => <>{children}</>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => (
    <option value={value}>{children}</option>
  ),
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

const mockCustomerData: ICustomerData = {
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dob: "",
  gender: "MALE" as any,
  bvn: "",
  idType: "",
  idNumber: "",
  nin: "",
  occupation: "",
  employmentStatus: "",
  employer: "",
  monthlyIncome: "",
  nextOfKinFirstName: "",
  nextOfKinLastName: "",
  nextOfKinRelationship: "",
  nextOfKinPhone: "",
  nextOfKinAddress: "",
  middleName: "",
  idDocument: "",
  proofOfAddress: "",
  passportPhotograph: "",
  nextOfKinMiddleName: "",
};

describe("AddressSteps Component", () => {
  const nextStep = vi.fn();
  const prevStep = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useGetLocations as Mock).mockReturnValue({
      data: { data: [] },
      isLoading: false,
    });
    queryClient.clear();
  });

  it("renders correctly and loads countries", async () => {
    (useGetLocations as Mock).mockImplementation((parentSlug) => {
      if (parentSlug === undefined)
        return {
          data: { data: [{ name: "Nigeria", slug: "nigeria", id: "1" }] },
          isLoading: false,
        };
      return { data: { data: [] }, isLoading: false };
    });

    await act(async () => {
      render(
        <AddressSteps
          data={mockCustomerData}
          nextStep={nextStep}
          prevStep={prevStep}
        />,
        { wrapper },
      );
    });

    expect(screen.getAllByText(/Address Information/i)[0]).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Nigeria" })).toBeInTheDocument();
  });

  it("resets state and city when country changes", async () => {
    (useGetLocations as Mock).mockImplementation((parentSlug) => {
      if (!parentSlug)
        return {
          data: {
            data: [
              { name: "Nigeria", slug: "nigeria", id: "1" },
              { name: "Ghana", slug: "ghana", id: "2" },
            ],
          },
          isLoading: false,
        };
      return { data: { data: [] }, isLoading: false };
    });

    const dataWithCountry = {
      ...mockCustomerData,
      country: "nigeria",
      state: "lagos",
      city: "ikeja",
    };
    render(
      <AddressSteps
        data={dataWithCountry}
        nextStep={nextStep}
        prevStep={prevStep}
      />,
      { wrapper },
    );

    const selects = screen.getAllByTestId("mock-select");

    // Change country to ghana
    fireEvent.change(selects[0], { target: { value: "ghana" } });

    await waitFor(() => {
      expect(selects[1]).toHaveValue("");
      expect(selects[2]).toHaveValue("");
    });
  });

  it("calls nextStep with form data on submit", async () => {
    (useGetLocations as Mock).mockImplementation((parentSlug) => {
      if (!parentSlug)
        return {
          data: { data: [{ name: "Nigeria", slug: "nigeria", id: "1" }] },
          isLoading: false,
        };
      if (parentSlug === "nigeria")
        return {
          data: { data: [{ name: "Lagos", slug: "lagos", id: "11" }] },
          isLoading: false,
        };
      if (parentSlug === "lagos")
        return {
          data: { data: [{ name: "Ikeja", slug: "ikeja", id: "111" }] },
          isLoading: false,
        };
      return { data: { data: [] }, isLoading: false };
    });

    render(
      <AddressSteps
        data={mockCustomerData}
        nextStep={nextStep}
        prevStep={prevStep}
      />,
      { wrapper },
    );

    fireEvent.change(
      screen.getByPlaceholderText(/Enter full street address/i),
      { target: { value: "123 Street" } },
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter postal code/i), {
      target: { value: "123456" },
    });

    const selects = screen.getAllByTestId("mock-select");

    await act(async () => {
      fireEvent.change(selects[0], { target: { value: "nigeria" } });
    });

    await waitFor(() => expect(selects[1]).not.toBeDisabled());

    await act(async () => {
      fireEvent.change(selects[1], { target: { value: "lagos" } });
    });

    await waitFor(() => expect(selects[2]).not.toBeDisabled());

    await act(async () => {
      fireEvent.change(selects[2], { target: { value: "ikeja" } });
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /next/i }));
    });

    await waitFor(() => {
      expect(nextStep).toHaveBeenCalledWith(
        expect.objectContaining({
          address: "123 Street",
          country: "nigeria",
          state: "lagos",
          city: "ikeja",
        }),
      );
    });
  });
});
