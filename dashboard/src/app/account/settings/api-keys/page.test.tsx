import type { PropsWithChildren } from "react";
import { render, screen } from "@testing-library/react";
import ApiKeysSettingsPage from "./page";
import { useUserStore } from "@/state/userStore";
import {
  useCreateApiKey,
  useDeleteApiKey,
  useGetApiKeys,
} from "@/hooks/endpoints/useApiKeysHook";

jest.mock("@/state/userStore");
jest.mock("@/hooks/endpoints/useApiKeysHook");

function MockWrapper({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}

jest.mock("@/components/ui/dialog", () => ({
  Dialog: MockWrapper,
  DialogContent: MockWrapper,
  DialogHeader: MockWrapper,
  DialogTitle: MockWrapper,
  DialogDescription: MockWrapper,
  DialogFooter: MockWrapper,
}));

jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: MockWrapper,
  AlertDialogContent: MockWrapper,
  AlertDialogHeader: MockWrapper,
  AlertDialogTitle: MockWrapper,
  AlertDialogDescription: MockWrapper,
  AlertDialogFooter: MockWrapper,
  AlertDialogCancel: MockWrapper,
  AlertDialogAction: MockWrapper,
}));

jest.mock("@/components/ui/select", () => ({
  Select: MockWrapper,
  SelectTrigger: MockWrapper,
  SelectValue: MockWrapper,
  SelectContent: MockWrapper,
  SelectItem: MockWrapper,
}));

describe("API Keys Settings Page", () => {
  const mockedUseUserStore = useUserStore as jest.MockedFunction<
    typeof useUserStore
  >;
  const mockedUseGetApiKeys = useGetApiKeys as jest.MockedFunction<
    typeof useGetApiKeys
  >;
  const mockedUseCreateApiKey = useCreateApiKey as jest.MockedFunction<
    typeof useCreateApiKey
  >;
  const mockedUseDeleteApiKey = useDeleteApiKey as jest.MockedFunction<
    typeof useDeleteApiKey
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseUserStore.mockReturnValue({
      userData: { view_mode: "LIVE" },
    });
    mockedUseGetApiKeys.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
    mockedUseCreateApiKey.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });
    mockedUseDeleteApiKey.mockReturnValue({
      mutateAsync: jest.fn(),
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
      refetch: jest.fn(),
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
      refetch: jest.fn(),
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
      refetch: jest.fn(),
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
