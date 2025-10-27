// lib/api/admin/dashboard-api.js
import { adminApi } from './admin-api'

export class DashboardApi {
  // Основная статистика
  async getStats() {
    return adminApi.get('/dashboard/stats')
  }

  // Статистика по периодам
  async getStatsByPeriod(startDate, endDate) {
    return adminApi.get('/dashboard/stats/period', { startDate, endDate })
  }

  // График доходов
  async getRevenueChartData(period = 'month') {
    return adminApi.get('/dashboard/charts/revenue', { period })
  }

  // График заказов
  async getOrdersChartData(period = 'month') {
    return adminApi.get('/dashboard/charts/orders', { period })
  }

  // Топ товаров
  async getTopProducts(limit = 10) {
    return adminApi.get('/dashboard/top-products', { limit })
  }

  // Топ поваров
  async getTopChefs(limit = 10) {
    return adminApi.get('/dashboard/top-chefs', { limit })
  }

  // Последние активности
  async getRecentActivities(limit = 20) {
    return adminApi.get('/dashboard/recent-activities', { limit })
  }

  // Статистика в реальном времени
  async getRealtimeStats() {
    return adminApi.get('/dashboard/realtime-stats')
  }

  // Уведомления
  async getNotifications() {
    return adminApi.get('/dashboard/notifications')
  }

  // Маркер уведомления как прочитанного
  async markNotificationAsRead(notificationId) {
    return adminApi.patch(`/dashboard/notifications/${notificationId}/read`)
  }
}

export const dashboardApi = new DashboardApi()