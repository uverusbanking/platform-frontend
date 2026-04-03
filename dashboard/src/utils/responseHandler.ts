import { IApiResponse, ResponseStatus, IMeta } from "@/types/apiResponseType";

/**
 * Standardizes the success response format.
 */
export function successResponse<T>(
  data: T,
  message?: string,
  meta?: IMeta,
): IApiResponse<T> {
  return {
    status: ResponseStatus.SUCCESS,
    message,
    data,
    meta,
  };
}

/**
 * Standardizes the error response format.
 */
export function errorResponse(
  message: string,
  errors?: unknown[],
): IApiResponse<null> {
  return {
    status: ResponseStatus.ERROR,
    message,
    data: null,
    errors: errors || [message],
  };
}

/**
 * Standardizes the pending response format.
 */
export function pendingResponse<T>(data: T, message?: string): IApiResponse<T> {
  return {
    status: ResponseStatus.PENDING,
    message,
    data,
  };
}
