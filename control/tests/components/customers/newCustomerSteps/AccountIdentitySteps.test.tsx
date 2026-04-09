/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mock, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AccountIdentitySteps } from "@/components/features/customers/newCustomerSteps/AccountIdentitySteps";
import { useGetKYCDocumentTypes } from "@/hooks/queries/useOptionsQueries";
import { ICustomerData } from "@/components/features/customers/AddCustomerDialog";
import { useUserStore } from "@/state/userStore";

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

describe("AccountIdentitySteps", () => {
  const nextStep = vi.fn();
  const prevStep = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useGetKYCDocumentTypes as Mock).mockReturnValue({
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
