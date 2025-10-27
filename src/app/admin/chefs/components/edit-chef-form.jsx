'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateChef } from "../../../../../actions/admin/chefs.actions"
import ChefImageUpload from "./chef-image-upload"

export default function EditChefForm({ chef }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: chef.name || '',
    email: chef.email || '',
    phone: chef.phone || '',
    specialization: chef.specialization || '',
    experience: chef.experience || '',
    status: chef.status || 'active',
    description: chef.description || '',
    address: chef.address || '',
    avatar: chef.avatar || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateChef(chef.id, formData)
      
      if (result.success) {
        router.push(`/admin/chefs/${chef.id}`)
        router.refresh()
      } else {
        alert(`Ошибка: ${result.error}`)
      }
    } catch (error) {
      alert('Произошла ошибка при сохранении')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      avatar: imageUrl
    }))
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Колонка с аватаром */}
        <div className="lg:col-span-1">
          <ChefImageUpload 
            currentImage={formData.avatar}
            onImageChange={handleImageChange}
            chefName={formData.name}
          />
        </div>
        
        {/* Основные поля */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Имя повара *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Введите имя повара"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
              Специализация *
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Например: Итальянская кухня"
            />
          </div>
        </div>
      </div>

      {/* Контактная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Телефон
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="+7 (999) 123-45-67"
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Опыт работы
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Выберите опыт</option>
            <option value="Менее 1 года">Менее 1 года</option>
            <option value="1-3 года">1-3 года</option>
            <option value="3-5 лет">3-5 лет</option>
            <option value="5-10 лет">5-10 лет</option>
            <option value="Более 10 лет">Более 10 лет</option>
          </select>
        </div>
      </div>

      {/* Статус и адрес */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Статус *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="active">Активен</option>
            <option value="inactive">Неактивен</option>
            <option value="pending">На проверке</option>
            <option value="banned">Заблокирован</option>
          </select>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Адрес
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Город, улица, дом"
          />
        </div>
      </div>

      {/* Текстовые поля */}
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Описание повара
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Расскажите о поваре, его опыте и специализации..."
          />
        </div>
      </div>

      {/* Разделитель */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Дополнительная информация</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">ID повара:</span>
            <span className="font-mono text-gray-900">{chef.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Дата регистрации:</span>
            <span className="text-gray-900">
              {new Date(chef.joinedAt).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Выполнено заказов:</span>
            <span className="text-gray-900">{chef.ordersCompleted || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Рейтинг:</span>
            <span className="text-gray-900">{chef.rating || 'Нет оценок'}</span>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>
    </form>
  )
}