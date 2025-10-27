// lib/api/admin/response.js

// Стандартизированный формат ответа
export class ApiResponse {
  constructor(success, data, error = null, meta = {}) {
    this.success = success
    this.data = data
    this.error = error
    this.meta = meta
    this.timestamp = new Date().toISOString()
  }

  static success(data, meta = {}) {
    return new ApiResponse(true, data, null, meta)
  }

  static error(error, meta = {}) {
    return new ApiResponse(false, null, error, meta)
  }

  static fromHttpResponse(response, meta = {}) {
    if (response.success) {
      return ApiResponse.success(response.data, { ...meta, ...response.meta })
    } else {
      return ApiResponse.error(response.error, { ...meta, ...response.meta })
    }
  }
}

// Обработчик ошибок
export class ApiError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', details = null) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.details = details
    this.timestamp = new Date().toISOString()
  }

  static fromHttpError(error) {
    if (error.response) {
      // Сервер ответил с ошибкой
      return new ApiError(
        error.response.data?.message || 'Server error',
        error.response.data?.code || 'SERVER_ERROR',
        error.response.data
      )
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      return new ApiError('Network error', 'NETWORK_ERROR')
    } else {
      // Что-то пошло не так при настройке запроса
      return new ApiError(error.message, 'REQUEST_ERROR')
    }
  }
}

// Валидация ответов
export const validateResponse = (response, schema) => {
  if (!response.success) {
    throw new ApiError(response.error, 'VALIDATION_ERROR')
  }

  if (schema && !schema.isValidSync(response.data)) {
    throw new ApiError('Invalid response format', 'VALIDATION_ERROR')
  }

  return response
}

// Утилиты для пагинации
export const paginationUtils = {
  normalizePagination(response, defaultLimit = 10) {
    return {
      data: response.data || [],
      pagination: {
        page: response.meta?.page || 1,
        limit: response.meta?.limit || defaultLimit,
        total: response.meta?.total || 0,
        pages: response.meta?.pages || 1,
      }
    }
  },

  calculateSkip(page, limit) {
    return (page - 1) * limit
  },

  calculatePages(total, limit) {
    return Math.ceil(total / limit)
  }
}

export default {
  ApiResponse,
  ApiError,
  validateResponse,
  paginationUtils
}