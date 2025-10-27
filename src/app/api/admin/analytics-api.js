// lib/api/admin/analytics-api.js
import { adminApi } from './admin-api'

export class AnalyticsApi {
  // Общая аналитика
  async getOverview(period = 'month') {
    return adminApi.get('/analytics/overview', { period })
  }

  // Аналитика продаж
  async getSalesAnalytics(params = {}) {
    return adminApi.get('/analytics/sales', params)
  }

  // Аналитика пользователей
  async getUsersAnalytics(params = {}) {
    return adminApi.get('/analytics/users', params)
  }

  // Аналитика товаров
  async getProductsAnalytics(params = {}) {
    return adminApi.get('/analytics/products', params)
  }

  // Аналитика поваров
  async getChefsAnalytics(params = {}) {
    return adminApi.get('/analytics/chefs', params)
  }

  // Географическая аналитика
  async getGeographicAnalytics() {
    return adminApi.get('/analytics/geographic')
  }

  // Отчет по доходам
  async getRevenueReport(startDate, endDate) {
    return adminApi.get('/analytics/reports/revenue', { startDate, endDate })
  }

  // Отчет по заказам
  async getOrdersReport(startDate, endDate) {
    return adminApi.get('/analytics/reports/orders', { startDate, endDate })
  }

  // Пользовательские отчеты
  async getCustomReport(reportConfig) {
    return adminApi.post('/analytics/reports/custom', reportConfig)
  }

  // Экспорт отчетов
  async exportReport(reportType, format = 'csv', params = {}) {
    return adminApi.exportData(`/analytics/reports/${reportType}`, format, params)
  }

  // Ключевые метрики
  async getKeyMetrics(period = 'month') {
    return adminApi.get('/analytics/key-metrics', { period })
  }

  // Сравнительная аналитика
  async getComparisonAnalytics(period1, period2) {
    return adminApi.get('/analytics/comparison', { period1, period2 })
  }
}

export const analyticsApi = new AnalyticsApi()