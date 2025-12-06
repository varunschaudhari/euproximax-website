/**
 * API Client Utilities
 * Public API client for website (no authentication required)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

export interface ApiError {
  success: false
  message: string
  errors?: Array<{ field: string; message: string }>
  status?: number
}

export interface ApiResponse<T> {
  success: true
  message: string
  data: T
}

/**
 * Get default headers for API requests
 */
const getHeaders = (isFormData: boolean = false): HeadersInit => {
  const headers: HeadersInit = {}

  // Don't set Content-Type for FormData - browser will set it with boundary
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}

/**
 * Extended RequestInit
 */
export interface ApiRequestInit extends RequestInit {
  isFormData?: boolean
  skipAuth?: boolean
}

/**
 * Generic fetch wrapper with error handling
 */
export const apiClient = async <T>(
  endpoint: string,
  options: ApiRequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`

  const { isFormData, ...requestOptions } = options

  const config: RequestInit = {
    ...requestOptions,
    headers: {
      ...getHeaders(isFormData || false),
      ...requestOptions.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      throw new Error('Invalid response format')
    }

    const data = await response.json()

    // Handle error responses
    if (!response.ok || !data.success) {
      const error: ApiError = {
        success: false,
        message: data.message || 'An error occurred',
        errors: data.errors,
        status: response.status,
      }
      throw error
    }

    return data as ApiResponse<T>
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw {
        success: false,
        message: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError
    }

    // Re-throw API errors
    throw error
  }
}

/**
 * GET request
 */
export const get = <T>(endpoint: string, options?: ApiRequestInit): Promise<ApiResponse<T>> => {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'GET',
  })
}

/**
 * POST request
 */
export const post = <T>(
  endpoint: string,
  body?: any,
  options?: ApiRequestInit
): Promise<ApiResponse<T>> => {
  const isFormData = body instanceof FormData || options?.isFormData
  return apiClient<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    isFormData,
  })
}

/**
 * PUT request
 */
export const put = <T>(
  endpoint: string,
  body?: any,
  options?: ApiRequestInit
): Promise<ApiResponse<T>> => {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * DELETE request
 */
export const del = <T>(endpoint: string, options?: ApiRequestInit): Promise<ApiResponse<T>> => {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'DELETE',
  })
}

/**
 * PATCH request
 */
export const patch = <T>(
  endpoint: string,
  body?: any,
  options?: ApiRequestInit
): Promise<ApiResponse<T>> => {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  })
}
