/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, act } from "@testing-library/react";
import { AccountIdentitySteps } from "./AccountIdentitySteps";
import { useGetKYCDocumentTypes } from "@/hooks/endpoints/useOptionsHook";
import { ICustomerData } from "../AddCustomerDialog";
import { useUserStore } from "@/state/userStore";

jest.mock("@/hooks/endpoints/useOptionsHook");
jest.mock("@/state/userStore");

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
