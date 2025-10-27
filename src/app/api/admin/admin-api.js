// lib/api/admin/admin-api.js
class AdminApiClient {
  constructor() {
    this.baseURL = '/api/admin'
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // GET запросы
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return this.request(url)
  }

  // POST запросы
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // PUT запросы
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // PATCH запросы
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // DELETE запросы
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }

  // Получение списка с пагинацией и фильтрацией
  async getList(endpoint, { page = 1, limit = 10, filters = {}, sort = {} } = {}) {
    const params = {
      page,
      limit,
      ...filters,
      sortBy: sort.field,
      sortOrder: sort.order,
    }
    return this.get(endpoint, params)
  }

  // Получение по ID
  async getById(endpoint, id) {
    return this.get(`${endpoint}/${id}`)
  }

  // Создание
  async create(endpoint, data) {
    return this.post(endpoint, data)
  }

  // Обновление
  async update(endpoint, id, data) {
    return this.put(`${endpoint}/${id}`, data)
  }

  // Частичное обновление
  async patchUpdate(endpoint, id, data) {
    return this.patch(`${endpoint}/${id}`, data)
  }

  // Удаление
  async deleteById(endpoint, id) {
    return this.delete(`${endpoint}/${id}`)
  }

  // Пакетные операции
  async bulkUpdate(endpoint, ids, data) {
    return this.post(`${endpoint}/bulk-update`, { ids, data })
  }

  async bulkDelete(endpoint, ids) {
    return this.post(`${endpoint}/bulk-delete`, { ids })
  }

  // Экспорт данных
  async exportData(endpoint, format = 'csv', filters = {}) {
    return this.get(`${endpoint}/export`, { format, ...filters })
  }
}

// Создаем singleton instance
export const adminApi = new AdminApiClient()