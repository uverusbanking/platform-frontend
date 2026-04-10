/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, act } from "@testing-library/react";
import { EmploymentSteps } from "./EmploymentSteps";
import { ICustomerData } from "../AddCustomerDialog";
import {
  useGetEmploymentStatuses,
  useGetNextOfKinRelationships,
} from "@/hooks/queries/useOptionsQueries";

vi.mock("@/hooks/queries/useOptionsQueries");

// Mock UI components
vi.mock("@/components/ui/select", () => {
  const React = require("react");
  return {
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
    SelectTrigger: React.forwardRef(({ children }: any, ref: any) => (
      <div ref={ref}>{children}</div>
    )),
    SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ children, value }: any) => (
      <option value={value}>{children}</option>
    ),
  };
});

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
  const nextStep = vi.fn();
  const prevStep = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useGetEmploymentStatuses as vi.Mock).mockReturnValue({
      data: { data: [{ label: "Employed", value: "employed" }] },
      isLoading: false,
    });
    (useGetNextOfKinRelationships as vi.Mock).mockReturnValue({
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
