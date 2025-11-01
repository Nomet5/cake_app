// app/admin/products/[id]/components/product-details.jsx
'use client'

import { toggleProductAvailable } from "../../../../../lib/actions/product.actions"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProductDetails({ product }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleStatus = async () => {
    setIsLoading(true)
    try {
      const result = await toggleProductAvailable(product.id)
      if (result.success) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error toggling product status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const details = [
    {
      label: 'Название',
      value: product.name,
      icon: '🏷️'
    },
    {
      label: 'Описание',
      value: product.description || 'Описание отсутствует',
      icon: '📄',
      fullWidth: true
    },
    {
      label: 'Цена',
      value: `${product.price} ₽`,
      icon: '💰'
    },
    {
      label: 'Категория',
      value: product.category?.name || 'Не указана',
      icon: '📂'
    },
    {
      label: 'Повар',
      value: product.chef?.businessName || product.chef?.user?.firstName,
      icon: '👨‍🍳'
    },
    {
      label: 'Email повара',
      value: product.chef?.user?.email,
      icon: '📧'
    },
    {
      label: 'Телефон повара',
      value: product.chef?.user?.phone || 'Не указан',
      icon: '📞'
    },
    {
      label: 'Статус',
      value: product.isAvailable ? 'Доступен' : 'Недоступен',
      icon: '🟢',
      status: true
    },
    {
      label: 'Создан',
      value: new Date(product.createdAt).toLocaleString('ru-RU'),
      icon: '📅'
    },
    {
      label: 'Обновлен',
      value: new Date(product.updatedAt).toLocaleString('ru-RU'),
      icon: '✏️'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">📝</span>
          Детали продукта
        </h3>
        
        <button
          onClick={handleToggleStatus}
          disabled={isLoading}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
            product.isAvailable
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Загрузка...</span>
            </div>
          ) : (
            product.isAvailable ? 'Деактивировать' : 'Активировать'
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {details.map((detail, index) => (
          <div 
            key={detail.label}
            className={`p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 animate-slide-in-right ${
              detail.fullWidth ? 'md:col-span-2' : ''
            }`}
            style={{ animationDelay: `${0.1 + index * 0.05}s` }}
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg mt-1">{detail.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-500 mb-1">
                  {detail.label}
                </div>
                <div className={`text-gray-900 ${detail.fullWidth ? 'leading-relaxed' : 'font-semibold'} ${
                  detail.status ? `font-bold ${product.isAvailable ? 'text-green-600' : 'text-red-600'}` : ''
                }`}>
                  {detail.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Дополнительная информация</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{product._count?.orderItems || 0}</div>
            <div className="text-xs text-blue-600">Заказов</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">{product._count?.reviews || 0}</div>
            <div className="text-xs text-yellow-600">Отзывов</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{product._count?.cartItems || 0}</div>
            <div className="text-xs text-green-600">В корзинах</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{product.images?.length || 0}</div>
            <div className="text-xs text-purple-600">Изображений</div>
          </div>
        </div>
      </div>
    </div>
  )
}