/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import Staff from "./page";
import {
  useGetCompanyUsers,
  useAddBrandUser,
  useUpdateBrandUser,
  useDeleteBrandUser,
} from "@/hooks/endpoints/useCompanyHook";
import { useGetEncryptionPublicKey } from "@/hooks/endpoints/useAuthHook";
import { encryptPassword } from "@/utils/encryption";

// Mock the hooks
jest.mock("@/hooks/endpoints/useCompanyHook");
jest.mock("@/hooks/endpoints/useAuthHook");
jest.mock("@/utils/encryption");

// Mock UI components that are hard to interact with in JSDOM
jest.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange, value }: any) => (
    <select
      data-testid="mock-select"
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

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: any) => <div className="mock-dialog">{children}</div>,
  DialogTrigger: ({ children }: any) => <>{children}</>,
  DialogContent: ({ children }: any) => (
    <div className="mock-dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

const mockStaffData = [
  {
    id: "88751b80-51aa-40f0-b204-f57c21e5ce20",
    company_id: "42edeb96-a666-48ad-a679-aa0fdffd7264",
    email: "sundaywht@gmail.com",
    phone_number: "+2348108786933",
    role: "BRAND_ADMIN",
    status: "ACTIVE",
    gender: "MALE",
    first_name: "NugaPay",
    last_name: "Staff",
    middle_name: "",
    email_verified_at: null,
    phone_verified_at: null,
    kyc_verified: false,
    kyc_level: 0,
    kyc_id: null,
    created_at: "2025-12-23T14:00:23.357Z",
    updated_at: "2026-01-01T00:43:33.243Z",
    kyc: null,
  },
];

describe("Staff Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useGetEncryptionPublicKey as jest.Mock).mockReturnValue({
      data: {
        data: { public_key: "test-key" },
      },
      isLoading: false,
      isError: false,
    });
    (useAddBrandUser as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });
    (useUpdateBrandUser as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });
    (useDeleteBrandUser as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });
  });

  it("renders loading state initially", () => {
    (useGetCompanyUsers as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<Staff />);
    expect(screen.getByText(/loading staff members/i)).toBeInTheDocument();
  });

  it("renders staff members correctly when data is fetched", () => {
    (useGetCompanyUsers as jest.Mock).mockReturnValue({
      data: {
        data: mockStaffData,
        meta: {
          pagination: { total: 1, page: 1, per_page: 10, total_pages: 1 },
        },
      },
      isLoading: false,
      isError: false,
    });

    render(<Staff />);

    expect(screen.getByText("NugaPay Staff")).toBeInTheDocument();
    expect(screen.getByText("sundaywht@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("brand admin")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("opens add staff dialog and submits correctly", async () => {
    const mutate = jest.fn();
    (useAddBrandUser as jest.Mock).mockReturnValue({
      mutate,
    });
    (useGetCompanyUsers as jest.Mock).mockReturnValue({
      data: {
        data: [],
        meta: {
          pagination: { total: 0, page: 1, per_page: 10, total_pages: 0 },
        },
      },
      isLoading: false,
      isError: false,
    });
    (encryptPassword as jest.Mock).mockResolvedValue("encrypted-password");

    render(<Staff />);

    // Open Dialog
    fireEvent.click(screen.getByRole("button", { name: /^add staff$/i }));

    // Scope to Add Modal
    const modal = screen
      .getByText(/add new staff member/i)
      .closest(".mock-dialog-content");
    const { getByLabelText, getAllByTestId, getByRole } = within(
      modal as HTMLElement,
    );

    // Fill Form
    fireEvent.change(getByLabelText(/first name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(getByLabelText(/last name/i), {
      target: { value: "Smith" },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "jane@test.com" },
    });
    fireEvent.change(getByLabelText(/phone number/i), {
      target: { value: "+2348123456789" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "@Password123" },
    });

    // Select Role
    const roleSelect = getAllByTestId("mock-select")[0];
    fireEvent.change(roleSelect, { target: { value: "BRAND_SUPPORT" } });

    // Select Gender
    const genderSelect = getAllByTestId("mock-select")[1];
    fireEvent.change(genderSelect, { target: { value: "FEMALE" } });

    // Submit
    fireEvent.click(getByRole("button", { name: /add staff member/i }));

    await waitFor(() => {
      expect(mutate).toHaveBeenCalled();
    });

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: "Jane",
        last_name: "Smith",
        role: "BRAND_SUPPORT",
      }),
      expect.any(Object),
    );
  });

  it("opens view details modal correctly", () => {
    (useGetCompanyUsers as jest.Mock).mockReturnValue({
      data: {
        data: mockStaffData,
        meta: {
          pagination: { total: 1, page: 1, per_page: 10, total_pages: 1 },
        },
      },
      isLoading: false,
      isError: false,
    });

    render(<Staff />);

    fireEvent.click(screen.getByLabelText(/view details/i));

    const modal = screen
      .getByText(/staff details/i)
      .closest(".mock-dialog-content");
    expect(modal).toBeInTheDocument();
    expect(
      within(modal as HTMLElement).getByText(/NugaPay Staff/i),
    ).toBeInTheDocument();
  });

  it("opens edit modal, pre-fills data, and submits correctly", async () => {
    const mutate = jest.fn();
    (useUpdateBrandUser as jest.Mock).mockReturnValue({
      mutate,
    });
    (useGetCompanyUsers as jest.Mock).mockReturnValue({
      data: {
        data: mockStaffData,
        meta: {
          pagination: { total: 1, page: 1, per_page: 10, total_pages: 1 },
        },
      },
      isLoading: false,
      isError: false,
    });

    render(<Staff />);

    fireEvent.click(screen.getByLabelText(/edit staff/i));

    const modal = screen
      .getByText(/edit staff member/i)
      .closest(".mock-dialog-content");
    const { findByDisplayValue, getByLabelText, getByRole } = within(
      modal as HTMLElement,
    );

    // Check pre-filled data using findByDisplayValue (builtin waitFor)
    expect(await findByDisplayValue("NugaPay")).toBeInTheDocument();
    expect(await findByDisplayValue("Staff")).toBeInTheDocument();
    // email is removed from edit form

    // Modify a field
    fireEvent.change(getByLabelText(/first name/i), {
      target: { value: "UpdatedName" },
    });

    // Submit
    fireEvent.click(getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(mutate).toHaveBeenCalled();
    });

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: "UpdatedName",
      }),
      expect.any(Object),
    );
  });

  it("opens delete confirmation and submits correctly", async () => {
    const mutate = jest.fn();
    (useDeleteBrandUser as jest.Mock).mockReturnValue({
      mutate,
    });
    (useGetCompanyUsers as jest.Mock).mockReturnValue({
      data: {
        data: mockStaffData,
        meta: {
          pagination: { total: 1, page: 1, per_page: 10, total_pages: 1 },
        },
      },
      isLoading: false,
      isError: false,
    });

    render(<Staff />);

    fireEvent.click(screen.getByLabelText(/delete staff/i));

    const modal = screen
      .getByText(/are you sure you want to delete/i)
      .closest(".mock-dialog-content");
    const { getByRole } = within(modal as HTMLElement);

    fireEvent.click(getByRole("button", { name: /delete staff/i }));

    await waitFor(() => {
      expect(mutate).toHaveBeenCalled();
    });

    expect(mutate).toHaveBeenCalledWith(
      mockStaffData[0].id,
      expect.any(Object),
    );
  });
});
