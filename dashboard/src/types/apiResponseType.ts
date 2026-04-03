export interface IPagination {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface IMeta {
  pagination?: IPagination;
}

export enum ResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
  PENDING = "pending",
}

export interface IApiResponse<T> {
  status: ResponseStatus | string;
  message?: string;
  data: T;
  errors?: unknown[];
  meta?: IMeta;
}

export type TError = IApiResponse<null>;
