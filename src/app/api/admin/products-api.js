// lib/api/admin/products-api.js
import { adminApi } from './admin-api'

export class ProductsApi {
  // Получение списка товаров
  async getProducts(params = {}) {
    return adminApi.getList('/products', params)
  }

  // Получение товара по ID
  async getProductById(productId) {
    return adminApi.getById('/products', productId)
  }

  // Создание товара
  async createProduct(productData) {
    return adminApi.create('/products', productData)
  }

  // Обновление товара
  async updateProduct(productId, productData) {
    return adminApi.update('/products', productId, productData)
  }

  // Удаление товара
  async deleteProduct(productId) {
    return adminApi.deleteById('/products', productId)
  }

  // Изменение статуса товара
  async changeProductStatus(productId, status) {
    return adminApi.patch(`/products/${productId}/status`, { status })
  }

  // Обновление инвентаря
  async updateInventory(productId, stock) {
    return adminApi.patch(`/products/${productId}/inventory`, { stock })
  }

  // Обновление цены
  async updatePrice(productId, price) {
    return adminApi.patch(`/products/${productId}/price`, { price })
  }

  // Загрузка изображений
  async uploadProductImage(productId, imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    return adminApi.request(`/products/${productId}/images`, {
      method: 'POST',
      body: formData,
      headers: {} // Убираем Content-Type для FormData
    })
  }

  // Удаление изображения
  async deleteProductImage(productId, imageId) {
    return adminApi.delete(`/products/${productId}/images/${imageId}`)
  }

  // Получение отзывов о товаре
  async getProductReviews(productId, params = {}) {
    return adminApi.get(`/products/${productId}/reviews`, params)
  }

  // Статистика товара
  async getProductStats(productId) {
    return adminApi.get(`/products/${productId}/stats`)
  }

  // Поиск товаров
  async searchProducts(query, params = {}) {
    return adminApi.get('/products/search', { query, ...params })
  }

  // Получение названия товара (для хлебных крошек)
  async getProductName(productId) {
    const product = await this.getProductById(productId)
    return product.title || product.name || `Товар #${productId}`
  }

  // Пакетное обновление
  async bulkUpdateProducts(ids, updateData) {
    return adminApi.bulkUpdate('/products', ids, updateData)
  }

  // Пакетное удаление
  async bulkDeleteProducts(ids) {
    return adminApi.bulkDelete('/products', ids)
  }
}

export const productsApi = new ProductsApi()