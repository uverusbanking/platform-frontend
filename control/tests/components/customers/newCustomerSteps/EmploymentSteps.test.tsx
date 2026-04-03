/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, act } from "@testing-library/react";
import { EmploymentSteps } from "@/components/features/customers/newCustomerSteps/EmploymentSteps";
import {
  useGetEmploymentStatuses,
  useGetNextOfKinRelationships,
} from "@/hooks/queries/useOptionsQueries";
import { ICustomerData } from "@/components/features/customers/AddCustomerDialog";

jest.mock("@/hooks/queries/useOptionsQueries");

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

describe("EmploymentSteps", () => {
  const nextStep = jest.fn();
  const prevStep = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGetEmploymentStatuses as jest.Mock).mockReturnValue({
      data: { data: [{ label: "Employed", value: "employed" }] },
      isLoading: false,
    });
    (useGetNextOfKinRelationships as jest.Mock).mockReturnValue({
      data: { data: [{ label: "Spouse", value: "spouse" }] },
      isLoading: false,
    });
  });

  it("renders and loads data", async () => {
    await act(async () => {
      render(
        <EmploymentSteps
          data={mockCustomerData}
          nextStep={nextStep}
          prevStep={prevStep}
        />,
      );
    });
    expect(
      screen.getAllByText(/Employment Information/i)[0],
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Employed" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Spouse" })).toBeInTheDocument();
  });
});
