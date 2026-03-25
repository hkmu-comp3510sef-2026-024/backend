export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
  errorCode?: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<PaginatedData<T>> {}

export function success<T>(data?: T, message = 'Success'): ApiResponse<T> {
  return {
    code: 200,
    message,
    data,
  };
}

export function created<T>(data?: T, message = 'Created'): ApiResponse<T> {
  return {
    code: 201,
    message,
    data,
  };
}

export function noContent(message = 'No content'): ApiResponse {
  return {
    code: 204,
    message,
  };
}

export function paginated<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
  message = 'Success',
): PaginatedResponse<T> {
  return {
    code: 200,
    message,
    data: {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export function error(code: number, message: string, errorCode?: string): ApiResponse {
  const response: ApiResponse = {
    code,
    message,
  };
  if (errorCode) {
    response.errorCode = errorCode;
  }
  return response;
}
