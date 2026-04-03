import axios, { InternalAxiosRequestConfig } from "axios";
import { resolveUserPermissions } from "@/auth/resolveUserPermissions";
import { getDecryptedLocalStorage } from "@/utils/storage";
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
  "/auth/login",
  "/auth/verify-code",
  "/auth/refresh-token",
  "/auth/logout",
  "/auth/public-key",
  "/auth/forgot-password",
  "/auth/verify-forgot-otp",
  "/auth/reset-password",
  "/auth/resend-forgot-otp",
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

  return { sessionId };
};

export const refreshSession = async () => {
  const response = await sessionClient.post(
    "/auth/refresh-token",
    getSessionPayload(),
  );
  return response.data;
};

export const logoutSession = async () => {
  const response = await sessionClient.post(
    "/auth/logout",
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiErrorResponse(
  error: any,
  defaultErrorMsg = "Something went wrong",
) {
  const err =
    error.response && error.response.data ? error.response.data : error;
  console.error(err);
  const message = err?.error?.message || err?.message || defaultErrorMsg;

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

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  const err = apiErrorResponse(error, fallback);
  return err.error || fallback;
}
