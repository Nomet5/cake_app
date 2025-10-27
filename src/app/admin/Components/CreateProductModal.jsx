// src/app/admin/Components/CreateProductModal.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct } from '../../actions/admin/product.actions'

export default function CreateProductModal() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    chefId: '',
    categoryId: '',
    isAvailable: 'true'
  })

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        router.back()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('chefId', formData.chefId)
      if (formData.categoryId) {
        formDataToSend.append('categoryId', formData.categoryId)
      }
      formDataToSend.append('isAvailable', formData.isAvailable)

      const result = await createProduct(formDataToSend)

      if (result.error) {
        setError(result.error)
      } else {
        router.back()
        router.refresh()
      }
    } catch (err) {
      setError('Произошла ошибка при создании товара')
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      router.back()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Создание товара</h2>
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Название товара */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Название товара *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите название товара"
              />
            </div>

            {/* Описание */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите описание товара"
              />
            </div>

            {/* Цена */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Цена *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            {/* ID повара */}
            <div>
              <label htmlFor="chefId" className="block text-sm font-medium text-gray-700 mb-1">
                ID повара *
              </label>
              <input
                type="number"
                id="chefId"
                name="chefId"
                value={formData.chefId}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите ID повара"
              />
            </div>

            {/* ID категории */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                ID категории (опционально)
              </label>
              <input
                type="number"
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите ID категории"
              />
            </div>

            {/* Доступность */}
            <div>
              <label htmlFor="isAvailable" className="block text-sm font-medium text-gray-700 mb-1">
                Доступность
              </label>
              <select
                id="isAvailable"
                name="isAvailable"
                value={formData.isAvailable}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Доступен</option>
                <option value="false">Не доступен</option>
              </select>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Создание...' : 'Создать товар'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>

        {/* Информация */}
        <div className="bg-gray-50 border-t px-6 py-4">
          <h3 className="font-medium text-gray-800 mb-2 text-sm">Информация:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Поля помеченные * обязательны для заполнения</li>
            <li>• Цена должна быть больше 0</li>
            <li>• Повар должен существовать и быть активным</li>
            <li>• Категория должна существовать (если указана)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}