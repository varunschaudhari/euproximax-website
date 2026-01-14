/**
 * API Client Utilities
 * Public API client for website (no authentication required)
 */

const getRuntimeApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const runtimeBase = window.__APP_CONFIG__?.VITE_API_BASE_URL
    if (runtimeBase) return runtimeBase
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
}

export const getApiBaseUrl = () => getRuntimeApiBaseUrl()
export const getApiHost = () => getRuntimeApiBaseUrl().replace(/\/api\/v1$/, '')

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
  const url = `${getApiBaseUrl()}${endpoint}`

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

    // Read response as text first to handle both JSON and non-JSON responses
    const text = await response.text()
    let data: any

    // Try to parse as JSON
    try {
      data = text ? JSON.parse(text) : {}
    } catch (parseError) {
      // If parsing fails, it's not valid JSON
      throw {
        success: false,
        message: text || 'Invalid response format from server',
        status: response.status,
      } as ApiError
    }

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
        message: 'Network error. Please check your connection and try again.',
        status: 0,
      } as ApiError
    }

    // Handle other fetch errors
    if (error instanceof Error) {
      // Check for common error messages
      if (error.message.includes('load failed') || 
          error.message.includes('load error') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError')) {
        const isFormDataRequest = isFormData || options.body instanceof FormData
        throw {
          success: false,
          message: isFormDataRequest 
            ? 'File upload failed. Please check your connection and try again. If the file is large, it may take longer to upload.'
            : 'Network error. Please check your connection and try again.',
          status: 0,
        } as ApiError
      }
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
