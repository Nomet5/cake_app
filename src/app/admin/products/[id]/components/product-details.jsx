// app/admin/products/[id]/components/product-details.jsx
'use client'

import { toggleProductAvailable } from "../../../../actions/admin/product.actions"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { 
  AnimatedContainer,
  AnimatedButton,
  FloatingElement,
  SubtleHover,
  AnimatedCounter 
} from '../../../Components/animation-component'

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
      label: 'Название продукта',
      value: product.name,
      icon: '🏷️',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      delay: 0
    },
    {
      label: 'Описание',
      value: product.description || 'Описание отсутствует',
      icon: '📄',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      fullWidth: true,
      delay: 50
    },
    {
      label: 'Цена',
      value: `${product.price} ₽`,
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      delay: 100
    },
    {
      label: 'Категория',
      value: product.category?.name || 'Не указана',
      icon: '📂',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      delay: 150
    },
    {
      label: 'Повар',
      value: product.chef?.businessName || product.chef?.user?.firstName,
      icon: '👨‍🍳',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      delay: 200
    },
    {
      label: 'Email повара',
      value: product.chef?.user?.email,
      icon: '📧',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      delay: 250
    },
    {
      label: 'Телефон повара',
      value: product.chef?.user?.phone || 'Не указан',
      icon: '📞',
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      delay: 300
    },
    {
      label: 'Статус продукта',
      value: product.isAvailable ? 'Доступен для заказа' : 'Недоступен',
      icon: product.isAvailable ? '✅' : '⏸️',
      color: product.isAvailable ? 'from-green-500 to-emerald-500' : 'from-red-500 to-orange-500',
      bgColor: product.isAvailable ? 'bg-green-50' : 'bg-red-50',
      status: true,
      delay: 350
    },
    {
      label: 'Дата создания',
      value: new Date(product.createdAt).toLocaleString('ru-RU'),
      icon: '📅',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      delay: 400
    },
    {
      label: 'Последнее обновление',
      value: new Date(product.updatedAt).toLocaleString('ru-RU'),
      icon: '✏️',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      delay: 450
    }
  ]

  const stats = [
    {
      label: 'Заказов',
      value: product._count?.orderItems || 0,
      icon: '📦',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      delay: 500
    },
    {
      label: 'Отзывов',
      value: product._count?.reviews || 0,
      icon: '⭐',
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      delay: 550
    },
    {
      label: 'В корзинах',
      value: product._count?.cartItems || 0,
      icon: '🛒',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      delay: 600
    },
    {
      label: 'Изображений',
      value: product.images?.length || 0,
      icon: '🖼️',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      delay: 650
    }
  ]

  return (
    <AnimatedContainer animation="fadeInUp" delay={200} className="h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FloatingElement speed="slow">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">📝</span>
              </div>
            </FloatingElement>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Детали продукта</h3>
              <p className="text-sm text-gray-600">Основная информация о продукте</p>
            </div>
          </div>
          
          <AnimatedButton
            variant={product.isAvailable ? "danger" : "success"}
            size="md"
            onClick={handleToggleStatus}
            loading={isLoading}
            className="min-w-[140px]"
          >
            {product.isAvailable ? 'Деактивировать' : 'Активировать'}
          </AnimatedButton>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {details.map((detail, index) => (
            <AnimatedContainer
              key={detail.label}
              animation="fadeInUp"
              delay={detail.delay}
              className={detail.fullWidth ? 'md:col-span-2' : ''}
            >
              <FloatingElement speed="normal">
                <SubtleHover>
                  <div className={`p-4 ${detail.bgColor} rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 group h-full`}>
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 bg-gradient-to-r ${detail.color} rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-white text-lg">{detail.icon}</span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          {detail.label}
                        </div>
                        <div className={`text-sm font-medium leading-relaxed ${
                          detail.status 
                            ? (product.isAvailable ? 'text-green-700' : 'text-red-700')
                            : 'text-gray-900'
                        }`}>
                          {detail.value}
                        </div>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    {detail.status && (
                      <div className="flex items-center mt-3">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          product.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-500">
                          {product.isAvailable ? 'Продукт доступен для заказа' : 'Продукт временно недоступен'}
                        </span>
                      </div>
                    )}
                  </div>
                </SubtleHover>
              </FloatingElement>
            </AnimatedContainer>
          ))}
        </div>

        {/* Statistics Section */}
        <AnimatedContainer animation="fadeInUp" delay={700}>
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Статистика продукта
              </h4>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Активность
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((stat, index) => (
                <AnimatedContainer
                  key={stat.label}
                  animation="scaleIn"
                  delay={stat.delay}
                >
                  <FloatingElement speed="fast">
                    <SubtleHover>
                      <div className={`p-4 ${stat.bgColor} rounded-xl border border-gray-200 text-center group hover:shadow-md transition-all duration-300`}>
                        {/* Icon */}
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-2xl">{stat.icon}</span>
                        </div>
                        
                        {/* Value */}
                        <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                          <AnimatedCounter 
                            value={stat.value}
                            duration={2000}
                            format={true}
                          />
                        </div>
                        
                        {/* Label */}
                        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          {stat.label}
                        </div>

                        {/* Hover Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
                      </div>
                    </SubtleHover>
                  </FloatingElement>
                </AnimatedContainer>
              ))}
            </div>
          </div>
        </AnimatedContainer>

        {/* Quick Actions */}
        <AnimatedContainer animation="fadeInUp" delay={800} className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-3 justify-center">
            <AnimatedButton
              variant="primary"
              size="sm"
              className="flex items-center space-x-2"
            >
              <span>✏️</span>
              <span>Редактировать</span>
            </AnimatedButton>
            
            <AnimatedButton
              variant="secondary"
              size="sm"
              className="flex items-center space-x-2"
            >
              <span>👁️</span>
              <span>Просмотр на сайте</span>
            </AnimatedButton>
            
            <AnimatedButton
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <span>📊</span>
              <span>Аналитика</span>
            </AnimatedButton>
          </div>
        </AnimatedContainer>
      </div>
    </AnimatedContainer>
  )
}