/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mock, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { EmploymentSteps } from "@/components/features/customers/newCustomerSteps/EmploymentSteps";
import {
  useGetEmploymentStatuses,
  useGetNextOfKinRelationships,
} from "@/hooks/queries/useOptionsQueries";
import { ICustomerData } from "@/components/features/customers/AddCustomerDialog";

vi.mock("@/hooks/queries/useOptionsQueries");

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

const mockCustomerData: ICustomerData = {
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  firstName: "John",
  lastName: "Doe",
  email: "john@doe.com",
  phoneNumber: "",
  dob: "",
  gender: "MALE" as any,
  bvn: "",
  nin: "",
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
  middleName: "",
  idDocument: "",
  proofOfAddress: "",
  passportPhotograph: "",
  nextOfKinMiddleName: "",
};

describe("EmploymentSteps", () => {
  const nextStep = vi.fn();
  const prevStep = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useGetEmploymentStatuses as Mock).mockReturnValue({
      data: { data: [{ label: "Employed", value: "employed" }] },
      isLoading: false,
    });
    (useGetNextOfKinRelationships as Mock).mockReturnValue({
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
          isCreatingCustomer={false}
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
