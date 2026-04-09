import { act, renderHook, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { resolveUserPermissions } from "@/auth/resolveUserPermissions";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import { apiErrorResponse, refreshSession } from "@/lib/axios";
import { getDecryptedLocalStorage } from "@/lib/storage";
import { useUserStore } from "@/state/userStore";

vi.mock("@/lib/axios", () => ({
  apiErrorResponse: vi.fn(),
  refreshSession: vi.fn(),
}));

vi.mock("@/lib/storage", () => ({
  getDecryptedLocalStorage: vi.fn(),
}));

vi.mock("@/auth/resolveUserPermissions", () => ({
  resolveUserPermissions: vi.fn(),
}));

vi.mock("@/state/userStore", () => ({
  useUserStore: vi.fn(),
}));

describe("useCheckAuth", () => {
  const storeState = {
    _loginUser: vi.fn(),
    _clearUserSession: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    (useUserStore as Mock).mockImplementation(
      (selector: (state: typeof storeState) => unknown) => selector(storeState),
    );
  });

  it("re-authenticates with the refresh cookie and restores the session id fallback", async () => {
    const storedUser = {
      id: "stored-user",
      role: "PLATFORM_ADMIN",
      permissions: ["customers.read"],
    };
    const refreshedUser = {
      id: "fresh-user",
      role: "PLATFORM_ADMIN",
      permissions: [],
    };
    const resolvedUser = {
      ...refreshedUser,
      permissions: ["customers.read"],
    };

    localStorage.setItem("session_id", "persisted-session");

    (getDecryptedLocalStorage as Mock).mockImplementation((key: string) => {
      if (key === "user") return storedUser;
      return null;
    });

    (resolveUserPermissions as Mock).mockReturnValue(resolvedUser);
    (refreshSession as Mock).mockResolvedValue({
      data: {
        user: refreshedUser,
        access_token: "fresh-access-token",
      },
    });

    const { result } = renderHook(() => useCheckAuth());

    let didRefresh = false;
    await act(async () => {
      didRefresh = await result.current.reAuthUser();
    });

    expect(didRefresh).toBe(true);
    expect(resolveUserPermissions).toHaveBeenCalledWith(
      refreshedUser,
      storedUser,
    );
    expect(storeState._loginUser).toHaveBeenCalledWith(
      resolvedUser,
      "fresh-access-token",
      "persisted-session",
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it("clears persisted auth state when refresh fails for an existing session", async () => {
    const refreshError = new Error("refresh failed");

    localStorage.setItem("session_id", "persisted-session");

    (getDecryptedLocalStorage as Mock).mockImplementation((key: string) => {
      if (key === "user") return { id: "stored-user" };
      return null;
    });

    (refreshSession as Mock).mockRejectedValue(refreshError);

    const { result } = renderHook(() => useCheckAuth());

    let didRefresh = true;
    await act(async () => {
      didRefresh = await result.current.reAuthUser();
    });

    expect(didRefresh).toBe(false);
    expect(apiErrorResponse).toHaveBeenCalledWith(
      refreshError,
      "Oooops, something went wrong",
    );
    expect(storeState._clearUserSession).toHaveBeenCalledTimes(1);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it("does not clear auth state when refresh fails without any persisted session", async () => {
    (getDecryptedLocalStorage as Mock).mockReturnValue(null);
    (refreshSession as Mock).mockRejectedValue(new Error("offline"));

    const { result } = renderHook(() => useCheckAuth());

    let didRefresh = true;
    await act(async () => {
      didRefresh = await result.current.reAuthUser();
    });

    expect(didRefresh).toBe(false);
    expect(apiErrorResponse).not.toHaveBeenCalled();
    expect(storeState._clearUserSession).not.toHaveBeenCalled();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});
