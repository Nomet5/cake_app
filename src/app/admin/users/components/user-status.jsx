// app/admin/users/components/user-status.jsx
'use client'

import { useState, useEffect } from 'react'

export default function UserStatus({ user }) {
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

  // Определяем статус на основе данных пользователя
  const getStatusInfo = (user) => {
    const hasOrders = user._count?.orders > 0
    const hasChefProfile = user.chefProfile !== null
    const isRecent = new Date(user.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // За последние 7 дней
    const hasReviews = user._count?.reviews > 0
    
    if (hasChefProfile) {
      return {
        label: 'Повар',
        color: 'from-orange-400 to-red-500',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-200',
        icon: '👨‍🍳',
        glow: 'shadow-orange-200',
        priority: 4
      }
    }
    
    if (hasOrders && hasReviews) {
      return {
        label: 'Активный+',
        color: 'from-emerald-400 to-green-500',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        borderColor: 'border-emerald-200',
        icon: '⭐',
        glow: 'shadow-emerald-200',
        priority: 3
      }
    }
    
    if (hasOrders) {
      return {
        label: 'Активный',
        color: 'from-green-400 to-emerald-500',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        icon: '✅',
        glow: 'shadow-green-200',
        priority: 2
      }
    }
    
    if (isRecent) {
      return {
        label: 'Новый',
        color: 'from-blue-400 to-cyan-500',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        icon: '🆕',
        glow: 'shadow-blue-200',
        priority: 1
      }
    }
    
    return {
      label: 'Обычный',
      color: 'from-gray-400 to-gray-500',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      icon: '👤',
      glow: 'shadow-gray-200',
      priority: 0
    }
  }

  const statusInfo = getStatusInfo(user)

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-500 transform
      ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor}
      ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
      ${pulse ? statusInfo.glow + ' animate-pulse' : 'hover-lift'}
      hover:scale-105 group relative overflow-hidden
    `}>
      {/* Анимированный градиентный фон для высокоприоритетных статусов */}
      {statusInfo.priority >= 2 && (
        <div className={`absolute inset-0 bg-gradient-to-r ${statusInfo.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full`}></div>
      )}
      
      {/* Иконка с анимацией */}
      <span className={`
        text-base mr-2 transition-all duration-300 relative z-10
        ${statusInfo.priority >= 3 ? 'animate-bounce' : ''}
        group-hover:scale-110
      `}>
        {statusInfo.icon}
      </span>
      
      {/* Текст статуса */}
      <span className="relative z-10 font-medium">
        {statusInfo.label}
      </span>
      
      {/* Индикатор для новых пользователей */}
      {statusInfo.priority === 1 && (
        <div className="absolute -top-1 -right-1">
          <div className="relative">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 left-0"></div>
          </div>
        </div>
      )}
      
      {/* Полоска активности для поваров */}
      {statusInfo.priority === 4 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      )}
      
      {/* Подсказка при наведении */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
        {statusInfo.priority === 4 && 'Профиль повара'}
        {statusInfo.priority === 3 && 'Активный пользователь с отзывами'}
        {statusInfo.priority === 2 && 'Совершал заказы'}
        {statusInfo.priority === 1 && 'Новый пользователь'}
        {statusInfo.priority === 0 && 'Обычный пользователь'}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )
}