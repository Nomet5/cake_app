// lib/api/admin/users-api.js
import { adminApi } from './admin-api'

export class UsersApi {
  // Получение списка пользователей
  async getUsers(params = {}) {
    return adminApi.getList('/users', params)
  }

  // Получение пользователя по ID
  async getUserById(userId) {
    return adminApi.getById('/users', userId)
  }

  // Создание пользователя
  async createUser(userData) {
    return adminApi.create('/users', userData)
  }

  // Обновление пользователя
  async updateUser(userId, userData) {
    return adminApi.update('/users', userId, userData)
  }

  // Удаление пользователя
  async deleteUser(userId) {
    return adminApi.deleteById('/users', userId)
  }

  // Блокировка пользователя
  async blockUser(userId) {
    return adminApi.patch(`/users/${userId}/block`)
  }

  // Разблокировка пользователя
  async unblockUser(userId) {
    return adminApi.patch(`/users/${userId}/unblock`)
  }

  // Смена роли пользователя
  async changeUserRole(userId, role) {
    return adminApi.patch(`/users/${userId}/role`, { role })
  }

  // Получение заказов пользователя
  async getUserOrders(userId, params = {}) {
    return adminApi.get(`/users/${userId}/orders`, params)
  }

  // Получение отзывов пользователя
  async getUserReviews(userId, params = {}) {
    return adminApi.get(`/users/${userId}/reviews`, params)
  }

  // Поиск пользователей
  async searchUsers(query, params = {}) {
    return adminApi.get('/users/search', { query, ...params })
  }

  // Экспорт пользователей
  async exportUsers(format = 'csv', filters = {}) {
    return adminApi.exportData('/users', format, filters)
  }

  // Получение имени пользователя (для хлебных крошек)
  async getUserName(userId) {
    const user = await this.getUserById(userId)
    return user.name || user.email
  }
}

export const usersApi = new UsersApi()