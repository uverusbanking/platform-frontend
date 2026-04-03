/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import Staff from "@/app/account/staff/page";
import { useGetPlatformUsers } from "@/hooks/queries/usePlatformUserQueries";
import {
  useCreatePlatformUser,
  useUpdatePlatformUser,
  useDeletePlatformUser,
} from "@/hooks/mutations/usePlatformUserMutations";
import { useGetRoles } from "@/hooks/queries/usePlatformQueries";
import { useGetEncryptionPublicKey } from "@/hooks/endpoints/useAuth";
import { encryptPassword } from "@/lib/encryption";
import { UserStatus } from "@/types/user.types";
import { Gender } from "@/types/enums";
import { ROLES } from "@/auth/roles";

// Mock the hooks - Updated to new paths
jest.mock("@/hooks/queries/usePlatformUserQueries");
jest.mock("@/hooks/queries/usePlatformQueries");
jest.mock("@/hooks/mutations/usePlatformUserMutations");
jest.mock("@/hooks/endpoints/useAuth");
jest.mock("@/state/userStore", () => ({
  useUserStore: jest.fn(),
}));
jest.mock("@/lib/encryption");

import { useUserStore } from "@/state/userStore";

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
  DialogTitle: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

const mockStaffData = [
  {
    id: "88751b80-51aa-40f0-b204-f57c21e5ce20",
    platform_id: "42edeb96-a666-48ad-a679-aa0fdffd7264",
    email: "sundaywht@gmail.com",
    phone_number: "+2348108786933",
    role: ROLES.PLATFORM_ADMIN,
    status: UserStatus.ACTIVE,
    gender: Gender.MALE,
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
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      userData: {
        platform_id: "test-platform-id",
        organisation_id: "test-org-id",
        first_name: "Test",
        last_name: "User",
      },
    });
    (useGetEncryptionPublicKey as jest.Mock).mockReturnValue({
      data: { public_key: "test-key" },
      isLoading: false,
      isError: false,
    });
    // Updated mocks to new hooks
    (useCreatePlatformUser as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });
    (useUpdatePlatformUser as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
    });
    (useDeletePlatformUser as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
    });
    (useGetRoles as jest.Mock).mockReturnValue({
      data: [
        { name: "Admin", value: ROLES.PLATFORM_ADMIN },
        { name: "Compliance", value: ROLES.PLATFORM_COMPLIANCE },
      ],
      isLoading: false,
    });
  });

  it("renders loading state initially", () => {
    (useGetPlatformUsers as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<Staff />);
    expect(screen.getByText(/loading staff members/i)).toBeInTheDocument();
  });

  it("renders staff members correctly when data is fetched", () => {
    (useGetPlatformUsers as jest.Mock).mockReturnValue({
      data: {
        data: mockStaffData,
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
    });

    render(<Staff />);

    expect(screen.getByText("NugaPay Staff")).toBeInTheDocument();
    expect(screen.getByText("sundaywht@gmail.com")).toBeInTheDocument();
    // Verify badge text which is transformed in component
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("opens add staff dialog and submits correctly", async () => {
    const mutateAsync = jest.fn().mockResolvedValue({ status: true });
    (useCreatePlatformUser as jest.Mock).mockReturnValue({
      mutateAsync,
      isPending: false,
    });
    (useGetPlatformUsers as jest.Mock).mockReturnValue({
      data: {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
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
      target: { value: "password123" },
    });

    // Select Role
    const roleSelect = getAllByTestId("mock-select")[0];
    fireEvent.change(roleSelect, {
      target: { value: ROLES.PLATFORM_COMPLIANCE },
    });

    // Select Gender
    const genderSelect = getAllByTestId("mock-select")[1];
    fireEvent.change(genderSelect, { target: { value: Gender.FEMALE } });

    // Submit
    fireEvent.click(getByRole("button", { name: /add staff member/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalled();
    });

    expect(mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: "Jane",
        last_name: "Smith",
        role: ROLES.PLATFORM_COMPLIANCE,
        status: UserStatus.ACTIVE,
      }),
      expect.any(Object),
    );
  });

  it("opens view details modal correctly", () => {
    (useGetPlatformUsers as jest.Mock).mockReturnValue({
      data: {
        data: mockStaffData,
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
    });

    render(<Staff />);

    fireEvent.click(screen.getByLabelText(/view details/i));

    const modal = screen
      .getByTestId("view-staff-title")
      .closest(".mock-dialog-content");
    expect(modal).toBeInTheDocument();
    expect(
      within(modal as HTMLElement).getAllByText(/NugaPay Staff/i)[0],
    ).toBeInTheDocument();
  });

  it("opens edit modal, pre-fills data, and submits correctly", async () => {
    const mutateAsync = jest.fn().mockResolvedValue({ status: true });
    (useUpdatePlatformUser as jest.Mock).mockReturnValue({
      mutateAsync,
    });
    (useGetPlatformUsers as jest.Mock).mockReturnValue({
      data: {
        data: mockStaffData,
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
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

    // Modify a field
    fireEvent.change(getByLabelText(/first name/i), {
      target: { value: "UpdatedName" },
    });

    // Submit
    fireEvent.click(getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalled();
    });

    expect(mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: "UpdatedName",
      }),
      expect.any(Object),
    );
  });

  it("opens delete confirmation and submits correctly", async () => {
    const mutateAsync = jest.fn().mockResolvedValue({ status: true });
    (useDeletePlatformUser as jest.Mock).mockReturnValue({
      mutateAsync,
    });
    (useGetPlatformUsers as jest.Mock).mockReturnValue({
      data: {
        data: mockStaffData,
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
    });

    render(<Staff />);

    const deleteButtons = screen.getAllByLabelText(/delete staff/i);
    fireEvent.click(deleteButtons[0]);

    const modal = screen
      .getByText(/are you sure you want to delete/i)
      .closest(".mock-dialog-content");
    const { getByRole } = within(modal as HTMLElement);

    fireEvent.click(getByRole("button", { name: /delete staff/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalled();
    });

    expect(mutateAsync).toHaveBeenCalledWith(
      mockStaffData[0].id,
      expect.any(Object),
    );
  });
});
