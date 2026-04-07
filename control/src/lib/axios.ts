import axios, { InternalAxiosRequestConfig } from "axios";
import { resolveUserPermissions } from "@/auth/resolveUserPermissions";
import { getDecryptedLocalStorage } from "@/lib/storage";
import { useUserStore } from "@/state/userStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";
const API_BASE_URL = `${API_URL}/api/${API_VERSION}`;

type RequestConfigWithRetry = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const baseClientConfig = {
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const apiClient = axios.create(baseClientConfig);
const sessionClient = axios.create(baseClientConfig);

const AUTH_BYPASS_PATHS = [
  "/platform/auth/login",
  "/platform/auth/verify-code",
  "/platform/auth/refresh-token",
  "/platform/auth/logout",
  "/platform/auth/public-key",
  "/platform/auth/forgot-password",
  "/platform/auth/verify-forgot-otp",
  "/platform/auth/reset-password",
  "/platform/auth/resend-forgot-otp",
];

const isAuthBypassPath = (url?: string) =>
  AUTH_BYPASS_PATHS.some((path) => url?.includes(path));

const isRefreshableRequest = (request?: RequestConfigWithRetry) => {
  if (!request || request._retry || isAuthBypassPath(request.url)) {
    return false;
  }

  return Boolean(request.headers?.Authorization);
};

const getSessionPayload = () => {
  const sessionId =
    (typeof window !== "undefined"
      ? localStorage.getItem("session_id")
      : null) ||
    useUserStore.getState().sessionId ||
    "";

  return { session_id: sessionId };
};

export const refreshSession = async () => {
  const response = await sessionClient.post(
    "/platform/auth/refresh-token",
    getSessionPayload(),
  );
  return response.data;
};

export const logoutSession = async () => {
  const response = await sessionClient.post(
    "/platform/auth/logout",
    getSessionPayload(),
  );
  return response.data;
};

type RefreshSessionResponse = Awaited<ReturnType<typeof refreshSession>>;

let refreshSessionPromise: Promise<RefreshSessionResponse> | null = null;

const syncRefreshedSession = (refreshResponse: RefreshSessionResponse) => {
  if (!refreshResponse.status) {
    return refreshResponse;
  }

  const { sessionId, _loginUser } = useUserStore.getState();
  const currentSessionId = localStorage.getItem("session_id");
  const storedUser = getDecryptedLocalStorage("user");
  const userWithPermissions = resolveUserPermissions(
    refreshResponse.data.user,
    storedUser,
  );
  const accessToken = refreshResponse.data.access_token;
  const nextSessionId =
    refreshResponse.data.session_id || currentSessionId || sessionId || "";

  _loginUser(userWithPermissions, accessToken, nextSessionId);

  return refreshResponse;
};

const getRefreshSessionPromise = async () => {
  if (!refreshSessionPromise) {
    refreshSessionPromise = refreshSession()
      .then(syncRefreshedSession)
      .catch((refreshError) => {
        console.error("Token refresh failed, clearing session...");
        useUserStore.getState()._clearUserSession();
        throw refreshError;
      })
      .finally(() => {
        refreshSessionPromise = null;
      });
  }

  return refreshSessionPromise;
};

// Request interceptor to attach token before every request
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useUserStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RequestConfigWithRetry | undefined;
    const status = error.response?.status;

    if (
      (status === 401 || status === 419) &&
      originalRequest &&
      isRefreshableRequest(originalRequest)
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await getRefreshSessionPromise();

        if (refreshResponse.status) {
          const accessToken = refreshResponse.data.access_token;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

export function apiErrorResponse(
  error: unknown,
  defaultErrorMsg = "Something went wrong",
) {
  const errorObj = error as Record<string, unknown> & {
    response?: { data?: Record<string, unknown> };
  };
  const err: Record<string, unknown> = errorObj?.response?.data ?? errorObj;
  console.log(err);
  const errorField = err?.error as Record<string, unknown> | string | undefined;
  const message =
    (typeof errorField === "object" && errorField !== null
      ? (errorField as Record<string, unknown>).message
      : undefined) ??
    err?.message ??
    defaultErrorMsg;

  let msg = "";
  if (typeof message === "string") {
    msg = message;
  } else if (Array.isArray(message)) {
    if (typeof err.error === "string") {
      msg = err.error;
    } else {
      msg = message[0];
    }
  } else {
    msg = String(message);
  }

  return {
    error: msg,
    errorMsgs: Array.isArray(message) ? message : undefined,
  };
}
