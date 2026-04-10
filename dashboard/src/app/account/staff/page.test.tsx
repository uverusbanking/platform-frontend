/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import Staff from "./page";
import { useGetCompanyUsers } from "@/hooks/queries/useCompanyQueries";
import {
  useAddBrandUser,
  useUpdateBrandUser,
  useDeleteBrandUser,
} from "@/hooks/mutations/useCompanyMutations";
import { useGetEncryptionPublicKey } from "@/hooks/queries/useAuthQueries";
import { encryptPassword } from "@shared/core";

// Mock the hooks
vi.mock("@/hooks/queries/useCompanyQueries");
vi.mock("@/hooks/mutations/useCompanyMutations");
vi.mock("@/hooks/queries/useAuthQueries");
vi.mock("@/utils/encryption");

// Mock UI components that are hard to interact with in JSDOM
vi.mock("@/components/ui/select", () => {
  const React = require("react");
  return {
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
    SelectTrigger: React.forwardRef(() => null),
    SelectValue: React.forwardRef(() => null),
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ children, value }: any) => (
      <option value={value}>{children}</option>
    ),
  };
});

vi.mock("@/components/ui/dialog", () => {
  const React = require("react");
  return {
    Dialog: ({ children }: any) => (
      <div className="mock-dialog">{children}</div>
    ),
    DialogTrigger: React.forwardRef(({ children }: any, ref: any) => (
      <div ref={ref}>{children}</div>
    )),
    DialogContent: React.forwardRef(({ children }: any, ref: any) => (
      <div ref={ref} className="mock-dialog-content">
        {children}
      </div>
    )),
    DialogHeader: ({ children }: any) => <div>{children}</div>,
    DialogTitle: ({ children }: any) => <div>{children}</div>,
    DialogDescription: ({ children }: any) => <div>{children}</div>,
    DialogFooter: ({ children }: any) => <div>{children}</div>,
  };
});

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
    vi.clearAllMocks();
    (useGetEncryptionPublicKey as vi.Mock).mockReturnValue({
      data: {
        data: { public_key: "test-key" },
      },
      isLoading: false,
      isError: false,
    });
    (useAddBrandUser as vi.Mock).mockReturnValue({
      mutate: vi.fn(),
    });
    (useUpdateBrandUser as vi.Mock).mockReturnValue({
      mutate: vi.fn(),
    });
    (useDeleteBrandUser as vi.Mock).mockReturnValue({
      mutate: vi.fn(),
    });
  });

  it("renders loading state initially", () => {
    (useGetCompanyUsers as vi.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<Staff />);
    expect(screen.getByText(/loading staff members/i)).toBeInTheDocument();
  });

  it("renders staff members correctly when data is fetched", () => {
    (useGetCompanyUsers as vi.Mock).mockReturnValue({
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
    const mutate = vi.fn();
    (useAddBrandUser as vi.Mock).mockReturnValue({
      mutate,
    });
    (useGetCompanyUsers as vi.Mock).mockReturnValue({
      data: {
        data: [],
        meta: {
          pagination: { total: 0, page: 1, per_page: 10, total_pages: 0 },
        },
      },
      isLoading: false,
      isError: false,
    });
    (encryptPassword as vi.Mock).mockResolvedValue("encrypted-password");

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
    (useGetCompanyUsers as vi.Mock).mockReturnValue({
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
    const mutate = vi.fn();
    (useUpdateBrandUser as vi.Mock).mockReturnValue({
      mutate,
    });
    (useGetCompanyUsers as vi.Mock).mockReturnValue({
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
    const mutate = vi.fn();
    (useDeleteBrandUser as vi.Mock).mockReturnValue({
      mutate,
    });
    (useGetCompanyUsers as vi.Mock).mockReturnValue({
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
