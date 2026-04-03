/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { AddressSteps } from "./AddressSteps";
import { useGetLocations } from "@/hooks/endpoints/useOptionsHook";
import { ICustomerData } from "../AddCustomerDialog";

// Mock the hook
jest.mock("@/hooks/endpoints/useOptionsHook");

// Mock UI components
jest.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange, value, disabled }: any) => (
    <select
      data-testid="mock-select"
      disabled={disabled}
      onChange={(e) => onValueChange(e.target.value)}
      value={value}
    >
      <option value="">Select...</option>
      {children}
    </select>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => (
    <option value={value}>{children}</option>
  ),
}));

const mockCustomerData: ICustomerData = {
  firstName: "John",
  lastName: "Doe",
  middleName: "",
  email: "john@doe.com",
  phoneNumber: "",
  dob: "",
  gender: "MALE",
  bvn: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Nigeria",
  idType: "",
  idNumber: "",
  nin: "",
  idDocument: "",
  proofOfAddress: "",
  passportPhotograph: "",
  occupation: "",
  employer: "",
  monthlyIncome: "",
  employmentStatus: "",
  nextOfKinFirstName: "",
  nextOfKinMiddleName: "",
  nextOfKinLastName: "",
  nextOfKinPhone: "",
  nextOfKinRelationship: "",
  nextOfKinAddress: "",
};

describe("AddressSteps Component", () => {
  const nextStep = jest.fn();
  const prevStep = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGetLocations as jest.Mock).mockReturnValue({
      data: { data: [] },
      isLoading: false,
    });
  });

  it("renders correctly and loads countries", async () => {
    (useGetLocations as jest.Mock).mockImplementation((parentSlug) => {
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
      );
    });

    expect(screen.getAllByText(/Address Information/i)[0]).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Nigeria" })).toBeInTheDocument();
  });

  it("resets state and city when country changes", async () => {
    (useGetLocations as jest.Mock).mockImplementation((parentSlug) => {
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
    (useGetLocations as jest.Mock).mockImplementation((parentSlug) => {
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
          postalCode: "123456",
        }),
      );
    });
  });
});
