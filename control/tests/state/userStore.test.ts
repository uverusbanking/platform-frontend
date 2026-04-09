import { Mock, vi } from "vitest";
import { broadcastLogoutEvent } from "@/lib/authSync";
import { logoutSession } from "@/lib/axios";
import { queryClient } from "@/lib/queryClient";
import {
  getDecryptedLocalStorage,
  setEncryptedLocalStorage,
} from "@/lib/storage";
import { useUserStore } from "@/state/userStore";

vi.mock("@/lib/authSync", () => ({
  broadcastLogoutEvent: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({
  logoutSession: vi.fn(() => Promise.resolve({ status: true })),
}));

vi.mock("@/lib/queryClient", () => ({
  queryClient: {
    clear: vi.fn(),
  },
}));

describe("useUserStore", () => {
  const initialState = useUserStore.getState();
  const mockUser = {
    id: "user-1",
    platform_id: "platform-1",
    organisation_id: "org-1",
    email: "admin@platform.tech",
    phone_number: "+2348000000000",
    role: "PLATFORM_ADMIN",
    permissions: ["customers.read"],
    status: "ACTIVE",
    gender: "MALE",
    first_name: "Ada",
    last_name: "Lovelace",
    middle_name: "",
    email_verified_at: null,
    phone_verified_at: null,
    kyc_verified: false,
    kyc_level: 0,
    kyc_id: null,
    view_mode: "LIVE",
    created_at: "",
    updated_at: "",
    organisation: {
      id: "org-1",
      platform_id: "platform-1",
      organisation_name: "Platform",
      cac_registration_number: "",
      tin: "",
      business_email: "",
      business_phone: "",
      registered_address_street: "",
      registered_address_city: "",
      registered_address_state: "",
      registered_address_postal_code: "",
      registered_address_country: "",
      document_cac_certificate: "",
      document_memorandum: "",
      document_board_resolution: "",
      document_proof_of_address: "",
      document_ubo_declaration: "",
      status: "",
      created_at: "",
      updated_at: "",
      created_by: "",
      metadata: undefined,
      kYCId: "",
    },
    kyc: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useUserStore.setState(initialState, true);
  });

  it("stores user in persistence while keeping the access token in memory only", () => {
    useUserStore.getState()._loginUser(mockUser, "access-token", "session-123");

    expect(useUserStore.getState().userData).toEqual(mockUser);
    expect(useUserStore.getState().accessToken).toBe("access-token");
    expect(useUserStore.getState().sessionId).toBe("session-123");
    expect(useUserStore.getState().isLoggedIn).toBe(true);
    expect(getDecryptedLocalStorage("user")).toEqual(mockUser);
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("session_id")).toBe("session-123");
    expect(localStorage.getItem("refresh_token")).toBeNull();
  });

  it("restores persisted user/session metadata without logging the user in", () => {
    setEncryptedLocalStorage("user", mockUser);
    localStorage.setItem("session_id", "restored-session");

    useUserStore.getState()._handleRestoreUser();

    expect(useUserStore.getState().userData).toEqual(mockUser);
    expect(useUserStore.getState().accessToken).toBe("");
    expect(useUserStore.getState().sessionId).toBe("restored-session");
    expect(useUserStore.getState().isLoggedIn).toBe(false);
  });

  it("restores persisted user/session metadata without overriding auth status", () => {
    useUserStore.getState()._loginUser(mockUser, "access-token", "session-123");

    setEncryptedLocalStorage("user", {
      ...mockUser,
      first_name: "Grace",
    });
    localStorage.setItem("session_id", "restored-session");

    useUserStore.getState()._handleRestoreUser();

    expect(useUserStore.getState().userData.first_name).toBe("Grace");
    expect(useUserStore.getState().sessionId).toBe("restored-session");
    expect(useUserStore.getState().accessToken).toBe("access-token");
    expect(useUserStore.getState().isLoggedIn).toBe(true);
  });

  it("supports auto-login, user updates, and temporary login data", () => {
    useUserStore.getState()._autoLogin(mockUser);
    useUserStore.getState()._setTempLoginData({
      email: mockUser.email,
      encrypted_password: "encrypted-password",
      type: "PLATFORM",
    });
    useUserStore.getState()._updateUser({
      ...mockUser,
      first_name: "Grace",
    });

    expect(useUserStore.getState().isLoggedIn).toBe(true);
    expect(useUserStore.getState().tempLoginData).toEqual({
      email: mockUser.email,
      encrypted_password: "encrypted-password",
      type: "PLATFORM",
    });
    expect(useUserStore.getState().userData.first_name).toBe("Grace");
    expect(getDecryptedLocalStorage("user")).toMatchObject({
      first_name: "Grace",
    });
  });

  it("clears persisted auth state and query cache", () => {
    setEncryptedLocalStorage("user", mockUser);
    localStorage.setItem("access_token", "legacy-token");
    localStorage.setItem("session_id", "session-123");
    localStorage.setItem("REACT_QUERY_OFFLINE_CACHE", "cached");

    useUserStore.getState()._clearUserSession();

    expect(useUserStore.getState().isLoggedIn).toBe(false);
    expect(useUserStore.getState().accessToken).toBe("");
    expect(useUserStore.getState().sessionId).toBe("");
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("session_id")).toBeNull();
    expect(localStorage.getItem("REACT_QUERY_OFFLINE_CACHE")).toBeNull();
    expect(queryClient.clear).toHaveBeenCalledTimes(1);
    expect(broadcastLogoutEvent).toHaveBeenCalledTimes(1);
  });

  it("clears the local tab only without broadcasting when receiving a remote logout", () => {
    setEncryptedLocalStorage("user", mockUser);
    localStorage.setItem("access_token", "legacy-token");
    localStorage.setItem("session_id", "session-123");

    useUserStore.getState()._clearUserSessionLocally();

    expect(useUserStore.getState().isLoggedIn).toBe(false);
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("session_id")).toBeNull();
    expect(broadcastLogoutEvent).not.toHaveBeenCalled();
  });

  it("logs out through the cookie-backed endpoint and clears local auth state", () => {
    useUserStore.getState()._loginUser(mockUser, "access-token", "session-123");

    useUserStore.getState()._logOutUser();

    expect(logoutSession).toHaveBeenCalledTimes(1);
    expect(useUserStore.getState().isLoggedIn).toBe(false);
    expect(useUserStore.getState().accessToken).toBe("");
    expect(useUserStore.getState().sessionId).toBe("");
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("session_id")).toBeNull();
    expect(queryClient.clear).toHaveBeenCalledTimes(1);
    expect(broadcastLogoutEvent).toHaveBeenCalledTimes(1);
  });
});
