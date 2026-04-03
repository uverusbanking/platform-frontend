import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  removeLocalStorageItem,
  setEncryptedLocalStorage,
  getDecryptedLocalStorage,
} from "@/lib/storage";
import { broadcastLogoutEvent } from "@/lib/authSync";
import { logoutSession } from "@/lib/axios";
import { queryClient } from "@/lib/queryClient";
import { IUser, UserStatus } from "@/types/user.types";
import { Gender } from "@/types/enums";
import { ROLES } from "@/auth/roles";
import { PERMISSIONS } from "@/auth/permissions";

const defaultUserData: IUser = {
  id: "",
  platform_id: "",
  organisation_id: "",
  email: "",
  phone_number: "",
  role: ROLES.PLATFORM_ADMIN,
  permissions: [PERMISSIONS.FREEZE_CUSTOMER],
  status: UserStatus.ACTIVE,
  gender: Gender.MALE,
  first_name: "",
  last_name: "",
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
    id: "",
    platform_id: "",
    organisation_name: "",
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

const clearPersistedAuthState = () => {
  removeLocalStorageItem("user");
  removeLocalStorageItem("access_token");
  removeLocalStorageItem("session_id");
  removeLocalStorageItem("REACT_QUERY_OFFLINE_CACHE");
  queryClient.clear();
};

const emptySessionState = {
  userData: defaultUserData,
  isLoggedIn: false,
  accessToken: "",
  sessionId: "",
  tempLoginData: null,
};

type _typeInterface_ = {
  accessToken: string;
  sessionId: string;
  tempLoginData: {
    email: string;
    encrypted_password: string;
    type: string;
  } | null;
  userData: IUser;
  isLoggedIn: boolean;
  _loginUser: (user: IUser, accessToken: string, sessionId: string) => void;
  _autoLogin: (user: IUser) => void;
  _clearUserSession: () => void;
  _clearUserSessionLocally: () => void;
  _logOutUser: () => void;
  _setTempLoginData: (
    data: { email: string; encrypted_password: string; type: string } | null,
  ) => void;
  _handleRestoreUser: () => void;
  // _handleRefresh: (user?: IUser, token?: string) => void;
  _updateUser: (user: IUser) => void;
  // updatePlayerAsync: () => Promise<void>;
};

export const useUserStore = create<_typeInterface_>()(
  devtools(
    (set) => ({
      accessToken: "",
      sessionId: "",
      tempLoginData: null,
      userData: defaultUserData,
      isLoggedIn: false,
      _loginUser: (user, token, sessionId) => {
        setEncryptedLocalStorage("user", user);
        localStorage.setItem("session_id", sessionId);

        set({
          userData: user,
          accessToken: token,
          sessionId,
          isLoggedIn: true,
        });
      },
      _autoLogin: (user) => {
        setEncryptedLocalStorage("user", user);

        set({ userData: user, isLoggedIn: true });
      },
      _clearUserSession: () => {
        broadcastLogoutEvent();
        clearPersistedAuthState();
        set({ ...emptySessionState });
      },
      _clearUserSessionLocally: () => {
        clearPersistedAuthState();
        set({ ...emptySessionState });
      },
      _updateUser: (user) => {
        set((state) => {
          const newUserData = { ...state.userData, ...user };
          setEncryptedLocalStorage("user", newUserData);

          return {
            userData: newUserData,
          };
        });
      },
      _logOutUser: () => {
        broadcastLogoutEvent();
        logoutSession().catch((err) =>
          console.error("Logout API failed:", err),
        );
        clearPersistedAuthState();
        set({ ...emptySessionState });
      },
      _setTempLoginData: (data) => {
        set({ tempLoginData: data });
      },
      _handleRestoreUser: () => {
        const user = getDecryptedLocalStorage("user");
        const sessionId = localStorage.getItem("session_id");

        set((state) => {
          return {
            userData: user || state.userData,
            sessionId: sessionId || state.sessionId,
          };
        });
      },
    }),
    { name: "UserStore" },
  ),
);
