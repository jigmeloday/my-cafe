// src/services/baseAPI.ts

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export async function baseAPI<T = unknown>(
  url: string,
  method: HTTPMethod,
  body?: unknown
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`http://localhost:3000/api${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
    });

    // Use unknown and validate parsing safely
    const text = await res.text();
    let data: unknown;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new Error('Invalid JSON response from server');
    }

    // Narrow data type
    const responseData = data as Partial<ApiResponse<T>> | null;

    if (!res.ok) {
      throw new Error(responseData?.message || `Request failed with status ${res.status}`);
    }

    return {
      success: true,
      message: responseData?.message ?? 'Request successful',
      data: (responseData?.data ?? responseData) as T,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Something went wrong';

    return {
      success: false,
      message,
    };
  }
}
