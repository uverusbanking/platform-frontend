type InterceptorHandler<T = unknown> = {
  onFulfilled: (value: T) => unknown;
  onRejected?: (error: unknown) => unknown;
};

type MockAxiosInstance = jest.Mock & {
  interceptors: {
    request: { use: jest.Mock };
    response: { use: jest.Mock };
  };
  post: jest.Mock;
  __requestHandlers: InterceptorHandler[];
  __responseHandlers: InterceptorHandler[];
};

const mockAxiosCreate = jest.fn();
const mockResolveUserPermissions = jest.fn();
const mockGetDecryptedLocalStorage = jest.fn();
const mockUseUserStore = jest.fn();

(mockUseUserStore as jest.Mock & { getState: jest.Mock }).getState = jest.fn();

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: (...args: unknown[]) => mockAxiosCreate(...args),
  },
}));

jest.mock("@/auth/resolveUserPermissions", () => ({
  resolveUserPermissions: (...args: unknown[]) =>
    mockResolveUserPermissions(...args),
}));

jest.mock("@/lib/storage", () => ({
  getDecryptedLocalStorage: (...args: unknown[]) =>
    mockGetDecryptedLocalStorage(...args),
}));

jest.mock("@/state/userStore", () => ({
  useUserStore: mockUseUserStore,
}));

const createAxiosInstance = (): MockAxiosInstance => {
  const requestHandlers: InterceptorHandler[] = [];
  const responseHandlers: InterceptorHandler[] = [];
  const instance = jest.fn() as MockAxiosInstance;

  instance.interceptors = {
    request: {
      use: jest.fn((onFulfilled, onRejected) => {
        requestHandlers.push({ onFulfilled, onRejected });
        return requestHandlers.length - 1;
      }),
    },
    response: {
      use: jest.fn((onFulfilled, onRejected) => {
        responseHandlers.push({ onFulfilled, onRejected });
        return responseHandlers.length - 1;
      }),
    },
  };
  instance.post = jest.fn();
  instance.__requestHandlers = requestHandlers;
  instance.__responseHandlers = responseHandlers;

  return instance;
};

describe("apiClient auth flow", () => {
  let apiClient: MockAxiosInstance;
  let sessionClient: MockAxiosInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let storeState: {
    accessToken: string;
    sessionId: string;
    _loginUser: jest.Mock;
    _clearUserSession: jest.Mock;
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    localStorage.clear();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
    process.env.NEXT_PUBLIC_API_VERSION = "v1";

    apiClient = createAxiosInstance();
    sessionClient = createAxiosInstance();

    mockAxiosCreate
      .mockReset()
      .mockReturnValueOnce(apiClient)
      .mockReturnValueOnce(sessionClient);

    storeState = {
      accessToken: "stored-access-token",
      sessionId: "store-session",
      _loginUser: jest.fn(),
      _clearUserSession: jest.fn(),
    };

    mockUseUserStore.mockImplementation(
      (selector: (state: typeof storeState) => unknown) => selector(storeState),
    );
    (
      mockUseUserStore as jest.Mock & { getState: jest.Mock }
    ).getState.mockImplementation(() => storeState);
    mockResolveUserPermissions.mockImplementation((user) => user);
    mockGetDecryptedLocalStorage.mockReset().mockReturnValue(null);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it("attaches the current access token to outgoing requests", async () => {
    const axiosModule = await import("@/lib/axios");
    void axiosModule;

    const requestHandler = apiClient.__requestHandlers[0]
      .onFulfilled as (value: { headers: Record<string, string> }) => {
      headers: Record<string, string>;
    };

    const config = { headers: {} };
    const result = requestHandler(config);

    expect(result.headers.Authorization).toBe("Bearer stored-access-token");
  });

  it("rejects request interceptor errors unchanged", async () => {
    const axiosModule = await import("@/lib/axios");
    void axiosModule;

    const requestErrorHandler = apiClient.__requestHandlers[0].onRejected as (
      error: Error,
    ) => Promise<unknown>;
    const requestError = new Error("request failed");

    await expect(requestErrorHandler(requestError)).rejects.toBe(requestError);
  });

  it("posts to the logout endpoint with the cookie-backed session client", async () => {
    const axiosModule = await import("@/lib/axios");
    sessionClient.post.mockResolvedValue({ data: { status: true } });
    localStorage.setItem("session_id", "persisted-session");

    await expect(axiosModule.logoutSession()).resolves.toEqual({
      status: true,
    });

    expect(sessionClient.post).toHaveBeenCalledWith("/platform/auth/logout", {
      session_id: "persisted-session",
    });
  });

  it("refreshes the session and retries the original request on 401", async () => {
    const storedUser = {
      id: "stored-user",
      role: "PLATFORM_ADMIN",
      permissions: ["customers.read"],
    };
    const refreshedUser = {
      id: "fresh-user",
      role: "PLATFORM_ADMIN",
    };
    const resolvedUser = {
      ...refreshedUser,
      permissions: ["customers.read"],
    };

    localStorage.setItem("session_id", "persisted-session");

    mockGetDecryptedLocalStorage.mockImplementation((key: string) => {
      if (key === "user") return storedUser;
      return null;
    });
    mockResolveUserPermissions.mockReturnValue(resolvedUser);
    sessionClient.post.mockResolvedValue({
      data: {
        status: true,
        data: {
          user: refreshedUser,
          access_token: "fresh-access-token",
          session_id: "fresh-session",
        },
      },
    });
    apiClient.mockResolvedValue({ data: { ok: true } });

    const axiosModule = await import("@/lib/axios");
    void axiosModule;

    const responseErrorHandler = apiClient.__responseHandlers[0]
      .onRejected as (error: {
      config: {
        url: string;
        headers: Record<string, string>;
        _retry?: boolean;
      };
      response: { status: number };
    }) => Promise<unknown>;

    const originalRequest = {
      url: "/customers",
      headers: {
        Authorization: "Bearer stale-token",
      },
    };

    const result = await responseErrorHandler({
      config: originalRequest,
      response: { status: 401 },
    });

    expect(sessionClient.post).toHaveBeenCalledWith(
      "/platform/auth/refresh-token",
      {
        session_id: "persisted-session",
      },
    );
    expect(mockResolveUserPermissions).toHaveBeenCalledWith(
      refreshedUser,
      storedUser,
    );
    expect(storeState._loginUser).toHaveBeenCalledWith(
      resolvedUser,
      "fresh-access-token",
      "fresh-session",
    );
    expect(originalRequest._retry).toBe(true);
    expect(originalRequest.headers.Authorization).toBe(
      "Bearer fresh-access-token",
    );
    expect(apiClient).toHaveBeenCalledWith(originalRequest);
    expect(result).toEqual({ data: { ok: true } });
  });

  it("reuses a single refresh request for concurrent auth failures", async () => {
    const storedUser = {
      id: "stored-user",
      role: "PLATFORM_ADMIN",
      permissions: ["customers.read"],
    };
    const refreshedUser = {
      id: "fresh-user",
      role: "PLATFORM_ADMIN",
    };
    const resolvedUser = {
      ...refreshedUser,
      permissions: ["customers.read"],
    };

    let resolveRefresh:
      | ((value: {
          data: {
            status: boolean;
            data: {
              user: typeof refreshedUser;
              access_token: string;
              session_id: string;
            };
          };
        }) => void)
      | null = null;

    localStorage.setItem("session_id", "persisted-session");
    mockGetDecryptedLocalStorage.mockImplementation((key: string) => {
      if (key === "user") return storedUser;
      return null;
    });
    mockResolveUserPermissions.mockReturnValue(resolvedUser);
    sessionClient.post.mockReturnValue(
      new Promise((resolve) => {
        resolveRefresh = resolve;
      }),
    );
    apiClient
      .mockResolvedValueOnce({ data: { request: "first" } })
      .mockResolvedValueOnce({ data: { request: "second" } });

    const axiosModule = await import("@/lib/axios");
    void axiosModule;

    const responseErrorHandler = apiClient.__responseHandlers[0]
      .onRejected as (error: {
      config: {
        url: string;
        headers: Record<string, string>;
        _retry?: boolean;
      };
      response: { status: number };
    }) => Promise<unknown>;

    const firstRequest = {
      url: "/customers",
      headers: {
        Authorization: "Bearer stale-token-1",
      },
    };
    const secondRequest = {
      url: "/accounts",
      headers: {
        Authorization: "Bearer stale-token-2",
      },
    };

    const firstResponsePromise = responseErrorHandler({
      config: firstRequest,
      response: { status: 401 },
    });
    const secondResponsePromise = responseErrorHandler({
      config: secondRequest,
      response: { status: 419 },
    });

    expect(sessionClient.post).toHaveBeenCalledTimes(1);

    resolveRefresh?.({
      data: {
        status: true,
        data: {
          user: refreshedUser,
          access_token: "fresh-access-token",
          session_id: "fresh-session",
        },
      },
    });

    await expect(firstResponsePromise).resolves.toEqual({
      data: { request: "first" },
    });
    await expect(secondResponsePromise).resolves.toEqual({
      data: { request: "second" },
    });

    expect(mockResolveUserPermissions).toHaveBeenCalledTimes(1);
    expect(storeState._loginUser).toHaveBeenCalledTimes(1);
    expect(storeState._loginUser).toHaveBeenCalledWith(
      resolvedUser,
      "fresh-access-token",
      "fresh-session",
    );
    expect(firstRequest.headers.Authorization).toBe(
      "Bearer fresh-access-token",
    );
    expect(secondRequest.headers.Authorization).toBe(
      "Bearer fresh-access-token",
    );
    expect(apiClient).toHaveBeenNthCalledWith(1, firstRequest);
    expect(apiClient).toHaveBeenNthCalledWith(2, secondRequest);
  });

  it("clears the user session when refresh fails", async () => {
    const refreshError = new Error("refresh failed");

    sessionClient.post.mockRejectedValue(refreshError);

    const axiosModule = await import("@/lib/axios");
    void axiosModule;

    const responseErrorHandler = apiClient.__responseHandlers[0]
      .onRejected as (error: {
      config: {
        url: string;
        headers: Record<string, string>;
        _retry?: boolean;
      };
      response: { status: number };
    }) => Promise<unknown>;

    await expect(
      responseErrorHandler({
        config: {
          url: "/customers",
          headers: {
            Authorization: "Bearer stale-token",
          },
        },
        response: { status: 419 },
      }),
    ).rejects.toBe(refreshError);

    expect(storeState._clearUserSession).toHaveBeenCalledTimes(1);
  });

  it("does not try to refresh login requests or requests without auth", async () => {
    const axiosModule = await import("@/lib/axios");
    void axiosModule;

    const responseErrorHandler = apiClient.__responseHandlers[0]
      .onRejected as (error: {
      config: {
        url: string;
        headers?: Record<string, string>;
        _retry?: boolean;
      };
      response: { status: number };
    }) => Promise<unknown>;

    const loginError = {
      config: {
        url: "/platform/auth/login",
        headers: {
          Authorization: "Bearer ignored-token",
        },
      },
      response: { status: 401 },
    };
    const anonymousError = {
      config: {
        url: "/public-endpoint",
        headers: {},
      },
      response: { status: 401 },
    };

    await expect(responseErrorHandler(loginError)).rejects.toBe(loginError);
    await expect(responseErrorHandler(anonymousError)).rejects.toBe(
      anonymousError,
    );

    expect(sessionClient.post).not.toHaveBeenCalled();
    expect(storeState._loginUser).not.toHaveBeenCalled();
  });

  it("normalizes API error payloads into a consistent error shape", async () => {
    const { apiErrorResponse } = await import("@/lib/axios");

    expect(
      apiErrorResponse({
        response: {
          data: {
            error: {
              message: "Token expired",
            },
          },
        },
      }),
    ).toEqual({
      error: "Token expired",
      errorMsgs: undefined,
    });

    expect(
      apiErrorResponse(
        {
          response: {
            data: {
              error: "Validation failed",
              message: ["Email is required", "Password is required"],
            },
          },
        },
        "Fallback error",
      ),
    ).toEqual({
      error: "Validation failed",
      errorMsgs: ["Email is required", "Password is required"],
    });

    expect(
      apiErrorResponse({
        response: {
          data: {
            message: {
              detail: "Unknown error payload",
            },
          },
        },
      }),
    ).toEqual({
      error: "[object Object]",
      errorMsgs: undefined,
    });
  });
});
