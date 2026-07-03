export class AppError extends Error {
  public details?: unknown;

  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.details = details;
  }
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function success<T>(data: T): ApiSuccess<T> {
  return { success: true, data };
}

export function fail(message: string, code?: string, details?: unknown): ApiError {
  return { success: false, error: { message, code, details } };
}
