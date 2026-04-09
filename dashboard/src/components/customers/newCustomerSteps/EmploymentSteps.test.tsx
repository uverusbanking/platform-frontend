/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, act } from "@testing-library/react";
import { EmploymentSteps } from "./EmploymentSteps";
import { ICustomerData } from "../AddCustomerDialog";
import {
  useGetEmploymentStatuses,
  useGetNextOfKinRelationships,
} from "@/hooks/queries/useOptionsQueries";

jest.mock("@/hooks/queries/useOptionsQueries");

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
