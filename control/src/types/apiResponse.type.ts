export interface TError {
  response: TErrorResponse;
  message?: string;
}
export interface TErrorResponse {
  success: boolean;
  error: string;
  data: {
    message?: string;
  };
  errors?: unknown[];
}

export enum ResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
  PENDING = "pending",
}

export interface IPaginationMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface IApiResponse<T> {
  status: ResponseStatus;
  data: T;
  message: string;
  error?: unknown;
  errors?: unknown[];
  meta?: {
    pagination: IPaginationMeta;
  };
}
