// app/admin/products/components/product-status.jsx
'use client'

import { toggleProductAvailable } from "../../../actions/admin/product.actions"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ProductStatus({ product }) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    // Анимация появления с небольшой задержкой
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 200)

    // Периодическая пульсация для привлечения внимания
    const pulseTimer = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 1000)
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearInterval(pulseTimer)
    }
  }, [])

  const handleToggleStatus = async () => {
    try {
      const result = await toggleProductAvailable(product.id)
      if (result.success) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error toggling product status:', error)
    }
  }

  // Определяем статус на основе данных продукта
  const getStatusInfo = (product) => {
    const isAvailable = product.isAvailable
    const hasOrders = product._count?.orderItems > 0
    const hasReviews = product._count?.reviews > 0
    const isRecent = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // За последние 7 дней
    const isPopular = hasOrders && hasReviews
    const isTopRated = hasReviews && product.averageRating >= 4.5

    if (isAvailable && isTopRated) {
      return {
        label: 'Топовый',
        color: 'from-yellow-400 to-amber-500',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
        icon: '🏆',
        glow: 'shadow-yellow-200',
        priority: 5,
        description: 'Высокий рейтинг и популярность'
      }
    }

    if (isAvailable && isPopular) {
      return {
        label: 'Популярный',
        color: 'from-emerald-400 to-green-500',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        borderColor: 'border-emerald-200',
        icon: '🔥',
        glow: 'shadow-emerald-200',
        priority: 4,
        description: 'Популярный продукт с заказами и отзывами'
      }
    }

    if (isAvailable && hasOrders) {
      return {
        label: 'Активный',
        color: 'from-green-400 to-emerald-500',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        icon: '✅',
        glow: 'shadow-green-200',
        priority: 3,
        description: 'Активный продукт с заказами'
      }
    }

    if (isAvailable && isRecent) {
      return {
        label: 'Новый',
        color: 'from-blue-400 to-cyan-500',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        icon: '🆕',
        glow: 'shadow-blue-200',
        priority: 2,
        description: 'Недавно добавленный продукт'
      }
    }

    if (isAvailable) {
      return {
        label: 'Доступен',
        color: 'from-green-300 to-green-400',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-100',
        icon: '📦',
        glow: 'shadow-green-100',
        priority: 1,
        description: 'Продукт доступен для заказа'
      }
    }

    // Недоступные статусы
    if (!isAvailable && hasOrders) {
      return {
        label: 'Распродан',
        color: 'from-purple-400 to-pink-500',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
        borderColor: 'border-purple-200',
        icon: '⏸️',
        glow: 'shadow-purple-200',
        priority: 0,
        description: 'Ранее популярный, сейчас недоступен'
      }
    }

    return {
      label: 'Недоступен',
      color: 'from-red-400 to-orange-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      icon: '🚫',
      glow: 'shadow-red-200',
      priority: -1,
      description: 'Продукт временно недоступен'
    }
  }

  const statusInfo = getStatusInfo(product)

  return (
    <button
      onClick={handleToggleStatus}
      className={`
        inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border-2 
        transition-all duration-500 transform cursor-pointer relative overflow-hidden group
        ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor}
        ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
        ${pulse ? statusInfo.glow + ' animate-pulse' : 'hover-lift'}
        hover:scale-105 active:scale-95
      `}
    >
      {/* Анимированный градиентный фон для высокоприоритетных статусов */}
      {statusInfo.priority >= 2 && (
        <div className={`absolute inset-0 bg-gradient-to-r ${statusInfo.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full`}></div>
      )}
      
      {/* Иконка с анимацией */}
      <span className={`
        text-base mr-2 transition-all duration-300 relative z-10
        ${statusInfo.priority >= 4 ? 'animate-bounce' : ''}
        ${statusInfo.priority === 5 ? 'animate-pulse' : ''}
        group-hover:scale-110
      `}>
        {statusInfo.icon}
      </span>
      
      {/* Текст статуса */}
      <span className="relative z-10 font-medium">
        {statusInfo.label}
      </span>
      
      {/* Индикатор для новых продуктов */}
      {statusInfo.priority === 2 && (
        <div className="absolute -top-1 -right-1">
          <div className="relative">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-0 left-0"></div>
          </div>
        </div>
      )}
      
      {/* Индикатор для топовых продуктов */}
      {statusInfo.priority === 5 && (
        <div className="absolute -top-1 -right-1">
          <div className="relative">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full absolute top-0 left-0"></div>
          </div>
        </div>
      )}
      
      {/* Полоска активности для популярных продуктов */}
      {statusInfo.priority >= 3 && (
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${statusInfo.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
      )}
      
      {/* Эффект переключения */}
      <div className={`
        absolute inset-0 rounded-full transition-all duration-300
        ${product.isAvailable ? 'bg-green-500' : 'bg-red-500'} 
        opacity-0 group-hover:opacity-10
      `}></div>
      
      {/* Подсказка при наведении */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
        {statusInfo.description}
        <div className="text-xs text-gray-300 mt-1">
          {product.isAvailable ? 'Нажмите, чтобы скрыть' : 'Нажмите, чтобы показать'}
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>

      {/* Счетчики для популярных продуктов */}
      {(statusInfo.priority >= 3 || statusInfo.priority === 0) && (
        <div className="absolute -top-2 -left-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {product._count?.orderItems > 0 && (
            <span className="w-4 h-4 bg-blue-500 text-white text-[8px] rounded-full flex items-center justify-center">
              {product._count.orderItems}
            </span>
          )}
          {product._count?.reviews > 0 && (
            <span className="w-4 h-4 bg-green-500 text-white text-[8px] rounded-full flex items-center justify-center">
              {product._count.reviews}
            </span>
          )}
        </div>
      )}
    </button>
  )
}