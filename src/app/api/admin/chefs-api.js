    // lib/api/admin/chefs-api.js
import { adminApi } from './admin-api'

export class ChefsApi {
  // Получение списка поваров
  async getChefs(params = {}) {
    return adminApi.getList('/chefs', params)
  }

  // Получение повара по ID
  async getChefById(chefId) {
    return adminApi.getById('/chefs', chefId)
  }

  // Создание повара
  async createChef(chefData) {
    return adminApi.create('/chefs', chefData)
  }

  // Обновление повара
  async updateChef(chefId, chefData) {
    return adminApi.update('/chefs', chefId, chefData)
  }

  // Удаление повара
  async deleteChef(chefId) {
    return adminApi.deleteById('/chefs', chefId)
  }

  // Изменение статуса повара
  async changeChefStatus(chefId, status) {
    return adminApi.patch(`/chefs/${chefId}/status`, { status })
  }

  // Получение товаров повара
  async getChefProducts(chefId, params = {}) {
    return adminApi.get(`/chefs/${chefId}/products`, params)
  }

  // Получение заказов повара
  async getChefOrders(chefId, params = {}) {
    return adminApi.get(`/chefs/${chefId}/orders`, params)
  }

  // Получение отзывов о поваре
  async getChefReviews(chefId, params = {}) {
    return adminApi.get(`/chefs/${chefId}/reviews`, params)
  }

  // Статистика повара
  async getChefStats(chefId) {
    return adminApi.get(`/chefs/${chefId}/stats`)
  }

  // Верификация повара
  async verifyChef(chefId) {
    return adminApi.patch(`/chefs/${chefId}/verify`)
  }

  // Отклонение повара
  async rejectChef(chefId, reason) {
    return adminApi.patch(`/chefs/${chefId}/reject`, { reason })
  }

  // Поиск поваров
  async searchChefs(query, params = {}) {
    return adminApi.get('/chefs/search', { query, ...params })
  }

  // Получение имени повара (для хлебных крошек)
  async getChefName(chefId) {
    const chef = await this.getChefById(chefId)
    return chef.name || `Повар #${chefId}`
  }
}

export const chefsApi = new ChefsApi()