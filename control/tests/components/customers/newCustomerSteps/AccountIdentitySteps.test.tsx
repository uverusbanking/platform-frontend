/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, act } from "@testing-library/react";
import { AccountIdentitySteps } from "@/components/features/customers/newCustomerSteps/AccountIdentitySteps";
import { useGetKYCDocumentTypes } from "@/hooks/queries/useOptionsQueries";
import { ICustomerData } from "@/components/features/customers/AddCustomerDialog";
import { useUserStore } from "@/state/userStore";

jest.mock("@/hooks/queries/useOptionsQueries");
jest.mock("@/state/userStore");

// Mock UI components
jest.mock("@/components/ui/select", () => ({
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
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => (
    <option value={value}>{children}</option>
  ),
}));

const mockCustomerData: ICustomerData = {
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  first_name: "John",
  last_name: "Doe",
  email: "john@doe.com",
  phone_number: "",
  date_of_birth: "",
  gender: "",
  bvn: "",
  kyc_level: 1,
  environment: "SANDBOX",
  idType: "",
  idNumber: "",
  occupation: "",
  employmentStatus: "",
  employer: "",
  monthlyIncome: "",
  nextOfKinFirstName: "",
  nextOfKinLastName: "",
  nextOfKinRelationship: "",
  nextOfKinPhone: "",
  nextOfKinAddress: "",
};

describe("AccountIdentitySteps", () => {
  const nextStep = jest.fn();
  const prevStep = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGetKYCDocumentTypes as jest.Mock).mockReturnValue({
      data: { data: [{ label: "Passport", value: "PASSPORT" }] },
      isLoading: false,
    });
    (useUserStore as any).mockReturnValue({
      userData: { view_mode: "SANDBOX" },
    });
  });

  it("renders and loads ID types", async () => {
    await act(async () => {
      render(
        <AccountIdentitySteps
          data={mockCustomerData}
          nextStep={nextStep}
          prevStep={prevStep}
        />,
      );
    });
    expect(
      screen.getAllByText(/Identity Verification/i)[0],
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Passport" }),
    ).toBeInTheDocument();
  });
});
