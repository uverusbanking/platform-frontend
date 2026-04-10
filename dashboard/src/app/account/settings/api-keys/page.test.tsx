import type { PropsWithChildren } from "react";
import { render, screen } from "@testing-library/react";
import ApiKeysSettingsPage from "./page";
import { useUserStore } from "@/state/userStore";
import {
  useCreateApiKey,
  useDeleteApiKey,
} from "@/hooks/mutations/useApiKeysMutations";
import { useGetApiKeys } from "@/hooks/queries/useApiKeysQueries";

vi.mock("@/state/userStore");
vi.mock("@/hooks/queries/useApiKeysQueries");
vi.mock("@/hooks/mutations/useApiKeysMutations");

const MockWrapper = require("react").forwardRef(
  ({ children }: PropsWithChildren, ref: any) => (
    <div ref={ref}>{children}</div>
  ),
);

vi.mock("@/components/ui/dialog", () => ({
  Dialog: MockWrapper,
  DialogContent: MockWrapper,
  DialogHeader: MockWrapper,
  DialogTitle: MockWrapper,
  DialogDescription: MockWrapper,
  DialogFooter: MockWrapper,
}));

vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: MockWrapper,
  AlertDialogContent: MockWrapper,
  AlertDialogHeader: MockWrapper,
  AlertDialogTitle: MockWrapper,
  AlertDialogDescription: MockWrapper,
  AlertDialogFooter: MockWrapper,
  AlertDialogCancel: MockWrapper,
  AlertDialogAction: MockWrapper,
}));

vi.mock("@/components/ui/select", () => ({
  Select: MockWrapper,
  SelectTrigger: MockWrapper,
  SelectValue: MockWrapper,
  SelectContent: MockWrapper,
  SelectItem: MockWrapper,
}));

describe("API Keys Settings Page", () => {
  const mockedUseUserStore = useUserStore as vi.MockedFunction<
    typeof useUserStore
  >;
  const mockedUseGetApiKeys = useGetApiKeys as vi.MockedFunction<
    typeof useGetApiKeys
  >;
  const mockedUseCreateApiKey = useCreateApiKey as vi.MockedFunction<
    typeof useCreateApiKey
  >;
  const mockedUseDeleteApiKey = useDeleteApiKey as vi.MockedFunction<
    typeof useDeleteApiKey
  >;

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseUserStore.mockReturnValue({
      userData: { view_mode: "LIVE" },
    });
    mockedUseGetApiKeys.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    mockedUseCreateApiKey.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
    mockedUseDeleteApiKey.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it("renders the header and empty state", () => {
    render(<ApiKeysSettingsPage />);

    expect(
      screen.getByRole("heading", { name: /api keys/i, level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/manage keys for accessing the api/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/no api keys yet/i)).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /create api key/i }).length,
    ).toBeGreaterThan(0);
  });

  it("renders loading skeletons when API keys are loading", () => {
    mockedUseGetApiKeys.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    const { container } = render(<ApiKeysSettingsPage />);

    expect(screen.queryByText(/no api keys yet/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/unable to load api keys/i),
    ).not.toBeInTheDocument();
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
  });

  it("renders error state when API keys fail to load", () => {
    mockedUseGetApiKeys.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    render(<ApiKeysSettingsPage />);

    expect(screen.getByText(/unable to load api keys/i)).toBeInTheDocument();
    expect(screen.getByText(/please try again/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("renders API keys when data is available", () => {
    mockedUseGetApiKeys.mockReturnValue({
      data: {
        data: [
          {
            id: "key-1",
            name: "Primary Key",
            environment: "LIVE",
            key_prefix: "pk_live_",
            created_at: "2024-01-02T12:00:00.000Z",
            last_used_at: null,
            keySecret: "secret",
          },
        ],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<ApiKeysSettingsPage />);

    expect(screen.getByText("Primary Key")).toBeInTheDocument();
    expect(screen.getAllByText("LIVE").length).toBeGreaterThan(0);
    expect(screen.getByText("pk_live_******")).toBeInTheDocument();
    expect(screen.getByText("Jan 2, 2024")).toBeInTheDocument();
    expect(screen.getByText("Never")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /revoke api key/i }),
    ).toBeInTheDocument();
  });
});
