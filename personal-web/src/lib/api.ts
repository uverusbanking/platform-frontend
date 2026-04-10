const API_URL = import.meta.env.VITE_API_URL || "";
const API_VERSION = import.meta.env.VITE_API_VERSION || "v1";
const API_BASE_URL = API_URL
  ? `${API_URL}/api/${API_VERSION}`
  : `http://localhost:4110/api/${API_VERSION}`;

interface ApiOptions {
  query?: Record<string, any>;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & ApiOptions = {},
  ): Promise<T> {
    const { query, headers: customHeaders, ...fetchOptions } = options;

    let url = `${this.baseURL}${endpoint}`;

    if (query) {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }

    const token = localStorage.getItem("sb-access-token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: ApiOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: ApiOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async uploadFile<T>(
    endpoint: string,
    file: File,
    options?: ApiOptions,
  ): Promise<T> {
    const { query, headers: customHeaders, ...fetchOptions } = options || {};

    let url = `${this.baseURL}${endpoint}`;

    if (query) {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const formData = new FormData();
    formData.append("file", file);

    const headers: Record<string, string> = {
      ...customHeaders,
    };

    const token = localStorage.getItem("sb-access-token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  }
}

export const api = new ApiClient(API_BASE_URL);
