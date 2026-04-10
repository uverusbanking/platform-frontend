/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, act } from "@testing-library/react";
import { AccountIdentitySteps } from "./AccountIdentitySteps";
import { useGetKYCDocumentTypes } from "@/hooks/queries/useOptionsQueries";
import { ICustomerData } from "../AddCustomerDialog";
import { useUserStore } from "@/state/userStore";

vi.mock("@/hooks/queries/useOptionsQueries");
vi.mock("@/state/userStore");

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

describe("AccountIdentitySteps", () => {
  const nextStep = vi.fn();
  const prevStep = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useGetKYCDocumentTypes as vi.Mock).mockReturnValue({
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
